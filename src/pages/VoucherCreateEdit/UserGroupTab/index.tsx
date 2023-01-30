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
import { VoucherInputBff } from 'services/web-bff/voucher.type'
import { CustomerGroup } from 'services/web-bff/user.type'
import { searchCustomerGroup } from 'services/web-bff'

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

export default function VoucherUserGroupTab({
  voucher,
  refetch,
}: VoucherDataAndRefetchProps): JSX.Element {
  console.log('voucher ->', voucher)
  const existsOption =
    voucher?.customerGroups && voucher?.customerGroups?.length > 0
      ? selectOptions.SELECT
      : selectOptions.ALL
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedCustomerGroups, setSelectedCustomerGroups] = useState<CustomerGroup[]>([])
  const [currentCustomerGroups, setCurrentCustomerGroups] = useState<CustomerGroup[]>([])
  const [customerGroupEmpty, setCustomerGroupIsEmpty] = useState<boolean>(true)
  const [customerGroupIsEqualToExists, setCustomerGroupIsEqualToExists] = useState<boolean>(true)
  const [optionIsEqualToExists, setOptionIsEqualToExists] = useState<boolean>(true)
  const [currentOption, setCurrentOption] = useState<string>(selectOptions.ALL)

  const currentDateTime = new Date()
  const endAtDateTime = new Date(voucher?.endAt || new Date())
  const isInactive = currentDateTime > endAtDateTime

  const { data: masterCustomerGroupsData, isSuccess: isSuccessToGetMasterCustomerGroups } =
    useQuery('master-customer-groups', () => searchCustomerGroup({ data: {}, size: 1000 }))

  const masterCustomerGroups = masterCustomerGroupsData?.data.customerGroups || []

  useEffect(() => {
    const voucherCustomerGroupIds =
      voucher?.customerGroups?.map((customerGroup) => customerGroup.id) || []
    const customerGroups = masterCustomerGroups?.filter((masterCustomerGroup) =>
      voucherCustomerGroupIds?.includes(masterCustomerGroup.id)
    )
    if (customerGroups && customerGroups.length > 0) {
      setCurrentCustomerGroups(customerGroups)
      setSelectedCustomerGroups(customerGroups)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessToGetMasterCustomerGroups])

  useEffect(() => {
    if (JSON.stringify(currentCustomerGroups) !== JSON.stringify(selectedCustomerGroups)) {
      setCustomerGroupIsEqualToExists(false)
      setOptionIsEqualToExists(false)
    } else {
      setCustomerGroupIsEqualToExists(true)
    }
  }, [currentCustomerGroups, selectedCustomerGroups])

  useEffect(() => {
    if (selectedCustomerGroups && selectedCustomerGroups.length > 0) {
      setCustomerGroupIsEmpty(false)
    } else {
      setCustomerGroupIsEmpty(true)
    }
  }, [selectedCustomerGroups])

  useEffect(() => {
    if (currentOption === selectOptions.ALL && existsOption !== selectOptions.ALL) {
      setOptionIsEqualToExists(false)
      setCustomerGroupIsEqualToExists(false)
      setCustomerGroupIsEmpty(false)
    } else if (currentOption !== existsOption) {
      setCustomerGroupIsEqualToExists(false)
      setOptionIsEqualToExists(false)
    } else {
      setOptionIsEqualToExists(true)
    }
  }, [currentOption, existsOption])

  useEffect(() => {
    if (
      voucher?.customerGroups === null ||
      (voucher?.customerGroups && voucher?.customerGroups.length < 1)
    ) {
      setCurrentOption(selectOptions.ALL)
    } else {
      setCurrentOption(selectOptions.SELECT)
    }
  }, [voucher])

  const handleOnSubmitted = () => {
    if (currentOption === selectOptions.ALL) {
      setSelectedCustomerGroups([])
    }
    setCustomerGroupIsEmpty(true)
    setCustomerGroupIsEqualToExists(true)
    setOptionIsEqualToExists(true)
    setIsLoading(false)
    refetch()
  }

  const handleUpdateCustomerGroups = async () => {
    setIsLoading(true)
    if (voucher) {
      const isAllCustomerGroups = currentOption === selectOptions.ALL
      const customerGroupIds: string[] = selectedCustomerGroups?.map((row) => row.id)
      const packagePriceIds: string[] = voucher.packagePrices?.map((row) => row.id) || []

      const updateObject: VoucherInputBff = {
        ...voucher,
        packagePrices: packagePriceIds,
        customerGroups: isAllCustomerGroups ? [] : customerGroupIds,
      }

      await toast.promise(updateBff(updateObject), {
        loading: t('toast.loading'),
        success: t('voucher.dialog.userGroups.success'),
        error: t('voucher.dialog.userGroups.error'),
      })
      handleOnSubmitted()
    } else {
      toast.error(t('error.unknown'))
    }
    setIsLoading(false)
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
              isInactive ||
              isLoading ||
              optionIsEqualToExists ||
              customerGroupIsEqualToExists ||
              customerGroupEmpty
            }
            onClick={() => handleUpdateCustomerGroups()}
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
            <FormControlLabel
              value={selectOptions.ALL}
              control={<Radio />}
              label="All User Groups"
              disabled={isInactive}
            />
            <FormControlLabel
              value={selectOptions.SELECT}
              control={<Radio />}
              label={t('voucher.dialog.userGroups.selectAvailableUserGroups')}
              disabled={isInactive}
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="user-group-select"
            value={selectedCustomerGroups}
            options={masterCustomerGroups}
            onChange={(_, newValue) => setSelectedCustomerGroups([...newValue])}
            getOptionLabel={(option) => option.name}
            disableCloseOnSelect
            renderOption={(option, { selected }: AutocompleteRenderOptionState) => (
              <Fragment>
                <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                {option.name}
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                label={t('voucher.dialog.userGroups.availableUserGroups')}
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
