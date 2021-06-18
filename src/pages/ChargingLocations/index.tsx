import { useState } from 'react'
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api'
import config from 'config'
import styled from 'styled-components'
import { Page as BasePage } from 'layout/LayoutRoute'
import { useChargingLocations } from 'services/evme'
import { ChargingLocation } from 'services/evme.types'
import ChargingLocationsDialog from './ChargingLocationsDialog'

// Center the map over Bangkok
const center = {
  lat: 13.7563,
  lng: 100.5018,
}

const Page = styled(BasePage)`
  display: flex;
  flex: 1 1 100%;

  #google-map {
    flex: 1 1 auto;
  }
`

export default function ChargingLocations(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeLocation, setActiveLocation] = useState<ChargingLocation>()
  const { data: chargingLocations } = useChargingLocations()
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleMapsApiKey,
  })

  const handleDialogOpen = (location: ChargingLocation) => {
    setIsDialogOpen(true)
    setActiveLocation(location)
  }

  const options = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }

  return (
    <Page>
      {isLoaded ? (
        <GoogleMap id="google-map" center={center} zoom={10}>
          <MarkerClusterer options={options}>
            {(cluster) => {
              return chargingLocations?.edges
                ? chargingLocations?.edges.map(({ node: location }) => (
                    <Marker
                      key={location.id}
                      position={{ lat: location.latitude, lng: location.longitude }}
                      onClick={() => handleDialogOpen(location)}
                      clusterer={cluster}
                    />
                  ))
                : null
            }}
          </MarkerClusterer>
        </GoogleMap>
      ) : null}

      {activeLocation ? (
        <ChargingLocationsDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          location={activeLocation}
        />
      ) : null}
    </Page>
  )
}
