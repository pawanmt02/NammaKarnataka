'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DIALECT_REGIONS, KARNATAKA_CENTER, KARNATAKA_ZOOM } from '@/data/regions';
import type { DialectRegion } from '@/types';

interface KarnatakaMapProps {
  onRegionSelect?: (region: DialectRegion) => void;
  selectedRegion?: DialectRegion | null;
}

/**
 * Pure Leaflet interactive dialect map for Karnataka.
 * Native Leaflet DOM mounting ensures 100% compatibility with React 19 and Next.js Turbopack.
 */
export default function KarnatakaMap({ onRegionSelect, selectedRegion }: KarnatakaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fix default Leaflet icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: KARNATAKA_CENTER,
      zoom: KARNATAKA_ZOOM,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    // Add OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Create markers for each dialect zone
    const markers: Record<string, L.CircleMarker> = {};

    DIALECT_REGIONS.forEach((region) => {
      const isSelected = selectedRegion === region.id;
      const marker = L.circleMarker(region.center, {
        color: region.color,
        fillColor: region.color,
        fillOpacity: isSelected ? 0.75 : 0.45,
        radius: isSelected ? 26 : 20,
        weight: isSelected ? 4 : 2,
        className: 'dialect-circle-marker cursor-pointer transition-all',
      }).addTo(map);

      // Construct Popup Content with Kannada script
      const sampleList = (region.samplePhrases || region.sample_phrases || [])
        .map(
          (p) =>
            `<li style="margin-bottom: 4px; padding: 3px 6px; background: #fffbeb; border-radius: 4px; font-size: 11px; color: #78350f;">${p}</li>`
        )
        .join('');

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 220px; color: #1e293b;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${region.color};"></span>
            <strong style="font-size: 14px; color: #0f172a;">${region.name}</strong>
          </div>
          <div style="font-size: 12px; color: #b45309; font-weight: 600; margin-bottom: 6px;">${region.kannada_name}</div>
          <p style="font-size: 11px; line-height: 1.4; color: #475569; margin-bottom: 8px;">${region.description}</p>
          ${
            sampleList
              ? `<div style="margin-top: 6px;">
                  <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Sample Expressions:</span>
                  <ul style="list-style: none; padding: 0; margin: 4px 0 0 0;">${sampleList}</ul>
                </div>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('click', () => {
        onRegionSelect?.(region.id as DialectRegion);
        marker.openPopup();
      });

      markers[region.id] = marker;
    });

    markersRef.current = markers;

    // Force map container layout recalculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // Update marker styles and map pan when selectedRegion changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.entries(markersRef.current).forEach(([regionId, marker]) => {
      const isSelected = selectedRegion === regionId;
      const region = DIALECT_REGIONS.find((r) => r.id === regionId);
      if (!region) return;

      marker.setStyle({
        color: region.color,
        fillColor: region.color,
        fillOpacity: isSelected ? 0.8 : 0.45,
        radius: isSelected ? 26 : 20,
        weight: isSelected ? 4 : 2,
      });

      if (isSelected) {
        marker.openPopup();
        map.flyTo(region.center, Math.max(map.getZoom(), 8), { duration: 1.2 });
      }
    });
  }, [selectedRegion]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <style jsx global>{`
        .leaflet-container {
          height: 100% !important;
          width: 100% !important;
          background: #0f172a !important;
          border-radius: 1rem;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
