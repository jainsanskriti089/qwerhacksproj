import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PLACES, MAP_CENTER, MAP_ZOOM } from '../data/places';
import './Map.css';

// Fix default marker icons in react-leaflet (webpack/vite)
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Ensures map view fits all markers when places change (optional).
 */
function FitBounds({ places }) {
  const map = useMap();
  useMemo(() => {
    if (!places?.length) return;
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 });
  }, [map, places]);
  return null;
}

/**
 * Map with markers from source-of-truth place data.
 * Works standalone; no dependency on StoryPanel, AI, audio, or global state.
 *
 * @param {{ places?: import('../data/places').Place[], onSelectPlace?: (place: import('../data/places').Place) => void, selectedPlaceId?: string | null, fitBounds?: boolean }} props
 */
export default function Map({
  places = PLACES,
  onSelectPlace,
  selectedPlaceId = null,
  fitBounds = false,
}) {
  return (
    <MapContainer
      center={[MAP_CENTER.lat, MAP_CENTER.lng]}
      zoom={MAP_ZOOM}
      className="map-container"
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {fitBounds && places.length > 0 && <FitBounds places={places} />}
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          eventHandlers={{
            click: () => onSelectPlace?.(place),
          }}
        >
          <Popup className="place-popup" minWidth={240}>
            <div className="place-popup__inner" data-status={place.status}>
              <p className="place-popup__name">{place.name}</p>
              <p className="place-popup__city">{place.city}</p>
              {onSelectPlace && (
                <button
                  type="button"
                  className="place-popup__btn"
                  onClick={() => onSelectPlace(place)}
                >
                  Read story
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
