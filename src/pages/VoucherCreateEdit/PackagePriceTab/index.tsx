/* eslint-disable react/forbid-component-props */
import { Fragment, useEffect, useState, ChangeEvent } from 'react'
import {
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PackagePrice } from 'services/evme.types'
import {
  useAddPackagePricesToVoucher,
  useRemovePackagePricesFromVoucher,
  useUpdateVoucher,
} from 'services/evme'
import { VoucherDataAndRefetchProps } from 'pages/VoucherCreateEdit/types'

const ButtonSpace = styled(Button)`
  margin: 0;
`
const DividerSpace = styled(Divider)`
  margin: 20px 0;
`

/*const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />*/

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
  const addPackagePricesToVoucher = useAddPackagePricesToVoucher()
  const removePackagePricesFromVoucher = useRemovePackagePricesFromVoucher()
  const updateVoucher = useUpdateVoucher()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedPackages, setSelectedPackages] = useState<PackagePrice[]>()
  const [currentPackages, setCurrentPackages] = useState<PackagePrice[]>()
  const [packageIsEmpty, setPackageIsEmpty] = useState<boolean>(true)
  const [packageIsEqualToExists, setPackageIsEqualToExists] = useState<boolean>(true)
  const [optionIsEqualToExists, setOptionIsEqualToExists] = useState<boolean>(true)
  const [currentOption, setCurrentOption] = useState<string>(selectOptions.ALL)

  /*const optionLabel = (option: PackagePrice) => {
    let duration
    if (option.duration === '3d') {
      duration = t('pricing.3d')
    } else if (option.duration === '1w') {
      duration = t('pricing.1w')
    } else if (option.duration === '1m') {
      duration = t('pricing.1m')
    } else if (option.duration === '3m') {
      duration = t('pricing.3m')
    } else if (option.duration === '6m') {
      duration = t('pricing.6m')
    } else if (option.duration === '12m') {
      duration = t('pricing.12m')
    }

    return `
      ${option.carModel?.brand} /
      ${option.carModel?.model} /
      ${duration} /
      ${option.price.toLocaleString()} THB
    `
  }*/

  /* useEffect(() => {
    const voucherPackagePriceIds = voucher?.packagePrices.map(
      (voucherPackagePrice) => voucherPackagePrice.id
    )
    const packages = masterPackagePrices?.filter((masterPackagePrice) =>
      voucherPackagePriceIds?.includes(masterPackagePrice.id)
    )
    setCurrentPackages(packages)
    setSelectedPackages(packages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessToGetMasterPackagePrices])*/

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
    if (voucher?.isAllPackages === true) {
      setCurrentOption(selectOptions.ALL)
    } else {
      setCurrentOption(selectOptions.SELECT)
    }
  }, [voucher])

  const requestToUpdate = async (
    voucherId: string,
    currentIds: string[],
    selectedIds: string[]
  ) => {
    if (voucherId && currentIds && currentIds?.length > 0) {
      await removePackagePricesFromVoucher.mutateAsync({
        id: voucherId,
        relationIds: currentIds,
      })
    }
    if (voucherId && selectedIds && selectedIds?.length > 0) {
      await addPackagePricesToVoucher.mutateAsync({
        id: voucherId,
        relationIds: selectedIds,
      })
    }
    return true
  }

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
    const voucherId = voucher?.id
    const currentOptionIsALL = currentOption === selectOptions.ALL
    const currentOptionIsNotALL = !currentOptionIsALL
    const currentIds = currentPackages?.map((row) => row.id)
    const selectedIds = selectedPackages?.map((row) => row.id)

    const toastMessages = {
      loading: t('toast.loading'),
      success: t('voucher.dialog.packagePrice.success'),
      error: t('voucher.dialog.packagePrice.error'),
    }

    await updateVoucher.mutateAsync({
      id: voucherId,
      isAllPackages: currentOptionIsALL ? true : false,
    })
    if (currentOptionIsNotALL && voucherId && currentIds && selectedIds) {
      await toast.promise(requestToUpdate(voucherId, currentIds, selectedIds), toastMessages)
      setCurrentPackages(selectedPackages)
    } else if (currentOptionIsALL && voucherId && currentIds) {
      await toast.promise(
        removePackagePricesFromVoucher.mutateAsync({
          id: voucherId,
          relationIds: currentIds,
        }),
        toastMessages
      )
    }
    handleOnSubmitted()
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
          {/* <pre>{JSON.stringify(selectedPackages, null, 2)}</pre> */}
          {/* <Autocomplete
            multiple
            id="package-price-select"
            value={selectedPackages ?? []}
            options={masterPackagePrices ?? []}
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
            />*/}
        </Grid>
      </Grid>
    </Fragment>
  )
}
