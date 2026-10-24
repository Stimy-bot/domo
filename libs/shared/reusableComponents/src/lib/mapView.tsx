// libs/shared/reusableComponents/src/lib/mapView.tsx
import { useMarkers } from '@domo/hooks';
import { MapComponent } from './mapComponent';

const MapView = () => {
  const rawBase = process.env.VITE_API_URL || '';
  const cleanBase = rawBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const fetchUrl = `${cleanBase}api/markers`;
  const { markers, loading, error } = useMarkers(fetchUrl);

  if (loading) return <p>Fetching markers...</p>;

  if (error) {
    return (
      <div style={{ padding: '1rem', color: 'red', border: '1px solid red' }}>
        <h3>Backend Error</h3>
        <p>
          Attempted: <code>{fetchUrl}</code>
        </p>
        <p>{error}</p>
      </div>
    );
  }

  return <MapComponent markers={markers} />;
};

export { MapView };
