/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useAuth } from 'auth/AuthContext'
import { ResellerServiceArea } from 'services/web-bff/admin-user.type'
import { getLocationList } from 'services/web-bff/location'

interface LocationSwitcherProps {
  onLocationChanged: (location: ResellerServiceArea | null) => void
  currentLocationId?: string | null
}
interface SelectOption {
  label: string
  value: string
}

export const allLocationId = '00000000-0000-0000-0000-000000000000'

export default function LocationSwitcher({
  onLocationChanged,
  currentLocationId,
}: LocationSwitcherProps): JSX.Element {
  const useStyles = makeStyles({
    paddingLocation: {
      paddingTop: '18px',
    },
    autoCompleteSelect: {
      marginTop: '10px',
      '& fieldSet': {
        borderColor: '#424E63',
      },
    },
  })
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { getResellerServiceAreas } = useAuth()

  const userServiceAreas = getResellerServiceAreas()
  const allLocationSelectOption = {
    label: t('dashboard.allLocation'),
    value: allLocationId,
  }

  function mapLocationSelectOptionFields(location: ResellerServiceArea | null | undefined) {
    if (!location) {
      return allLocationSelectOption
    }
    return {
      label: location[i18n.language === 'th' ? 'areaNameTh' : 'areaNameEn'],
      value: location.id,
    }
  }

  function mapLocationSelectOptions(locations: ResellerServiceArea[]) {
    return locations.map((location) => mapLocationSelectOptionFields(location))
  }

  function generateSelectOptions(locations: ResellerServiceArea[]) {
    if (userServiceAreas && userServiceAreas.length > 1) {
      return mapLocationSelectOptions(
        locations.filter((location) =>
          userServiceAreas.find((serviceArea) => serviceArea.id === location.id)
        )
      )
    }
    return mapLocationSelectOptions(locations)
  }

  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>()
  const { data } = useQuery('get-location', () => getLocationList(), {
    refetchOnWindowFocus: false,
  })
  const availableLocations = data?.locations || []

  const onSelectChanged = (_event: React.SyntheticEvent, value: any) => {
    const option = value as SelectOption
    setSelectedLocation(option)
    onLocationChanged(
      availableLocations.find((availableLocation) => availableLocation.id === option?.value) || null
    )
  }

  useEffect(() => {
    if (availableLocations.length >= 1 && currentLocationId) {
      setSelectedLocation(
        mapLocationSelectOptionFields(
          availableLocations.find((location) => location.id === currentLocationId)
        )
      )
    }
  }, [availableLocations, currentLocationId])

  return (
    <Autocomplete
      autoHighlight
      id="search_location_list"
      className={classes.autoCompleteSelect}
      options={generateSelectOptions(availableLocations)}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={t('dashboard.location')}
            variant="outlined"
            placeholder={t('dashboard.allLocation')}
          />
        )
      }}
      isOptionEqualToValue={(option, value) =>
        option.value === value.value || value.value === 'all'
      }
      onChange={onSelectChanged}
      defaultValue={allLocationSelectOption}
      value={selectedLocation || allLocationSelectOption}
    />
  )
}
