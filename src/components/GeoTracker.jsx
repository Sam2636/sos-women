// src/components/GeoTracker.jsx
import React, { useState } from 'react';
import { Button, Typography, Box, Stack, Paper, Avatar } from '@mui/material';
import { LocationOn, StopCircle, MyLocation } from '@mui/icons-material';

const GeoTracker = () => {
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [error, setError] = useState('');

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          long: position.coords.longitude.toFixed(6),
        });
        setError('');
      },
      (err) => setError(err.message),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  const handleStop = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        bgcolor: '#f0f4f8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 4,
          bgcolor: 'white',
        }}
      >
        <Avatar
          sx={{
            mx: 'auto',
            mb: 2,
            bgcolor: '#1976d2',
            width: 64,
            height: 64,
          }}
        >
          <MyLocation fontSize="large" />
        </Avatar>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          SOS GeoTracker
        </Typography>

        <Stack spacing={2} direction="row" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            startIcon={<LocationOn />}
            color="primary"
            onClick={handleGetLocation}
          >
            Start Tracking
          </Button>

          <Button
            variant="outlined"
            startIcon={<StopCircle />}
            color="primary"
            onClick={handleStop}
          >
            Stop
          </Button>
        </Stack>

        {location && (
          <Box mt={4}>
            <Typography variant="h6">📍 Latitude: {location.lat}</Typography>
            <Typography variant="h6">📍 Longitude: {location.long}</Typography>
          </Box>
        )}

        {error && (
          <Typography mt={3} color="text.secondary" fontStyle="italic">
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default GeoTracker;