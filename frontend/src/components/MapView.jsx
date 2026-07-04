import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default Leaflet marker icons don't load correctly with Vite's bundler
// unless we point them at the CDN explicitly.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * places: [{ name, lat, lon }]
 * No API key required - tiles come from OpenStreetMap's free tile server.
 */
export default function MapView({ places = [], center, zoom = 13, heightClass = "h-64" }) {
  const fallbackCenter = center ?? (places[0] ? [places[0].lat, places[0].lon] : [26.9124, 75.7873]); // Jaipur default

  return (
    <div className={`${heightClass} rounded-xl overflow-hidden border border-(--color-border)`}>
      <MapContainer
        center={fallbackCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((p) => (
          <Marker key={p.name} position={[p.lat, p.lon]} icon={markerIcon}>
            <Popup>{p.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}