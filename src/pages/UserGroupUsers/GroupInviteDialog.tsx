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
import { validateEmail } from 'utils'
import {
  useFindUsersByNotInUserGroupAndKeyword,
  useFindWhitelistUsersNotInUserGroupAndKeyword,
  useAddEmailsToUserGroup,
} from 'services/evme'

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
  const [validEmails, setValidEmails] = useState<string[]>([])

  const {
    data: users,
    refetch: usersRefetch,
    isFetching: usersRefetching,
  } = useFindUsersByNotInUserGroupAndKeyword(userGroupId, keyword)
  const {
    data: whitelistUsers,
    refetch: whitelistUsersRefetch,
    isFetching: whitelistUsersRefetching,
  } = useFindWhitelistUsersNotInUserGroupAndKeyword(userGroupId, keyword)
  const addEmailsToUserGroup = useAddEmailsToUserGroup()

  const isFetching = usersRefetching || whitelistUsersRefetching
  const refetch = async () => {
    await usersRefetch()
    await whitelistUsersRefetch()
  }

  const clearOptionData = async () => {
    setKeyword('')
    await refetch()
    setValidEmails([])
    onClose()
  }

  const handleConfirmInviteUser = async () => {
    setIsLoading(true)

    await toast.promise(
      addEmailsToUserGroup.mutateAsync({ id: userGroupId, values: validEmails }),
      {
        loading: t('toast.loading'),
        success: t('userGroups.dialog.invitation.success'),
        error: t('userGroups.dialog.invitation.error'),
      }
    )

    await clearOptionData()
    setIsLoading(false)

    return true
  }

  const handleOnSelectedOption = (values: any) => {
    const emails: string[] = values.map((value: any) => {
      if (typeof value === 'string' && validateEmail(value)) {
        return value
      } else if (value.isWhitelist) {
        return value.value
      }
      return value.email
    })
    setValidEmails(emails.filter((email) => !!email))
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
    if (whitelistUsers && whitelistUsers.length >= 1) {
      const whitelistUsersMapped = whitelistUsers.map((whitelistUser) => {
        return {
          isWhitelist: true,
          ...whitelistUser,
        }
      })
      mergeUsers = [...mergeUsers, ...whitelistUsersMapped]
    }
    if (users && users.length >= 1) {
      mergeUsers = [...mergeUsers, ...users]
    }
    setSelectOptions(mergeUsers)
  }, [users, whitelistUsers])

  const isInviteButtonDisabled = isLoading || validEmails.length < 1

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
                validEmails.map((option, index) => (
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
          {t('button.inviteAmount', { amount: validEmails.length })}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
