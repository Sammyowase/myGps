import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";  // Correct import
import 'leaflet/dist/leaflet.css';
import "./App.css"

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setError(null);
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError("Permission to access location was denied");
              break;
            case err.POSITION_UNAVAILABLE:
              setError("Location information is unavailable");
              break;
            case err.TIMEOUT:
              setError("The request to get user location timed out");
              break;
            default:
              setError("An unknown error occurred");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const WatchLocation = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setError(null);
        },
        (err) => {
          setError("Unable to retrieve your location");
        }
      );
      setWatchId(id);
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId); 
      setWatchId(null);
      setError('Location tracking stopped'); 
    }
  };

  return (
    <div className="App">
      <h1>Real-Time GPS Location</h1>

      <button onClick={getLocation}>Get My Location</button>
      <button onClick={WatchLocation}>Start Location</button>
      <button onClick={stopTracking}>Stop Location</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>

          <MapContainer
  className="map-container"
  center={[location.latitude, location.longitude]}
  zoom={13}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[location.latitude, location.longitude]}>
    <Popup>Your current location</Popup>
  </Marker>
</MapContainer>

        </div>
      )}
    </div>
  );
};

export default App;