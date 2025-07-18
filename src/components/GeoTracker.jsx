// src/components/GeoTracker.jsx
import React, { useEffect, useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { FaExclamationTriangle } from 'react-icons/fa';

const GeoTracker = () => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const userId = uuidv4(); // Ideally, use a persistent ID

  const geoSuccess = (pos) => {
    const coords = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      timestamp: new Date().toISOString(),
    };

    setLocation(coords);
    setLastUpdated(coords.timestamp);
    set(ref(db, 'locations/' + userId), coords);
    console.log('Location updated to Firebase:', coords);
  };

  const geoError = (err) => {
    console.error('Geolocation error:', err);
  };

  const startTracking = () => {
    if (!tracking) {
      const id = navigator.geolocation.watchPosition(geoSuccess, geoError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      });
      setWatchId(id);
      setTracking(true);
      console.log('Tracking started');
    }
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
      console.log('Tracking stopped');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <FaExclamationTriangle size={40} color="red" />
        <h2 style={styles.heading}>AlertBuddy Geo Tracker</h2>
        {location ? (
          <p>
            <strong>Latitude:</strong> {location.lat} <br />
            <strong>Longitude:</strong> {location.lng}
          </p>
        ) : (
          <p style={{ color: '#888' }}>Location not yet tracked</p>
        )}
        {lastUpdated && (
          <p style={styles.timestamp}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}
        <div style={styles.buttonGroup}>
          <button onClick={startTracking} style={styles.startBtn} disabled={tracking}>
            Start SOS
          </button>
          <button onClick={stopTracking} style={styles.stopBtn} disabled={!tracking}>
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  heading: {
    margin: '10px 0 20px',
    color: '#333',
  },
  buttonGroup: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  startBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  stopBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  timestamp: {
    fontSize: '0.85em',
    color: '#555',
    marginTop: 8,
  },
};

export default GeoTracker;
