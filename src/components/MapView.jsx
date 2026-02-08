import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PlaceMarker } from "./PlaceMarker";

const US_CENTER = [-98, 39];
const DEFAULT_ZOOM = 3.5;

export function MapView({ places, selectedPlace, onSelect }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      console.warn("MapView: VITE_MAPBOX_TOKEN is not set; map will not load.");
      return;
    }
    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: US_CENTER,
      zoom: DEFAULT_ZOOM,
    });
    return () => {
      markersRef.current.forEach(({ marker, root }) => {
        marker.remove();
        root.unmount();
      });
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !places.length) return;

    markersRef.current.forEach(({ marker, root }) => {
      marker.remove();
      root.unmount();
    });
    markersRef.current = [];

    places.forEach((place) => {
      const el = document.createElement("div");
      el.className = "mapbox-marker-wrapper";
      const root = createRoot(el);
      root.render(
        <PlaceMarker
          status={place.status}
          isSelected={selectedPlace?.id === place.id}
          onClick={() => onSelectRef.current(place)}
          aria-label={`Map marker for ${place.name}, ${place.city}`}
        />
      );
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([place.lng, place.lat])
        .addTo(map);
      markersRef.current.push({ marker, root });
    });

    return () => {
      markersRef.current.forEach(({ marker, root }) => {
        marker.remove();
        root.unmount();
      });
      markersRef.current = [];
    };
  }, [places, selectedPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlace) return;
    map.flyTo({
      center: [selectedPlace.lng, selectedPlace.lat],
      zoom: 10,
      duration: 1200,
    });
  }, [selectedPlace]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ minHeight: 300 }}
    />
  );
}
