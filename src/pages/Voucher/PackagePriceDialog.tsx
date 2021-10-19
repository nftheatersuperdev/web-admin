import { Fragment, useEffect, useState } from 'react'
import {
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Voucher, PackagePrice } from 'services/evme.types'
import {
  useVouchersSearchPackagePrices,
  useAddPackagePricesToVoucher,
  useRemovePackagePricesFromVoucher,
} from 'services/evme'

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

interface PackagePriceDialogProps {
  voucher?: Voucher | null
  open: boolean
  onClose: () => void
}

export default function VoucherPackagePriceDialog({
  voucher,
  open,
  onClose,
}: PackagePriceDialogProps): JSX.Element {
  const { t } = useTranslation()
  const [keyword] = useState<string>('')
  const { data: masterPackagePrices } = useVouchersSearchPackagePrices(keyword)
  const addPackagePricesToVoucher = useAddPackagePricesToVoucher()
  const removePackagePricesFromVoucher = useRemovePackagePricesFromVoucher()
  const [selectedPackages, setSelectedPackages] = useState<PackagePrice[]>()
  const [currentPackages, setCurrentPackages] = useState<PackagePrice[]>()
  const [disableUpdateButton, setDisableUpdateButton] = useState<boolean>(true)

  const optionLabel = (option: PackagePrice) => {
    let duration
    if (option.duration === '1w') {
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
  }

  useEffect(() => {
    const voucherPackagePriceIds = voucher?.packagePrices.map(
      (voucherPackagePrice) => voucherPackagePrice.id
    )
    const packages = masterPackagePrices?.filter((masterPackagePrice) =>
      voucherPackagePriceIds?.includes(masterPackagePrice.id)
    )
    setCurrentPackages(packages)
    setSelectedPackages(packages)
  }, [masterPackagePrices, voucher?.packagePrices])

  useEffect(() => {
    if (JSON.stringify(currentPackages) !== JSON.stringify(selectedPackages)) {
      setDisableUpdateButton(false)
    } else {
      setDisableUpdateButton(true)
    }
  }, [currentPackages, selectedPackages])

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

  const handleUpdatePackagePrices = async () => {
    const voucherId = voucher?.id
    const currentIds = currentPackages?.map((row) => row.id)
    const selectedIds = selectedPackages?.map((row) => row.id)
    if (voucherId && currentIds && selectedIds) {
      await toast.promise(requestToUpdate(voucherId, currentIds, selectedIds), {
        loading: t('toast.loading'),
        success: t('voucher.dialog.packagePrice.success'),
        error: t('voucher.dialog.packagePrice.error'),
      })
      setCurrentPackages(selectedPackages)
    }
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {t('voucher.dialog.packagePrice.title')} ({voucher?.code})
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RadioGroup aria-label="package-options" name="package-options">
              <FormControlLabel value="all" control={<Radio />} label="All Packages" />
              <FormControlLabel
                value="select"
                control={<Radio />}
                label={t('voucher.dialog.packagePrice.selectAvailablePackages')}
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              disabled
              multiple
              id="package-price-select"
              value={selectedPackages}
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
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonSpace
          onClick={() => {
            setDisableUpdateButton(true)
            setSelectedPackages([])
            onClose()
          }}
          color="primary"
        >
          {t('button.close')}
        </ButtonSpace>
        <ButtonSpace
          disabled={disableUpdateButton}
          onClick={() => handleUpdatePackagePrices()}
          color="primary"
          variant="contained"
        >
          {t('button.update')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
