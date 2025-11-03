# Google Maps API Integration Guide

## 🗺️ Setting Up Google Maps API for InclusiveHub

Your InclusiveHub application is now ready for Google Maps integration! Follow these steps to enable interactive maps:

### 1. Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (for location search)
   - Geocoding API (for address conversion)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### 2. Configure API Key Restrictions (Recommended)

For security, restrict your API key:
- **Application restrictions**: HTTP referrers
- **Add referrers**: 
  - `http://localhost:5000/*`
  - `https://yourdomain.com/*` (for production)
- **API restrictions**: Select the APIs you enabled above

### 3. Add API Key to InclusiveHub

Add your API key to the `.env` file:

```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Features Enabled with Google Maps API

✅ **Interactive Maps**
- Real Google Maps integration
- Zoom controls and navigation
- Satellite/terrain view options

✅ **Location Markers**
- Custom markers for each accessibility location
- Color-coded by location type (hospitals, restaurants, etc.)
- Click for detailed information

✅ **User Location**
- Detect user's current location
- Center map on user's position
- Navigation to nearby accessible places

✅ **Accessibility Features**
- Info windows with accessibility details
- Direct links to Google Maps for directions
- Search for accessible places nearby

✅ **Enhanced Place Discovery**
- Integration with Google Places API
- Real-time place information
- Reviews and ratings for accessibility

### 5. Testing the Integration

1. Add your API key to `.env`
2. Restart the development server: `npm run dev`
3. Visit http://localhost:5000
4. Navigate to Directory or any page with maps
5. You should see interactive Google Maps!

### 6. Cost Considerations

Google Maps API has usage-based pricing:
- **Free tier**: $200 credit monthly (generous for development)
- **Maps loads**: $7 per 1000 loads after free tier
- **Places searches**: $32 per 1000 requests after free tier

For a small to medium application, you'll likely stay within the free tier.

### 7. Troubleshooting

**Map not loading?**
- Check browser console for errors
- Verify API key is correct in `.env`
- Ensure required APIs are enabled in Google Cloud Console
- Check API key restrictions aren't too strict

**API key showing in network requests?**
- This is normal for client-side Google Maps
- Use domain restrictions for security

### Current Status

✅ Dependencies installed: `@vis.gl/react-google-maps`
✅ MapView component ready for Google Maps
✅ Environment variables configured
✅ Fallback view available without API key
✅ Integration with accessibility features

Your InclusiveHub is ready to provide full Google Maps functionality once you add your API key!