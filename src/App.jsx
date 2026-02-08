import { useState } from "react";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import Map from "./components/Map";
import { StoryPanel } from "./components/StoryPanel";
import { places } from "./data/places";
import "./App.css";

const hasMapboxToken = !!import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <div className="app-shell">
      <Header />
      <div className="map-wrap">
        {hasMapboxToken ? (
          <MapView
            places={places}
            selectedPlace={selectedPlace}
            onSelect={setSelectedPlace}
          />
        ) : (
          <Map
            places={places}
            selectedPlaceId={selectedPlace?.id ?? null}
            onSelectPlace={setSelectedPlace}
          />
        )}
        <div
          className="map-gradient-overlay"
          aria-hidden="true"
        />
        {!selectedPlace && (
          <p
            className="memory-hint"
            aria-live="polite"
          >
            Click a place on the map to add a personal memory (saved only on your device).
          </p>
        )}
      </div>
      <StoryPanel
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}

export default App;
