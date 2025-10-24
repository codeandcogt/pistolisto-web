'use client'

import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type { ComponentType } from 'react'

type MapContainerProps = {
  center: [number, number]
  zoom: number
  style: React.CSSProperties
  className: string
  children: React.ReactNode
}

type TileLayerProps = {
  attribution: string
  url: string
}

type MapComponents = {
  MapContainer: ComponentType<MapContainerProps>
  TileLayer: ComponentType<TileLayerProps>
  LocationMarker: ComponentType<Record<string, never>>
}

export default function Map() {
  const [mapComponents, setMapComponents] = useState<MapComponents | null>(null)

  useEffect(() => {
    Promise.all([
      import('react-leaflet'),
      import('@/components/atom')
    ]).then(([leaflet, atom]) => {
      setMapComponents({
        MapContainer: leaflet.MapContainer,
        TileLayer: leaflet.TileLayer,
        LocationMarker: atom.LocationMarker,
      })
    })
  }, [])

  if (!mapComponents) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-green-500">Cargando mapa...</p>
      </div>
    )
  }

  const { MapContainer, TileLayer, LocationMarker } = mapComponents

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* <style jsx global>{`
        .neon-streets {
          background: #0a0a0a !important;
        }
        
        .neon-streets .leaflet-tile-pane {
          filter: grayscale(1) brightness(0.3) contrast(1.5);
          mix-blend-mode: screen;
        }
        
        .neon-streets .leaflet-tile {
          filter: invert(1) hue-rotate(180deg);
          background: #000;
        }
        
        .neon-streets .leaflet-marker-pane {
          filter: none !important;
          mix-blend-mode: normal !important;
        }
        
        .neon-streets .leaflet-marker-icon {
          filter: none !important;
        }
        
        .neon-streets .leaflet-tile-pane::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .neon-streets path {
          stroke: #00ff00 !important;
          filter: drop-shadow(0 0 3px #00ff00);
        }
      `}</style> */}
      
      <MapContainer
        center={[14.6349, -90.5069]}
        zoom={13}
        style={{ 
          height: '100%', 
          width: '100%',
        }}
        className="neon-streets"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  )
}