"use client";

// Woldia University ICT Directorate coordinates
const ICT_LOCATION = {
  lat: 11.8333,
  lng: 39.6000,
  name: "Woldia University — ICT Directorate",
  address: "Woldia University, Woldia, North Wollo, Ethiopia",
  phone: "+251 33 336 0000",
  hours: "Monday – Friday: 8:00 AM – 5:00 PM",
};

export default function MapPage() {
  const googleMapsUrl = `https://www.google.com/maps?q=${ICT_LOCATION.lat},${ICT_LOCATION.lng}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${ICT_LOCATION.lat},${ICT_LOCATION.lng}`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">ICT Directorate Location</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <p className="font-semibold dark:text-white text-sm">{ICT_LOCATION.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ICT_LOCATION.address}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📞</span>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-medium">Phone</p>
                <p className="text-gray-700 dark:text-gray-300">{ICT_LOCATION.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🕐</span>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-medium">Working Hours</p>
                <p className="text-gray-700 dark:text-gray-300">{ICT_LOCATION.hours}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📍</span>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-medium">Coordinates</p>
                <p className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                  {ICT_LOCATION.lat}°N, {ICT_LOCATION.lng}°E
                </p>
              </div>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <span>🗺️</span> Get Directions
          </a>
        </div>

        {/* Map */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700" style={{ minHeight: "400px" }}>
          <iframe
            title="ICT Directorate Location"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={googleMapsUrl}
          />
        </div>
      </div>

      {/* How to reach */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
        <h2 className="font-semibold dark:text-white mb-3">How to Reach the ICT Directorate</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start gap-2"><span>🏫</span> Located in the main campus administrative building, Ground Floor.</li>
          <li className="flex items-start gap-2"><span>🚶</span> From the main gate, walk straight ahead and turn left at the administration block.</li>
          <li className="flex items-start gap-2"><span>🔵</span> Look for the ICT Directorate sign at the entrance.</li>
          <li className="flex items-start gap-2"><span>📧</span> You can also submit your request online using this system instead of visiting in person.</li>
        </ul>
      </div>
    </div>
  );
}
