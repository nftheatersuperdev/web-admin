/* eslint-disable react/forbid-component-props */
import { Fragment, useEffect, useState, ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { VoucherDataAndRefetchProps } from 'pages/VoucherCreateEdit/types'
import { updateBff } from 'services/web-bff/voucher'
import { getActive } from 'services/web-bff/package-price'
import { PackagePriceBff } from 'services/web-bff/package-price.type'
import { VoucherInputBff } from 'services/web-bff/voucher.type'

const ButtonSpace = styled(Button)`
  margin: 0;
`
const DividerSpace = styled(Divider)`
  margin: 20px 0;
`

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const selectOptions = {
  ALL: 'all',
  SELECT: 'select',
}

export default function VoucherPackagePriceTab({
  voucher,
  refetch,
}: VoucherDataAndRefetchProps): JSX.Element {
  const existsOption = voucher?.isAllPackages ? selectOptions.ALL : selectOptions.SELECT
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedPackages, setSelectedPackages] = useState<PackagePriceBff[]>([])
  const [currentPackages, setCurrentPackages] = useState<PackagePriceBff[]>([])
  const [packageIsEmpty, setPackageIsEmpty] = useState<boolean>(true)
  const [packageIsEqualToExists, setPackageIsEqualToExists] = useState<boolean>(true)
  const [optionIsEqualToExists, setOptionIsEqualToExists] = useState<boolean>(true)
  const [currentOption, setCurrentOption] = useState<string>(selectOptions.ALL)

  const { data: masterPackagePricesData, isSuccess: isSuccessToGetMasterPackagePrices } = useQuery(
    'master-package-prices',
    () => getActive()
  )

  const masterPackagePrices = masterPackagePricesData || []

  const optionLabel = (option: PackagePriceBff) => {
    let durationLabel
    if (option.durationLabel === '3d') {
      durationLabel = t('pricing.3d')
    } else if (option.durationLabel === '1w') {
      durationLabel = t('pricing.1w')
    } else if (option.durationLabel === '1m') {
      durationLabel = t('pricing.1m')
    } else if (option.durationLabel === '3m') {
      durationLabel = t('pricing.3m')
    } else if (option.durationLabel === '6m') {
      durationLabel = t('pricing.6m')
    } else if (option.durationLabel === '12m') {
      durationLabel = t('pricing.12m')
    }

    return `
      ${option.carModel?.brand} /
      ${option.carModel?.name} /
      ${durationLabel} /
      ${option.price.toLocaleString()} THB
    `
  }

  useEffect(() => {
    const voucherPackagePriceIds =
      voucher?.packagePrices?.map((voucherPackagePrice) => voucherPackagePrice.id) || []
    const packages = masterPackagePrices?.filter((masterPackagePrice) =>
      voucherPackagePriceIds?.includes(masterPackagePrice.id)
    )
    if (packages && packages.length > 0) {
      setCurrentPackages(packages)
      setSelectedPackages(packages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessToGetMasterPackagePrices])

  useEffect(() => {
    if (JSON.stringify(currentPackages) !== JSON.stringify(selectedPackages)) {
      setPackageIsEqualToExists(false)
      setOptionIsEqualToExists(false)
    } else {
      setPackageIsEqualToExists(true)
    }
  }, [currentPackages, selectedPackages])

  useEffect(() => {
    if (selectedPackages && selectedPackages.length > 0) {
      setPackageIsEmpty(false)
    } else {
      setPackageIsEmpty(true)
    }
  }, [selectedPackages])

  useEffect(() => {
    if (currentOption === selectOptions.ALL && existsOption !== selectOptions.ALL) {
      setOptionIsEqualToExists(false)
      setPackageIsEqualToExists(false)
      setPackageIsEmpty(false)
    } else if (currentOption !== existsOption) {
      setPackageIsEqualToExists(false)
      setOptionIsEqualToExists(false)
    } else {
      setOptionIsEqualToExists(true)
    }
  }, [currentOption, existsOption])

  useEffect(() => {
    if (voucher?.packagePrices && voucher?.packagePrices.length < 1) {
      setCurrentOption(selectOptions.ALL)
    } else {
      setCurrentOption(selectOptions.SELECT)
    }
  }, [voucher])

  const handleOnSubmitted = () => {
    if (currentOption === selectOptions.ALL) {
      setSelectedPackages([])
    }
    setPackageIsEmpty(true)
    setPackageIsEqualToExists(true)
    setOptionIsEqualToExists(true)
    setIsLoading(false)
    refetch()
  }

  const handleUpdatePackagePrices = async () => {
    setIsLoading(true)
    if (voucher) {
      const isAllPackages = currentOption === selectOptions.ALL
      const packagePriceIds: string[] = selectedPackages?.map((row) => row.id)
      const userGroupIds: string[] = voucher.userGroups?.map((row) => row.id) || []

      const updateObject: VoucherInputBff = {
        ...voucher,
        userGroups: userGroupIds,
        packagePrices: isAllPackages ? [] : packagePriceIds,
      }

      await toast.promise(updateBff(updateObject), {
        loading: t('toast.loading'),
        success: t('voucher.dialog.packagePrice.success'),
        error: t('voucher.dialog.packagePrice.error'),
      })
      handleOnSubmitted()
    }
  }

  const handleOnOptionChange = (_event: ChangeEvent<HTMLInputElement>, value: string) => {
    setCurrentOption(value)
  }

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <ButtonSpace
            disabled={
              isLoading || optionIsEqualToExists || packageIsEqualToExists || packageIsEmpty
            }
            onClick={() => handleUpdatePackagePrices()}
            color="primary"
            variant="contained"
          >
            {isLoading && <CircularProgress size={20} />}&nbsp;
            {t('button.update')}
          </ButtonSpace>
        </Grid>
      </Grid>
      <DividerSpace />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RadioGroup
            aria-label="package-options"
            name="package-options"
            onChange={handleOnOptionChange}
            defaultValue={currentOption}
            value={currentOption}
          >
            <FormControlLabel value={selectOptions.ALL} control={<Radio />} label="All Packages" />
            <FormControlLabel
              value={selectOptions.SELECT}
              control={<Radio />}
              label={t('voucher.dialog.packagePrice.selectAvailablePackages')}
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="package-price-select"
            value={selectedPackages}
            options={masterPackagePrices}
            onChange={(_, newValue) => setSelectedPackages([...newValue])}
            getOptionLabel={(option) => optionLabel(option)}
            disableCloseOnSelect
            renderOption={(option, { selected }: AutocompleteRenderOptionState) => (
              <Fragment>
                <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                {optionLabel(option)}
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                label={t('voucher.dialog.packagePrice.availablePackages')}
                variant="outlined"
              />
            )}
            disabled={currentOption !== 'select'}
          />
        </Grid>
      </Grid>
    </Fragment>
  )
}
