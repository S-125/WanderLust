document.addEventListener("DOMContentLoaded", async function () {
  const { title, location, geometry } = window.listingData;

  let lat, lng;

  // Use saved geometry if available
  if (geometry && geometry.coordinates && geometry.coordinates.length === 2) {
    lng = geometry.coordinates[0];
    lat = geometry.coordinates[1];
  } else {
    // Geocode using Nominatim if geometry is missing
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      } else {
        console.error("No coordinates found for:", location);
        lat = 22.5726; // default Kolkata
        lng = 88.3639;
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      lat = 22.5726;
      lng = 88.3639;
    }
  }

  // Initialize map
  const map = L.map("map").setView([lat, lng], 12);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Custom red home marker
  const homeIcon = L.divIcon({
    html: `<div style="
              background-color: red;
              color: white;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              font-size: 16px;
          ">
          <i class="fa-solid fa-house"></i>
          </div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -35] // shift popup above marker
  });

  const marker = L.marker([lat, lng], { icon: homeIcon }).addTo(map);
  marker.bindPopup(`<b>${title}</b><br>${location}`).openPopup();
});
