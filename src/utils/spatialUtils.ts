import * as turf from '@turf/turf';

/**
 * Calculates a buffer around a GeoJSON Feature or FeatureCollection.
 * @param geojson - GeoJSON input (Feature or FeatureCollection)
 * @param radiusKm - Buffer radius in kilometers
 */
export const calculateBuffer = (
  geojson: any,
  radiusKm: number
): any => {
  if (!geojson) return null;
  try {
    return turf.buffer(geojson, radiusKm, { units: 'kilometers' });
  } catch (error) {
    console.error('Error calculating buffer:', error);
    return null;
  }
};

/**
 * Calculates the centroid of a GeoJSON Feature.
 */
export const calculateCentroid = (geojson: any): any => {
  if (!geojson) return null;
  try {
    return turf.centroid(geojson);
  } catch (error) {
    console.error('Error calculating centroid:', error);
    return null;
  }
};

/**
 * Calculates the area of a GeoJSON Polygon or MultiPolygon in square meters.
 */
export const calculateArea = (geojson: any): number => {
  if (!geojson) return 0;
  try {
    return turf.area(geojson);
  } catch (error) {
    console.error('Error calculating area:', error);
    return 0;
  }
};

/**
 * Generates a set of random points in a bounding box centered around the map center.
 * @param center - Array [lat, lng] representing the center coordinates
 * @param count - Number of points to generate
 * @param radiusKm - Radius of the bounding box in kilometers
 */
export const generateRandomPoints = (
  center: [number, number],
  count: number,
  radiusKm: number = 5
): any => {
  const [lat, lng] = center;
  // Create a bounding box around center (1 degree lat is approx 111km, 1 degree lng is approx 111*cos(lat) km)
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const minLng = lng - lngDelta;
  const minLat = lat - latDelta;
  const maxLng = lng + lngDelta;
  const maxLat = lat + latDelta;

  const points: any[] = [];
  for (let i = 0; i < count; i++) {
    const randomLng = minLng + Math.random() * (maxLng - minLng);
    const randomLat = minLat + Math.random() * (maxLat - minLat);
    
    points.push(
      turf.point([randomLng, randomLat], {
        id: `point-${i}`,
        name: `Lokasi Sampel #${i + 1}`,
        type: ['Fasilitas Kesehatan', 'Sekolah', 'Pasar', 'Kantor Pemerintahan'][Math.floor(Math.random() * 4)],
        capacity: Math.floor(Math.random() * 100) + 10
      })
    );
  }

  return turf.featureCollection(points);
};

/**
 * Counts how many points are inside a given polygon geometry.
 */
export const countPointsInPolygon = (points: any, polygon: any): number => {
  if (!points || !polygon) return 0;
  try {
    const pts = points.features || (points.type === 'Feature' ? [points] : []);
    let count = 0;
    pts.forEach((pt: any) => {
      if (turf.booleanPointInPolygon(pt, polygon)) {
        count++;
      }
    });
    return count;
  } catch (error) {
    console.error('Error counting points in polygon:', error);
    return 0;
  }
};
