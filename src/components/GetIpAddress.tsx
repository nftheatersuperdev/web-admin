import axios from 'axios'
import styled from 'styled-components'
import { useEffect } from 'react'
import dayjs from 'dayjs'

export interface GeoLocationObject {
  IPv4: string
  city: string
  country_code: string
  country_name: string
  latitude: number
  longitude: number
  postal: string
  state: string
}

export const USER_IP_ADDRESS = 'evme:user:ipaddress'
export const FETCH_IP_ADDRESS_TIME = 'evme:user:ipaddress:fetch-time'
export const FETCH_INTERVIAL_TIME = 30000 // time in milliseconds, default is 30000 (30 seconds)

export const storeInLocalStorage = (ip: string): void => {
  const timestamp = +dayjs().add(FETCH_INTERVIAL_TIME, 'milliseconds')
  localStorage.setItem(FETCH_IP_ADDRESS_TIME, String(timestamp))
  return localStorage.setItem(USER_IP_ADDRESS, ip)
}

export const getIpInLocalStorage = (): string => {
  return localStorage.getItem(FETCH_IP_ADDRESS_TIME) || ''
}

export const ensureToFetchAgain = (): boolean => {
  const fetchTime = getIpInLocalStorage()
  const fetchAgain = +new Date() > +fetchTime
  if (!fetchTime || fetchAgain) {
    return true
  }
  return false
}

export const fetchIpAddress = async (): Promise<string> => {
  try {
    if (!ensureToFetchAgain()) {
      return getIpInLocalStorage()
    }

    const { IPv4 } = await axios
      .get('https://geolocation-db.com/json/')
      .then((response) => response.data as GeoLocationObject)

    storeInLocalStorage(IPv4)

    return IPv4
  } catch (error) {
    console.error('baseApi error: ', error)
    return ''
  }
}

const EmptyDiv = styled.div`
  display: none;
`

export default function GetIpAddress(): JSX.Element {
  useEffect(() => {
    fetchIpAddress()
  }, [])

  return <EmptyDiv />
}
