"use client";

import { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebase/config";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import styles from "./dashboard.module.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dynamically import the map to avoid SSR issues
const NasaMap = dynamic(() => import("../components/NasaMap"), { ssr: false });

// Helper to format UNIX timestamp
const formatTime = (ts) => {
  if (!ts) return "";
  const date = new Date(ts * 1000);
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
};

// Filter data by date range
const filterByDate = (data, start, end) =>
  data.filter((d) => {
    const ts = d.timestamp * 1000;
    return ts >= start.getTime() && ts <= end.getTime();
  });

export default function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [mlResults, setMlResults] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [nasaData, setNasaData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Fetch Firebase Sensor Data
    const sensorRef = ref(db, "sensorData");
    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map((key) => ({
          id: key,
          temperature: Number(data[key]?.prediction_temp || 0),
          wave_index: Number(data[key]?.wave_index || 0),
          lat: Number(data[key]?.lat || 0),
          lon: Number(data[key]?.lon || 0),
          timestamp: Number(data[key]?.timestamp || 0),
          time: formatTime(Number(data[key]?.timestamp || 0)),
        }));
        setSensorData(arr);
      }
    });

    // Fetch Firebase ML Results
    const mlRef = ref(db, "mlResults");
    onValue(mlRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map((key) => ({
          id: key,
          predicted_temp: Number(data[key]?.predicted_temp || 0),
          predicted_wave_index: Number(data[key]?.predicted_wave_index || 0),
          timestamp: Number(data[key]?.timestamp || 0),
          time: formatTime(Number(data[key]?.timestamp || 0)),
        }));
        setMlResults(arr);
      }
    });
  }, []);

  // Filtered data by date
  const filteredSensorData =
    startDate && endDate
      ? filterByDate(sensorData, new Date(startDate), new Date(endDate))
      : sensorData;

  const filteredMlResults =
    startDate && endDate
      ? filterByDate(mlResults, new Date(startDate), new Date(endDate))
      : mlResults;

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />

      <header className={styles.header}>
        <h1>🌡️ Live Sensor & ML Data Dashboard</h1>
        <p>
          This dashboard shows live sensor readings and machine learning predictions
          from your ocean monitoring buoys. You can filter data by date to analyze trends.
        </p>

        <div className={styles.dateFilter}>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
      </header>

      {/* Sensor Data Chart */}
      <section className={styles.section}>
        <h2>Live Sensor Data</h2>
        <p>
          Shows real-time temperature and wave index readings from ocean buoys.
          Use this to monitor environmental changes in the monitored area.
        </p>
        {filteredSensorData.length === 0 && <p>No sensor data available</p>}
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredSensorData}>
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
              <Line type="monotone" dataKey="wave_index" stroke="#007bff" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ML Predictions Chart */}
      <section className={styles.section}>
        <h2>ML Predictions</h2>
        <p>
          Shows predicted temperature and wave index from our machine learning
          models. Compare these predictions to live sensor readings.
        </p>
        {filteredMlResults.length === 0 && <p>No ML prediction data available</p>}
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredMlResults}>
              <Line type="monotone" dataKey="predicted_temp" stroke="#82ca9d" />
              <Line type="monotone" dataKey="predicted_wave_index" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* NASA Buoy Map */}
      <section className={styles.section}>
        <h2>🗺️ NASA Buoy Map</h2>
        <p>
          Visualizes buoy locations and sensor measurements. Clicking a marker highlights
          that sensor's data in the charts above.
        </p>
        <NasaMap
          nasaData={nasaData} // optional live API fetch inside NasaMap
          sensorData={sensorData}
          onMarkerClick={(data) => setSelectedSensor(data.id)}
        />
      </section>
    </div>
  );
}
