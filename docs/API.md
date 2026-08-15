# 🪐 Jagannath Hora Web — Backend API

A FastAPI service that mirrors the client-side Vedic calculation engine and exposes
a REST API for developers.

## Run

```bash
pip install -r backend/python/requirements.txt
cd backend/python
uvicorn main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

## Endpoints

All chart/dasha calculations use **Lahiri (Chitrapaksha) ayanamsa** and sidereal (fixed-star) zodiac, consistent with the web frontend.

### POST `/api/v1/charts/birth`
Full birth chart for a given birth.
```json
{
  "date": "1990-07-15", "time": "14:30",
  "latitude": 28.6139, "longitude": 77.209,
  "timezoneOffset": 5.5, "place": "New Delhi"
}
```
Returns: `ayanamsa`, `ascendant` (sign + degree), `planets[]` (sign, degree, nakshatra, pada, house), `vargas` (D1/D3/D9/D10/D12/D16 occupancy), `vimshottari` dasha list, and `panchang`.

### POST `/api/v1/dashas/vimshottari`
Returns the Vimshottari mahadasha sequence (planet, start, end, years) starting from the Moon's nakshatra lord.

### POST `/api/v1/panchang/daily`
Returns Tithi, Nakshatra (with ruler), Yoga, and Sun/Moon rashi for the birth moment.

### POST `/api/v1/matching/compatibility`
Body: `{ "boy": <BirthData>, "girl": <BirthData> }`.
Returns Ashta Koota `total_guna` / `max_guna`, `percentage`, and the couple's rashis/nakshatras.

## Notes
- Ephemeris: `astronomy-engine` (pure Python, no native deps).
- House system: equal-house from the sidereal Lagna.
- The frontend does not depend on this API; it performs identical calculations client-side.
