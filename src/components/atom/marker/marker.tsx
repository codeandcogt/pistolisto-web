"use client"

import { Icon } from "leaflet"
import React from "react"
import { Marker, Popup, useMapEvents } from "react-leaflet"

const icon = new Icon({
  iconUrl: '/image/alfiler.png',
  iconSize: [30,30],
  iconAnchor: [41, 41]
})

export function LocationMarker() {
  const [position, setPosition] = React.useState<[number, number]>([14.6349, -90.5069])

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      console.log('Nueva posición:', e.latlng.lat, e.latlng.lng)
    }
  })

  return (
    <Marker position={position} icon={icon} draggable={false}>
      <Popup>
        Lat: {position[0].toFixed(4)}<br />
        Lng: {position[1].toFixed(4)}
      </Popup>
    </Marker>
  )
}