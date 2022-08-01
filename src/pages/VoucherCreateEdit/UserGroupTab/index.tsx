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
import { UserGroup } from 'services/web-bff/user.type'
import { searchUserGroup } from 'services/web-bff'

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
  const existsOption =
    voucher?.userGroups && voucher?.userGroups?.length > 0
      ? selectOptions.SELECT
      : selectOptions.ALL
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedUserGroups, setSelectedUserGroups] = useState<UserGroup[]>([])
  const [currentUserGroups, setCurrentUserGroups] = useState<UserGroup[]>([])
  const [userGroupEmpty, setUserGroupIsEmpty] = useState<boolean>(true)
  const [userGroupIsEqualToExists, setUserGroupIsEqualToExists] = useState<boolean>(true)
  const [optionIsEqualToExists, setOptionIsEqualToExists] = useState<boolean>(true)
  const [currentOption, setCurrentOption] = useState<string>(selectOptions.ALL)

  const currentDateTime = new Date()
  const endAtDateTime = new Date(voucher?.endAt || new Date())
  const isInactive = currentDateTime > endAtDateTime

  const { data: masterUserGroupsData, isSuccess: isSuccessToGetMasterUserGroups } = useQuery(
    'master-user-groups',
    () => searchUserGroup({ data: {}, size: 1000 })
  )

  const masterUserGroups = masterUserGroupsData?.data.userGroups || []

  useEffect(() => {
    const voucherUserGroupIds = voucher?.userGroups?.map((userGroup) => userGroup.id) || []
    const userGroups = masterUserGroups?.filter((masterUserGroup) =>
      voucherUserGroupIds?.includes(masterUserGroup.id)
    )
    if (userGroups && userGroups.length > 0) {
      setCurrentUserGroups(userGroups)
      setSelectedUserGroups(userGroups)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessToGetMasterUserGroups])

  useEffect(() => {
    if (JSON.stringify(currentUserGroups) !== JSON.stringify(selectedUserGroups)) {
      setUserGroupIsEqualToExists(false)
      setOptionIsEqualToExists(false)
    } else {
      setUserGroupIsEqualToExists(true)
    }
  }, [currentUserGroups, selectedUserGroups])

  useEffect(() => {
    if (selectedUserGroups && selectedUserGroups.length > 0) {
      setUserGroupIsEmpty(false)
    } else {
      setUserGroupIsEmpty(true)
    }
  }, [selectedUserGroups])

  useEffect(() => {
    if (currentOption === selectOptions.ALL && existsOption !== selectOptions.ALL) {
      setOptionIsEqualToExists(false)
      setUserGroupIsEqualToExists(false)
      setUserGroupIsEmpty(false)
    } else if (currentOption !== existsOption) {
      setUserGroupIsEqualToExists(false)
      setOptionIsEqualToExists(false)
    } else {
      setOptionIsEqualToExists(true)
    }
  }, [currentOption, existsOption])

  useEffect(() => {
    if (voucher?.userGroups === null) {
      setCurrentOption(selectOptions.ALL)
    } else {
      setCurrentOption(selectOptions.SELECT)
    }
  }, [voucher])

  const handleOnSubmitted = () => {
    if (currentOption === selectOptions.ALL) {
      setSelectedUserGroups([])
    }
    setUserGroupIsEmpty(true)
    setUserGroupIsEqualToExists(true)
    setOptionIsEqualToExists(true)
    setIsLoading(false)
    refetch()
  }

  const handleUpdateUserGroups = async () => {
    setIsLoading(true)
    if (voucher) {
      const isAllUserGroups = currentOption === selectOptions.ALL
      const userGroupIds: string[] = selectedUserGroups?.map((row) => row.id)
      const packagePriceIds: string[] = voucher.packagePrices?.map((row) => row.id) || []

      const updateObject: VoucherInputBff = {
        ...voucher,
        packagePrices: packagePriceIds,
        userGroups: isAllUserGroups ? [] : userGroupIds,
      }

      await toast.promise(updateBff(updateObject), {
        loading: t('toast.loading'),
        success: t('voucher.dialog.userGroups.success'),
        error: t('voucher.dialog.userGroups.error'),
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
              isInactive ||
              isLoading ||
              optionIsEqualToExists ||
              userGroupIsEqualToExists ||
              userGroupEmpty
            }
            onClick={() => handleUpdateUserGroups()}
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
            value={selectedUserGroups}
            options={masterUserGroups}
            onChange={(_, newValue) => setSelectedUserGroups([...newValue])}
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
