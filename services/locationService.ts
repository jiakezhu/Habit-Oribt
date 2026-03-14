
export const getLocationName = async (): Promise<string> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve("Unknown Location");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (!response.ok) throw new Error('Geocoding failed');

          const data = await response.json();
          const addr = data.address;
          
          if (addr) {
             // Prioritize readable parts: Country, City (or equiv), Road
             const country = addr.country;
             const city = addr.city || addr.town || addr.village || addr.county || addr.state_district;
             const street = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood;

             const parts = [country, city, street].filter(Boolean);
             if (parts.length > 0) {
                 resolve(parts.join(', '));
                 return;
             }
          }
          // Fallback if parsing fails but coords work
          resolve(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°W`);
        } catch (error) {
          // Fallback if fetch fails (offline)
          resolve(`Sector ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
      },
      (error) => {
        console.error("Location access denied or failed:", error);
        resolve("Orbit Station Alpha"); // Thematic fallback
      },
      { timeout: 8000 }
    );
  });
};
