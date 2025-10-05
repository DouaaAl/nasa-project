"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function NasaMap() {
  const [buoys, setBuoys] = useState([]);

  useEffect(() => {
    async function fetchBuoys() {
      try {
        const res = await fetch("/api/nasaBuoys");
        const data = await res.json();
        setBuoys(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBuoys();
  }, []);

  if (buoys.length === 0) return <p>Loading NASA buoy data...</p>;

  const center = [buoys[0].lat, buoys[0].lon];

  return (
    <MapContainer center={center} zoom={4} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {buoys.map((b) => (
        <Marker key={b.id} position={[b.lat, b.lon]}>
          <Popup>
            <strong>{b.id}</strong>
            <br />
            Temp: {b.temperature} °C
            <br />
            Wave: {b.wave_height} m
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
