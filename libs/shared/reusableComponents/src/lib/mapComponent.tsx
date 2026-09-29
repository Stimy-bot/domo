import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";
import { useState, useMemo, useRef, useEffect } from "react";
import type { Marker } from "@domo/hooks";

interface MapComponentProps {
  markers: Marker[];
  height?: string;
  width?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ markers, height = "600px", width = "100%" }) => {
  const { isLoaded, loadError } = useLoadScript({
    // Type-safe fallback for import.meta.env inside monorepo libraries
    googleMapsApiKey: (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_MAP_API_KEY ?? "",
  });

  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const center = useMemo(() => {
    const firstMarker = markers[0];
    if (firstMarker) {
      return {
        lat: Number(firstMarker.position.lat),
        lng: Number(firstMarker.position.lng)
      };
    }
    return { lat: 38.885215, lng: -76.956672 };
  }, [markers]);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      mapRef.current.panTo(center);
    }
  }, [center, markers.length]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (loadError) return <div className="p-4 text-red-500">Error loading Maps. Check API Key.</div>;
  if (!isLoaded) return <div className="p-4">Initializing Map...</div>;

  return (
    <GoogleMap
      key={`${center.lat}-${center.lng}`}
      mapContainerStyle={{ width, height }}
      center={center}
      zoom={12}
      onLoad={onMapLoad}
      onClick={() => setActiveMarker(null)}
    >
      {markers.map((marker) => (
        <MarkerF
          key={marker.id}
          position={{
            lat: Number(marker.position.lat),
            lng: Number(marker.position.lng)
          }}
          onClick={() => setActiveMarker(marker.id)}
        >
          {activeMarker === marker.id && (
            <InfoWindowF
              onCloseClick={() => setActiveMarker(null)}
              position={{
                lat: Number(marker.position.lat),
                lng: Number(marker.position.lng)
              }}
            >
              <div style={{ color: "#000", minWidth: "150px" }}>
                <h4 style={{ margin: "0 0 5px 0" }}>{marker.name}</h4>
                <p style={{ margin: 0, fontSize: "12px" }}>
                  Coordinates: {marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)}
                </p>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  );
};

export { MapComponent };