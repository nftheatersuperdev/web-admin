import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import config from 'config'
import styled from 'styled-components'
import { Page as BasePage } from 'layout/LayoutRoute'

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

export default function ChargingStations(): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleMapsApiKey,
  })

  return <Page>{isLoaded ? <GoogleMap id="google-map" center={center} zoom={10} /> : null}</Page>
}
