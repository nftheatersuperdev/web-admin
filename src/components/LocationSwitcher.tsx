/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ResellerServiceArea } from 'services/web-bff/admin-user.type'
import { getLocationList } from 'services/web-bff/location'

interface LocationSwitcherProps {
  onLocationChanged: (location: ResellerServiceArea | null) => void
  userServiceAreas: ResellerServiceArea[] | null | undefined
  currentLocationId?: string | null
}
interface SelectOption {
  label: string
  value: string
}

export const allLocationId = '00000000-0000-0000-0000-000000000000'

export default function LocationSwitcher({
  onLocationChanged,
  userServiceAreas,
  currentLocationId,
}: LocationSwitcherProps): JSX.Element {
  const useStyles = makeStyles({
    noMarginTop: {
      marginTop: '0px !important',
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
  const { data } = useQuery('get-location', () => getLocationList(), {
    refetchOnWindowFocus: false,
  })

  // Handle for case: when clear location for some role that can't see all location
  const getDefaultLocation = () => {
    if (userServiceAreas && userServiceAreas[0].id !== allLocationId) {
      const current = data?.locations.find((location) => location.id === userServiceAreas[0].id)
      if (current) {
        return {
          label: current[i18n.language === 'th' ? 'areaNameTh' : 'areaNameEn'],
          value: current?.id,
        }
      }
    }
    return {
      label: t('dashboard.allLocation'),
      value: allLocationId,
    }
  }

  const allLocationSelectOption = getDefaultLocation()

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
    return locations
      .map((location) => mapLocationSelectOptionFields(location))
      .sort((a, b) => {
        if (a.label < b.label) {
          return -1
        }
        if (a.label > b.label) {
          return 1
        }
        return 0
      })
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

  const getAvailableLocations = (): ResellerServiceArea[] => {
    if (userServiceAreas && userServiceAreas[0].id !== allLocationId) {
      return userServiceAreas
    }
    return data?.locations || []
  }
  const availableLocations = getAvailableLocations()

  const onSelectChanged = (option: SelectOption) => {
    if (option) {
      setSelectedLocation(option)
      onLocationChanged(
        availableLocations.find((availableLocation) => availableLocation.id === option?.value) ||
          null
      )
    } else {
      // Handle for case: when clear location for some role that can't see all location
      setSelectedLocation(allLocationSelectOption)
      onLocationChanged(
        availableLocations.find(
          (availableLocation) => availableLocation.id === allLocationSelectOption.value
        ) || null
      )
    }
  }

  useEffect(() => {
    if (availableLocations.length >= 1) {
      if (currentLocationId) {
        setSelectedLocation(
          mapLocationSelectOptionFields(
            availableLocations.find((location) => location.id === currentLocationId)
          )
        )
      } else if (userServiceAreas && userServiceAreas.length > 1) {
        setSelectedLocation(
          mapLocationSelectOptionFields(
            availableLocations.find((location) => location.id === userServiceAreas[0].id)
          )
        )
      }
    }
  }, [availableLocations, currentLocationId])

  return (
    <Autocomplete
      autoHighlight
      id="search_location_list"
      className={[classes.autoCompleteSelect, classes.noMarginTop].join(' ')}
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
        option.value === value.value || value.value === allLocationId
      }
      onChange={(_event, option) => onSelectChanged(option as SelectOption)}
      defaultValue={allLocationSelectOption}
      value={selectedLocation || allLocationSelectOption}
    />
  )
}