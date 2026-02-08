import { useState } from "react";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import Map from "./components/Map";
import { StoryPanel } from "./components/StoryPanel";
import { AddPlaceModal } from "./components/AddPlaceModal";
import { loadAllPlaces, saveUserPlace } from "./data/places";
import "./App.css";

const hasMapboxToken = !!import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [addPlaceModalOpen, setAddPlaceModalOpen] = useState(false);
  const [places, setPlaces] = useState(() => loadAllPlaces());

  const handleAddPlace = (place) => {
    saveUserPlace(place);
    setPlaces(loadAllPlaces());
    setSelectedPlace(place);
    setAddPlaceModalOpen(false);
  };

  return (
    <div className="app-shell">
      <Header onAddPlace={() => setAddPlaceModalOpen(true)} />
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
      {addPlaceModalOpen && (
        <AddPlaceModal
          onClose={() => setAddPlaceModalOpen(false)}
          onAdd={handleAddPlace}
        />
      )}
    </div>
  );
}

export default App;
