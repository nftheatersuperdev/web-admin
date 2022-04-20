/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState, ChangeEvent } from 'react'
import {
  Grid,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  CircularProgress,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { getAllUser, updateUserInUserGroup } from 'services/web-bff/user'

interface GroupInviteDialogProps {
  userGroupId: string
  open: boolean
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

// eslint-disable-next-line complexity
export default function GroupInviteDialog({
  userGroupId,
  open,
  onClose,
}: GroupInviteDialogProps): JSX.Element {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [selectOptions, setSelectOptions] = useState<any[]>()
  const [validUserIdList, setValidUserIdList] = useState<string[]>([])

  /*const {
    data: users,
    refetch: usersRefetch,
    isFetching: usersRefetching,
  } = useFindUsersByNotInUserGroupAndKeyword(userGroupId, keyword)*/

  const {
    data: users,
    refetch: usersRefetch,
    isFetching: usersRefetching,
  } = useQuery(['user-list', keyword], async () => {
    const response = await getAllUser()
    return response.data.users.filter(
      (x) =>
        x.userGroups.indexOf(userGroupId) > -1 ||
        x.firstName?.includes(keyword) ||
        x.lastName?.includes(keyword) ||
        x.phoneNumber?.includes(keyword) ||
        x.email.includes(keyword)
    )
  })
  /* const {
     data: whitelistUsers,
     refetch: whitelistUsersRefetch,
     isFetching: whitelistUsersRefetching,
   } = useFindWhitelistUsersNotInUserGroupAndKeyword(userGroupId, keyword)*/
  //const addEmailsToUserGroup = useAddEmailsToUserGroup()
  // const addEmailsToUserGroup = updateUserInUserGroup()

  const isFetching = usersRefetching
  const refetch = async () => {
    await usersRefetch()
  }

  const clearOptionData = async () => {
    setKeyword('')
    await refetch()
    setValidUserIdList([])
    onClose()
  }

  const handleConfirmInviteUser = async () => {
    setIsLoading(true)

    await toast.promise(updateUserInUserGroup({ id: userGroupId, users: validUserIdList }), {
      loading: t('toast.loading'),
      success: t('userGroups.dialog.invitation.success'),
      error: t('userGroups.dialog.invitation.error'),
    })

    await clearOptionData()
    setIsLoading(false)

    return true
  }

  const handleOnSelectedOption = (values: any) => {
    const userIds: string[] = values.map((value: any) => {
      if (typeof value === 'string') {
        return value
      } else if (value.isWhitelist) {
        return value.value
      }
      return value.id
    })
    setValidUserIdList(userIds.filter((userId) => !!userId))
  }

  const handleChangeKeyword = (event: ChangeEvent<{ value: unknown }>) => {
    setIsLoading(true)
    const currentKeyword = event.target.value as string
    if (currentKeyword.length >= 3) {
      setKeyword(currentKeyword)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mergeUsers: any[] = []
    /*if (whitelistUsers && whitelistUsers.length >= 1) {
      const whitelistUsersMapped = whitelistUsers.map((whitelistUser) => {
        return {
          isWhitelist: true,
          ...whitelistUser,
        }
      })
      mergeUsers = [...mergeUsers, ...whitelistUsersMapped]
    }*/
    if (users && users.length >= 1) {
      mergeUsers = [...mergeUsers, ...users]
    }
    setSelectOptions(mergeUsers)
  }, [users])

  const isInviteButtonDisabled = isLoading || validUserIdList.length < 1

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('userGroups.dialog.invitation.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              id="users"
              multiple
              freeSolo
              autoSelect
              autoHighlight
              clearOnBlur={false}
              options={selectOptions || []}
              getOptionLabel={(option) => {
                const label = []
                const isStringOption = typeof option === 'string'
                if (isStringOption) {
                  return option
                } else if (option.isWhitelist) {
                  label.push(`[${t('whitelist.title')}] ${option.value}`)
                } else {
                  if (option.firstName) {
                    label.push(option.firstName)
                  }
                  if (option.lastName) {
                    label.push(option.lastName)
                  }
                  if (option.email) {
                    label.push(option.email)
                  }
                  if (option.phoneNumber) {
                    label.push(option.phoneNumber)
                  }
                }
                return label.join(', ')
              }}
              renderTags={(_, getTagProps) =>
                validUserIdList.map((option, index) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  label={t('userGroups.dialog.invitation.searchField.label')}
                  variant="outlined"
                  onChange={handleChangeKeyword}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                  placeholder={t('userGroups.dialog.invitation.searchField.example')}
                  helperText={t('userGroups.dialog.invitation.searchField.helperText')}
                />
              )}
              loading={isFetching}
              onChange={(_, value) => handleOnSelectedOption(value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonSpace onClick={() => clearOptionData()} color="default" variant="outlined">
          {t('button.cancel')}
        </ButtonSpace>
        <ButtonSpace
          disabled={isInviteButtonDisabled}
          onClick={() => handleConfirmInviteUser()}
          color="primary"
          variant="contained"
        >
          {t('button.inviteAmount', { amount: validUserIdList.length })}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
