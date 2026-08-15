"""
🪐 Jagannath Hora Web — FastAPI backend
Vedic calculation engine (Lahiri/sidereal) using astronomy-engine.

Endpoints mirror the architecture doc:
  POST /api/v1/charts/birth        -> full Rashi + varga + dasha + panchang
  POST /api/v1/dashas/vimshottari  -> vimshottari dasha timeline
  POST /api/v1/panchang/daily      -> panchang for a date/place
  POST /api/v1/matching/compatibility -> ashta koota match
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import math

import astronomy

# astronomy.Time expects UT days since 2000-01-01 12:00 UT
UT_EPOCH = datetime(2000, 1, 1, 12, 0)


def to_ut(dt: datetime) -> float:
    return (dt - UT_EPOCH).total_seconds() / 86400.0


app = FastAPI(title="Jagannath Hora Web API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- constants ----------
SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]
PLANET_KEYS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati",
]
NAKSHATRA_RULERS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter",
                    "Saturn", "Mercury"] * 3
VIMSHOTTARI = [("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10), ("Mars", 7),
               ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)]


# ---------- models ----------
class BirthData(BaseModel):
    date: str  # YYYY-MM-DD (local)
    time: str  # HH:MM (local)
    latitude: float
    longitude: float
    timezone_offset: float = Field(5.5, alias="timezoneOffset")
    place: str = ""
    gender: str = "male"

    class Config:
        populate_by_name = True


# ---------- helpers ----------
def norm360(x):
    return x % 360.0


def birth_to_utc(b: BirthData) -> datetime:
    y, m, d = map(int, b.date.split("-"))
    hh, mm = map(int, b.time.split(":"))
    naive = datetime(y, m, d, hh, mm)
    return naive - timedelta(hours=b.timezone_offset)


def julian_day(dt: datetime) -> float:
    return dt.timestamp() / 86400.0 + 2440587.5


def lahiri_ayanamsa(jd: float) -> float:
    days = jd - 2451545.0
    return 23.85 + days * (50.25 / 3600.0 / 365.25)


def mean_node_longitude(jd: float) -> float:
    T = (jd - 2451545.0) / 36525.0
    omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T \
        + T**3 / 467441 - T**4 / 60616000
    return norm360(omega)


def planet_sidereal_longitudes(dt_utc: datetime):
    jd = julian_day(dt_utc)
    ayan = lahiri_ayanamsa(jd)
    result = {}

    bodies = {
        "Sun": astronomy.Body.Sun, "Moon": astronomy.Body.Moon,
        "Mars": astronomy.Body.Mars, "Mercury": astronomy.Body.Mercury,
        "Jupiter": astronomy.Body.Jupiter, "Venus": astronomy.Body.Venus, "Saturn": astronomy.Body.Saturn,
    }
    t = astronomy.Time(to_ut(dt_utc))
    for name, body in bodies.items():
        vec = astronomy.GeoVector(body, t, True)
        ecl = astronomy.Ecliptic(vec)
        result[name] = norm360(ecl.elon - ayan)

    rahu = mean_node_longitude(jd)
    result["Rahu"] = norm360(rahu - ayan)
    result["Ketu"] = norm360(rahu + 180 - ayan)
    return result, ayan, jd


def ascendant(dt_utc: datetime, lat: float) -> float:
    t = astronomy.Time(to_ut(dt_utc))
    gast = astronomy.SiderealTime(t)  # hours
    ramc = gast * 15.0
    eps = 23.4367
    phi = math.radians(lat)
    asc = math.atan2(
        math.cos(math.radians(ramc)),
        -(math.sin(math.radians(ramc)) * math.cos(math.radians(eps))
          + math.tan(phi) * math.sin(math.radians(eps))),
    ) * 180.0 / math.pi
    ayan = lahiri_ayanamsa(julian_day(dt_utc))
    return norm360(asc - ayan)


def varga_sign(longitude: float, division: int) -> int:
    absv = norm360(longitude)
    rashi = int(absv // 30) % 12
    pos = absv - rashi * 30
    if division == 1:
        return rashi
    if division == 2:
        is_odd = rashi % 2 == 0
        first = pos < 15
        return 4 if (is_odd and first) or (not is_odd and not first) else 3
    if division == 30:
        if rashi % 2 == 0:
            limits = [(5, 0), (10, 10), (18, 8), (25, 2), (30, 4)]
        else:
            limits = [(5, 1), (12, 5), (20, 9), (25, 11), (30, 7)]
        for b, s in limits:
            if pos < b:
                return s
        return 4
    part = int(pos // (30.0 / division))
    nature = rashi % 3
    base = rashi if nature == 0 else (rashi + 8) % 12 if nature == 1 else (rashi + 4) % 12
    step = 12 // division if 12 % division == 0 else 1
    return (base + part * step) % 12


def build_vimshottari(b: BirthData, moon_long: float):
    jd = julian_day(birth_to_utc(b))
    total = 360 / 27
    nak = int(norm360(moon_long) // total) % 27
    within = norm360(moon_long) - nak * total
    frac = within / total
    start_planet = NAKSHATRA_RULERS[nak]
    seq = VIMSHOTTARI[VIMSHOTTARI.index((start_planet, dict(VIMSHOTTARI)[start_planet])):]
    seq += VIMSHOTTARI[:VIMSHOTTARI.index((start_planet, dict(VIMSHOTTARI)[start_planet]))]
    first_years = seq[0][1]
    elapsed = frac * first_years
    start = birth_to_utc(b) - timedelta(days=elapsed * 365.25)
    out = []
    cursor = start
    for planet, years in seq:
        end = cursor + timedelta(days=years * 365.25)
        out.append({"planet": planet, "start": cursor.date().isoformat(),
                    "end": end.date().isoformat(), "years": years})
        cursor = end
    return out


def compute_panchang(b: BirthData):
    longs, ayan, jd = planet_sidereal_longitudes(birth_to_utc(b))
    sun = longs["Sun"]
    moon = longs["Moon"]
    tithi_arc = norm360(moon - sun)
    tithi_idx = int(tithi_arc // 12)
    nak = int(norm360(moon) // (360 / 27)) % 27
    yoga_idx = int(norm360(sun + moon) // (360 / 27)) % 27
    return {
        "tithi": {"index": tithi_idx, "name": ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
               "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
               "Trayodashi", "Chaturdashi", "Purnima", "Pratipada", "Dwitiya", "Tritiya",
               "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
               "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"][tithi_idx]},
        "nakshatra": {"index": nak, "name": NAKSHATRAS[nak], "ruler": NAKSHATRA_RULERS[nak]},
        "yoga": {"index": yoga_idx, "name": ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
               "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
               "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
               "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"][yoga_idx]},
        "sun_rashi": SIGNS[int(sun // 30) % 12],
        "moon_rashi": SIGNS[int(moon // 30) % 12],
    }


def nakshatra_of(longitude):
    return int(norm360(longitude) // (360 / 27)) % 27


def pada_of(longitude):
    within = norm360(longitude) - nakshatra_of(longitude) * (360 / 27)
    return min(4, int(within // ((360 / 27) / 4)) + 1)


def compute_match(boy: BirthData, girl: BirthData):
    lb, _, _ = planet_sidereal_longitudes(birth_to_utc(boy))
    lg, _, _ = planet_sidereal_longitudes(birth_to_utc(girl))
    bNak = nakshatra_of(lb["Moon"])
    gNak = nakshatra_of(lg["Moon"])
    bRashi = int(lb["Moon"] // 30) % 12
    gRashi = int(lg["Moon"] // 30) % 12
    bPada = pada_of(lb["Moon"])
    gPada = pada_of(lg["Moon"])

    varna = 1.0 if (bNak % 4) >= (gNak % 4) else 0.5
    tara = (((gNak - bNak) % 27) + 27) % 27 + 1
    tara_pts = [0, 1.5, 3, 0, 3, 0, 3, 0, 3, 3][tara - 1]
    gana_b = (bNak // 9) % 3
    gana_g = (gNak // 9) % 3
    gana = 6 if gana_b == gana_g else (1 if (gana_b == 2 or gana_g == 2) else 5)
    d = ((gRashi - bRashi) % 12 + 12) % 12
    bhakoot = 0 if d in (1, 5, 7, 11) else 7
    nadi_b = (bNak * 4 + (bPada - 1)) % 3
    nadi_g = (gNak * 4 + (gPada - 1)) % 3
    nadi = 0 if nadi_b == nadi_g else 8
    total = varna + 2 + tara_pts + 4 + 5 + gana + bhakoot + nadi
    return {"total_guna": total, "max_guna": 36, "percentage": round(total / 36 * 100, 1),
            "boy_rashi": SIGNS[bRashi], "girl_rashi": SIGNS[gRashi],
            "boy_nakshatra": NAKSHATRAS[bNak], "girl_nakshatra": NAKSHATRAS[gNak]}


# ---------- endpoints ----------
@app.get("/")
def root():
    return {"service": "Jagannath Hora Web API", "status": "ok"}


@app.post("/api/v1/charts/birth")
def charts_birth(b: BirthData):
    longs, ayan, jd = planet_sidereal_longitudes(birth_to_utc(b))
    asc = ascendant(birth_to_utc(b), b.latitude)
    planets = []
    for key in PLANET_KEYS:
        lon = longs[key]
        sign = int(lon // 30) % 12
        deg = lon - sign * 30
        nak = nakshatra_of(lon)
        planets.append({
            "key": key, "longitude": round(lon, 4), "sign": SIGNS[sign],
            "degree_in_sign": round(deg, 2), "nakshatra": NAKSHATRAS[nak],
            "pada": pada_of(lon),
            "house": int(norm360(lon - asc) // 30) + 1,
        })
    vargas = {}
    for div, name in [(1, "D1"), (9, "D9"), (3, "D3"), (10, "D10"), (12, "D12"), (16, "D16")]:
        signs_occ = [[] for _ in range(12)]
        for key in PLANET_KEYS:
            signs_occ[varga_sign(longs[key], div)].append(key)
        vargas[name] = {"division": div, "planets_by_sign": signs_occ}
    return {
        "ayanamsa": round(ayan, 4),
        "ascendant": {"longitude": round(asc, 4), "sign": SIGNS[int(asc // 30) % 12],
                      "degree_in_sign": round(asc - int(asc // 30) * 30, 2)},
        "planets": planets,
        "vargas": vargas,
        "vimshottari": build_vimshottari(b, longs["Moon"]),
        "panchang": compute_panchang(b),
    }


@app.post("/api/v1/dashas/vimshottari")
def dashas_vimshottari(b: BirthData):
    longs, _, _ = planet_sidereal_longitudes(birth_to_utc(b))
    return {"vimshottari": build_vimshottari(b, longs["Moon"])}


@app.post("/api/v1/panchang/daily")
def panchang_daily(b: BirthData):
    return compute_panchang(b)


@app.post("/api/v1/matching/compatibility")
def matching_compatibility(boy: BirthData, girl: BirthData):
    return compute_match(boy, girl)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
