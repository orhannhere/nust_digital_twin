import { useEffect, useState } from "react";
import { MapContainer, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const directionOptions = {
  "East (+x)": "x",
  "West (-x)": "-x",
  "North (+y)": "y",
  "South (-y)": "-y",
  "NE (+x+y)": "+x+y",
  "SW (-x-y)": "-x-y",
  "SE (+x-y)": "+x-y",
  "NW (-x+y)": "-x+y",
};

const speeds = ["1ms", "5ms"];

const WindDashboard = () => {
  const [data, setData] = useState({ points: [] });
  const [speed, setSpeed] = useState("1ms");
  const [direction, setDirection] = useState("East (+x)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/data/${speed}_${directionOptions[direction]}.json`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to load data:", error);
        setData({ points: [] });
      }
    };
    fetchData();
  }, [speed, direction]);

  const bounds = [[0, 0], [452, 100]];
  const imageUrl = "/assets/nust_img.jpg";

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
        🌍 NUST Campus Wind Visualization Dashboard
      </h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label>Speed:&nbsp;</label>
          <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
            {speeds.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Direction:&nbsp;</label>
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            {Object.keys(directionOptions).map((dir) => (
              <option key={dir} value={dir}>{dir}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ border: "2px solid #ccc", borderRadius: "12px", overflow: "hidden" }}>
        <MapContainer
          center={[226, 50]}
          zoom={1}
          scrollWheelZoom={false}
          style={{ height: "500px", width: "100%" }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay url={imageUrl} bounds={bounds} />
          {data.points.map((pt, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: `${452 - pt.y}px`,
                left: `${pt.x}px`,
                color: "#007BFF",
                fontSize: "12px",
                fontWeight: "bold",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
              }}
            >
              {pt.v.toFixed(1)} m/s
            </div>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default WindDashboard;