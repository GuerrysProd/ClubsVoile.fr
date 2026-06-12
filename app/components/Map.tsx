// app/components/Map.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Club {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  phone: string;
  city: string;
  rating: number;
}

export default function Map({ clubs }: { clubs: Club[] }) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    // Initialiser la carte
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([46.2276, 2.2137], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Ajouter les clubs à la carte
    if (mapRef.current && clubs.length > 0) {
      // Supprimer les anciens markers
      if (markersRef.current) {
        mapRef.current.removeLayer(markersRef.current);
      }

      // Créer un groupe de markers (clustering)
      const featureGroup = L.featureGroup();

      clubs.forEach((club) => {
        if (club.latitude && club.longitude) {
          const marker = L.marker([club.latitude, club.longitude])
            .bindPopup(`
              <div style="color: #333; padding: 10px;">
                <h3 style="margin: 0 0 5px 0;">${club.name}</h3>
                <p style="margin: 5px 0; font-size: 0.9rem;">
                  📍 ${club.city}<br>
                  ⭐ ${club.rating.toFixed(1)}<br>
                  📞 ${club.phone || 'Non disponible'}
                </p>
                <a href="/club/${club.id}" style="color: #0099ff; text-decoration: none; font-weight: 600;">
                  Voir plus →
                </a>
              </div>
            `);

          featureGroup.addLayer(marker);
        }
      });

      mapRef.current.addLayer(featureGroup);
      markersRef.current = featureGroup as any;

      // Centrer sur les clubs
      if (clubs.length > 0) {
        mapRef.current.fitBounds(featureGroup.getBounds().pad(0.1));
      }
    }
  }, [clubs]);

  return (
    <div
      id="map"
      style={{
        height: '600px',
        borderRadius: '16px',
        border: '2px solid rgba(0, 212, 255, 0.2)',
        overflow: 'hidden',
      }}
    />
  );
}
