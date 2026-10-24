"""
Namma Kannada API - Geo-Notifications Router
Location-based phrase-of-the-day and region metadata.
"""

from fastapi import APIRouter

from app.models.schemas import DialectRegion, GeoNotification
from app.services.dialect_translator import DialectTranslatorService

router = APIRouter(prefix="/geo", tags=["Geo-Notifications"])

# Static region metadata with center coordinates
REGION_DATA = [
    {
        "id": DialectRegion.NORTH_KARNATAKA,
        "name": "North Karnataka (Uttara Karnataka)",
        "center_lat": 15.85,
        "center_lng": 75.71,
        "description": "Dharwad, Belgaum, Bijapur — known for the robust and expressive Uttara Kannada dialect.",
    },
    {
        "id": DialectRegion.SOUTH_KARNATAKA,
        "name": "South Karnataka (Dakshina Karnataka)",
        "center_lat": 12.30,
        "center_lng": 76.64,
        "description": "Mysuru, Mandya — the heartland of classical Kannada with a melodic tone.",
    },
    {
        "id": DialectRegion.COASTAL_KARNATAKA,
        "name": "Coastal Karnataka (Karavali)",
        "center_lat": 13.34,
        "center_lng": 74.74,
        "description": "Mangaluru, Udupi, Kundapura — coastal dialect with Tulu and Konkani influences.",
    },
    {
        "id": DialectRegion.OLD_MYSURU,
        "name": "Old Mysuru Region",
        "center_lat": 11.93,
        "center_lng": 76.94,
        "description": "Chamarajanagar, Hassan — retains archaic Kannada forms and rural vocabulary.",
    },
    {
        "id": DialectRegion.HYDERABAD_KARNATAKA,
        "name": "Hyderabad Karnataka (Kalyana Karnataka)",
        "center_lat": 17.33,
        "center_lng": 76.83,
        "description": "Gulbarga, Raichur, Bidar — Deccani Urdu influence blends with Kannada.",
    },
    {
        "id": DialectRegion.MALNAD,
        "name": "Malnad Region",
        "center_lat": 13.93,
        "center_lng": 75.57,
        "description": "Shimoga, Chikmagalur — Havyaka Kannada spoken in the Western Ghats.",
    },
    {
        "id": DialectRegion.KODAGU,
        "name": "Kodagu (Coorg)",
        "center_lat": 12.42,
        "center_lng": 75.74,
        "description": "Coorg — distinct Kodava dialect with unique vocabulary and intonation.",
    },
    {
        "id": DialectRegion.SOLIGA,
        "name": "Soliga Tribal Region",
        "center_lat": 11.92,
        "center_lng": 77.13,
        "description": "BR Hills — tribal Soliga dialect preserving ancient Dravidian roots.",
    },
    {
        "id": DialectRegion.STANDARD,
        "name": "Standard Kannada (Shaale Kannada)",
        "center_lat": 12.97,
        "center_lng": 77.59,
        "description": "Bengaluru — the standardized literary and educational form of Kannada.",
    },
]


@router.get("/phrase-of-day/{region}", response_model=GeoNotification)
async def get_phrase_of_the_day(region: DialectRegion):
    """Get the phrase of the day for a specific dialect region."""
    translator = DialectTranslatorService()
    result = await translator.get_phrase_of_the_day(region=region)
    return GeoNotification(**result)


@router.get("/regions")
async def list_regions():
    """Return all dialect regions with metadata and coordinates."""
    return REGION_DATA
