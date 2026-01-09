# Advanced Features Implementation Guide

This document describes the three key features implemented for the real estate platform:

## 1. Advanced Filters System

### Component: `PropertyFiltersAdvanced`

**Location:** `src/components/PropertyFiltersAdvanced.tsx`

**Features:**
- Dynamic price range slider (€0 - €5,000,000)
- Multi-select property types (Apartment, House, Condo, Land, Commercial)
- Portuguese districts filter (20 districts)
- Portuguese typology filter (T0-T5, Loft, Duplex, etc.)
- Energy certificate filter (A+ to F)
- Bedrooms and bathrooms filters
- Area range slider (0 - 1000 m²)
- Amenities checkboxes (pool, garage, elevator, air conditioning)
- Active filters count badge
- Clear all filters button
- Filter persistence using localStorage
- Real-time filtering with 500ms debounce

**Usage:**
```tsx
import PropertyFiltersAdvanced, { AdvancedFilters } from '@/components/PropertyFiltersAdvanced';

function MyPage() {
  const handleFilterChange = (filters: AdvancedFilters) => {
    // Handle filter changes
    console.log('Filters:', filters);
  };

  return (
    <PropertyFiltersAdvanced onFilterChange={handleFilterChange} />
  );
}
```

**Filter State Structure:**
```typescript
interface AdvancedFilters {
  priceRange: [number, number];
  propertyTypes: PropertyType[];
  districts: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  areaRange: [number, number];
  amenities: {
    pool: boolean;
    garage: boolean;
    elevator: boolean;
    airConditioning: boolean;
  };
  energyCertificate: CertificadoEnergetico | null;
  typology: TipologiaPT | null;
}
```

## 2. Image Upload System

### Component: `ImageUploadAdvanced`

**Location:** `src/components/ImageUploadAdvanced.tsx`

**Features:**
- Drag & drop multiple image upload
- File picker as alternative input method
- Real-time image preview
- Automatic image compression (max 1920x1080px)
- Upload progress bar for each image
- Set primary/cover image (star icon)
- Delete images functionality
- Drag to reorder images (using @dnd-kit)
- Integration with Supabase Storage
- Supports up to 10 images by default (configurable)
- Max 5MB per image (configurable)

**Usage:**
```tsx
import ImageUploadAdvanced from '@/components/ImageUploadAdvanced';

function PropertyForm() {
  const [images, setImages] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  return (
    <ImageUploadAdvanced
      images={images}
      onChange={setImages}
      maxImages={10}
      maxSizeMB={5}
      primaryImageIndex={primaryImageIndex}
      onPrimaryImageChange={setPrimaryImageIndex}
    />
  );
}
```

**Supabase Storage Configuration:**
- Bucket name: `property-images`
- File path: `properties/{random-id}-{timestamp}.{ext}`
- Automatic compression using `browser-image-compression`
- Public URL generation for each uploaded image

## 3. Interactive Maps

### Component: `PropertyMapInteractive`

**Location:** `src/components/PropertyMapInteractive.tsx`

**Features:**
- Interactive map using Leaflet.js
- Property markers with custom icons
- Marker clustering for multiple properties (using leaflet.markercluster)
- Property preview popup on marker click
- Three map layers: Streets, Satellite, Terrain
- Custom zoom controls
- Layer switcher
- Property count badge
- Map bounds change detection
- Automatic bounds fitting to show all properties
- Reset view button

**Usage:**
```tsx
import PropertyMapInteractive from '@/components/PropertyMapInteractive';
import { PropertyLocation, MapBounds } from '@/lib/maps';

function PropertiesPage() {
  const properties: PropertyLocation[] = [
    {
      id: '1',
      title: 'Apartamento T3',
      price: 350000,
      latitude: 38.7223,
      longitude: -9.1393,
    },
  ];

  const handlePropertyClick = (propertyId: string) => {
    console.log('Property clicked:', propertyId);
  };

  const handleBoundsChange = (bounds: MapBounds) => {
    console.log('Map bounds changed:', bounds);
  };

  return (
    <PropertyMapInteractive
      properties={properties}
      onPropertyClick={handlePropertyClick}
      onBoundsChange={handleBoundsChange}
      enableClustering={true}
      showControls={true}
      className="h-[600px]"
    />
  );
}
```

### Component: `LocationPicker`

**Location:** `src/components/LocationPicker.tsx`

**Features:**
- Interactive map for selecting property location
- Address search with geocoding (using Nominatim)
- Reverse geocoding (coordinates to address)
- Draggable marker
- Click to place marker
- Real-time coordinate display
- Integration with property forms

**Usage:**
```tsx
import LocationPicker from '@/components/LocationPicker';

function PropertyForm() {
  const handleLocationChange = (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => {
    console.log('Location:', location);
  };

  return (
    <LocationPicker
      address={formData.address}
      latitude={formData.latitude}
      longitude={formData.longitude}
      onLocationChange={handleLocationChange}
    />
  );
}
```

## Dependencies Added

The following dependencies were added to `package.json`:

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "leaflet.markercluster": "^1.5.3",
    "browser-image-compression": "^2.0.2"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.12",
    "@types/leaflet.markercluster": "^1.5.4"
  }
}
```

## Type Updates

Updated `src/types/property.ts` with:
- `latitude?: number` - Property latitude coordinate
- `longitude?: number` - Property longitude coordinate
- `has_pool?: boolean` - Pool amenity flag
- `has_garage?: boolean` - Garage amenity flag
- `has_elevator?: boolean` - Elevator amenity flag
- `has_air_conditioning?: boolean` - Air conditioning amenity flag

## Integration with Existing Components

### PropertyForm Integration

The `PropertyForm` component has been updated to include:
- `ImageUploadAdvanced` for image management
- `LocationPicker` for location selection
- Updated form data to include latitude and longitude

### Demo Page

A demo page has been created at `/demo/advanced-search` that demonstrates:
- Advanced filters in action
- Interactive map with property markers
- List/Map/Both view modes
- Real-time filtering
- Map bounds filtering

## Performance Optimizations

1. **Lazy Loading**: Leaflet is loaded dynamically only when needed
2. **Debouncing**: Filter changes are debounced by 500ms to reduce API calls
3. **Image Compression**: Images are automatically compressed before upload
4. **Marker Clustering**: Multiple nearby properties are grouped into clusters
5. **Code Splitting**: Components use dynamic imports where appropriate

## Error Handling

All components include comprehensive error handling:
- Network errors for image uploads
- Geocoding failures
- Map loading errors
- Invalid file types and sizes
- User-friendly error messages

## Responsive Design

All components are mobile-first and fully responsive:
- Collapsible filter sections
- Touch-friendly controls
- Adaptive layouts for different screen sizes
- Optimized for both desktop and mobile devices

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Geolocation API for location features
- LocalStorage for filter persistence

## Future Enhancements

Potential improvements:
1. Drawing tools for area selection on map
2. Heat map visualization
3. Street view integration
4. Advanced geocoding with multiple providers
5. Image editing tools (crop, rotate, filters)
6. Batch image upload optimization
7. CDN integration for faster image delivery
8. Progressive Web App (PWA) support

## Troubleshooting

### Maps not loading
- Check internet connection
- Verify Leaflet CSS is loaded
- Check browser console for errors

### Images not uploading
- Verify Supabase configuration
- Check storage bucket permissions
- Ensure file size is under limit

### Filters not persisting
- Check browser localStorage is enabled
- Verify no conflicting scripts clearing storage
- Check browser console for errors

## Support

For issues or questions, please refer to:
- Component documentation in source files
- Demo page at `/demo/advanced-search`
- Type definitions in `src/types/`
