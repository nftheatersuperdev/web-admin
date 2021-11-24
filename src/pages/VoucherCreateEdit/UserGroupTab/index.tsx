/* eslint-disable react/forbid-component-props */
import toast from 'react-hot-toast'
import styled from 'styled-components'
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { Fragment, useEffect, useState } from 'react'
import { Button, Checkbox, CircularProgress, Divider, Grid, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { VoucherDataAndRefetchProps } from 'pages/VoucherCreateEdit/types'
import {
  useUserGroupsFilterAndSort,
  useAddUserGroupsToVoucher,
  useRemoveUserGroupsFromVoucher,
} from 'services/evme'
import { UserGroup } from 'services/evme.types'

const ButtonSpace = styled(Button)`
  margin: 0;
`
const DividerSpace = styled(Divider)`
  margin: 20px 0;
`

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export default function VoucherUserGroupTab({
  voucher,
  refetch,
}: VoucherDataAndRefetchProps): JSX.Element {
  const { t } = useTranslation()
  const { data, isSuccess: isSuccessToGetMasterUserGroups } = useUserGroupsFilterAndSort(
    undefined,
    undefined,
    0,
    1000
  )
  const addUserGroupsToVoucher = useAddUserGroupsToVoucher()
  const removeUserGroupsFromVoucher = useRemoveUserGroupsFromVoucher()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedUserGroups, setSelectedUserGroups] = useState<UserGroup[]>()
  const [currentUserGroups, setCurrentUserGroups] = useState<UserGroup[]>()
  const [userGroupIsEqualToExists, setUserGroupIsEqualToExists] = useState<boolean>(true)
  const [optionIsEqualToExists, setOptionIsEqualToExists] = useState<boolean>(true)
  const masterUserGroups = data?.data

  const handleUpdateUserGroups = async () => {
    setIsLoading(true)
    const voucherId = voucher?.id

    if (voucherId && voucher && voucher?.userGroups.length > 0) {
      await removeUserGroupsFromVoucher.mutateAsync({
        id: voucherId,
        relationIds: voucher?.userGroups.map((userGroup) => userGroup.id),
      })

      if (selectedUserGroups?.length === 0) {
        toast.success(t('voucher.dialog.userGroups.removeSuccess'))
        setCurrentUserGroups([])
      }
    }

    if (voucherId && selectedUserGroups && selectedUserGroups?.length > 0) {
      await toast.promise(
        addUserGroupsToVoucher.mutateAsync({
          id: voucherId,
          relationIds: selectedUserGroups?.map((selectedUserGroup) => selectedUserGroup.id),
        }),
        {
          loading: t('toast.loading'),
          success: t('voucher.dialog.userGroups.success'),
          error: t('voucher.dialog.userGroups.error'),
        }
      )
      setCurrentUserGroups(selectedUserGroups)
    }
    refetch()
    setIsLoading(false)
  }

  useEffect(() => {
    const voucherUserGroupIds = voucher?.userGroups.map((voucherUserGroup) => voucherUserGroup.id)
    const userGroups = masterUserGroups?.filter((masterUserGroup) =>
      voucherUserGroupIds?.includes(masterUserGroup.id)
    )
    setCurrentUserGroups(userGroups)
    setSelectedUserGroups(userGroups)
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

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <ButtonSpace
            onClick={() => handleUpdateUserGroups()}
            color="primary"
            variant="contained"
            disabled={isLoading || userGroupIsEqualToExists || optionIsEqualToExists}
          >
            {isLoading && <CircularProgress size={20} />}&nbsp;
            {t('button.update')}
          </ButtonSpace>
        </Grid>
      </Grid>
      <DividerSpace />
      {/* <pre>{JSON.stringify(selectedUserGroups, null, 2)}</pre> */}
      <Autocomplete
        multiple
        id="user-groups-select"
        value={selectedUserGroups ?? []}
        options={masterUserGroups ?? []}
        onChange={(_, newValue) => setSelectedUserGroups([...newValue])}
        getOptionLabel={(option: UserGroup) => option.name}
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
      />
    </Fragment>
  )
}
