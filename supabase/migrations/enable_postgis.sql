-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geometry column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);

-- Create spatial index for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_location 
ON properties USING GIST (location);

-- Function to update location from latitude/longitude
CREATE OR REPLACE FUNCTION update_property_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update location
DROP TRIGGER IF EXISTS trigger_update_location ON properties;
CREATE TRIGGER trigger_update_location
  BEFORE INSERT OR UPDATE OF latitude, longitude
  ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_property_location();

-- Function to find properties within radius (in meters)
CREATE OR REPLACE FUNCTION properties_within_radius(
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_radius_meters INTEGER DEFAULT 5000
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price NUMERIC,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.latitude,
    p.longitude,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography
    ) as distance_meters
  FROM properties p
  WHERE p.location IS NOT NULL
    AND ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
      p_radius_meters
    )
  ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;
