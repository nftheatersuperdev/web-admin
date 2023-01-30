/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState, ChangeEvent } from 'react'
import {
  Grid,
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
import {
  useAddUsersToUserGroup,
  useAddWhitelistsToUserGroup,
  useCreateOneWhitelist,
} from 'services/evme'
import { User, UserWhitelist } from 'services/evme.types'
import { getAllUser } from 'services/web-bff/user'

interface InviteDialogProps {
  userGroupId: string
  open: boolean
  onClose: (goTabIndex: number) => void
  currentTabIndex?: number
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

// eslint-disable-next-line complexity
export default function InviteDialog({
  userGroupId,
  open,
  onClose,
  currentTabIndex,
}: InviteDialogProps): JSX.Element {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [selectOptions, setSelectOptions] = useState<any[]>()
  const [selectedUser, setSelectedUser] = useState<User | any | null>(null)
  const [selectedWhitelist, setSelectedWhitelist] = useState<UserWhitelist | any | null>(null)
  const [selectedNewEmail, setSelectedNewEmail] = useState<string | null>(null)

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
        x.customerGroups.indexOf(userGroupId) > -1 ||
        x.firstName?.includes(keyword) ||
        x.lastName?.includes(keyword) ||
        x.phoneNumber?.includes(keyword) ||
        x.email.includes(keyword)
    )
  })

  /*const {
    data: whitelistUsers,
    refetch: whitelistUsersRefetch,
    isFetching: whitelistUsersRefetching,
  } = useFindWhitelistUsersNotInUserGroupAndKeyword(userGroupId, keyword)*/
  const addUsersToUserGroup = useAddUsersToUserGroup()
  const addWhitelistsToUserGroup = useAddWhitelistsToUserGroup()
  const createOneWhitelist = useCreateOneWhitelist()

  const isFetching = usersRefetching
  const refetch = async () => {
    await usersRefetch()
  }

  const clearOptionData = async () => {
    setKeyword('')
    await refetch()
    setSelectedUser(null)
    setSelectedWhitelist(null)
    setSelectedNewEmail(null)
  }

  const handleConfirmInviteUser = async () => {
    setIsLoading(true)
    let mutationFunction
    let whitelistId
    let tabIndex = 0

    if (selectedNewEmail && !selectedUser && !selectedWhitelist) {
      try {
        const newWhitelist = await createOneWhitelist.mutateAsync({
          type: 'email',
          value: selectedNewEmail || '',
        })
        whitelistId = newWhitelist.id
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message?.includes('unique constraint')) {
            return toast.error(t('userGroups.dialog.invitation.duplicated'))
          }
        }
      }
    }

    if (selectedUser) {
      mutationFunction = addUsersToUserGroup.mutateAsync({
        id: userGroupId,
        relationIds: [selectedUser.id],
      })
    } else {
      whitelistId = whitelistId ?? selectedWhitelist.id
      mutationFunction = addWhitelistsToUserGroup.mutateAsync({
        id: userGroupId,
        relationIds: [whitelistId],
      })
      tabIndex = 1
    }

    await toast.promise(mutationFunction, {
      loading: t('toast.loading'),
      success: () => {
        clearOptionData()
        onClose(tabIndex)
        return t('userGroups.dialog.invitation.success')
      },
      error: (error) => {
        if (error.message?.includes('unique constraint')) {
          return t('userGroups.dialog.invitation.duplicated')
        }
        return t('userGroups.dialog.invitation.error')
      },
    })

    setIsLoading(false)

    return true
  }

  const validateEmail = (value: string): boolean => {
    if (/\S+@\S+\.\S+/.test(value)) {
      return true
    }
    return false
  }

  const handleOnSelectedOption = async (value: any) => {
    if (!value) {
      await clearOptionData()
    } else if (value?.isWhitelist) {
      setSelectedWhitelist(value)
    } else if (value?.id) {
      setSelectedUser(value)
    } else {
      if (validateEmail(value)) {
        setSelectedNewEmail(value)
      }
    }
  }

  const handleChangeKeyword = (event: ChangeEvent<{ value: unknown }>) => {
    setIsLoading(true)
    const currentKeyword = event.target.value as string
    if (validateEmail(currentKeyword)) {
      setSelectedNewEmail(currentKeyword)
    } else {
      setSelectedNewEmail(null)
      if (currentKeyword.length >= 3) {
        setKeyword(currentKeyword)
      }
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

  const isInviteButtonDisabled =
    isLoading || (!selectedUser && !selectedWhitelist && !selectedNewEmail)

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('userGroups.dialog.invitation.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              id="users"
              freeSolo
              autoSelect
              autoHighlight
              clearOnBlur={false}
              options={selectOptions || []}
              getOptionLabel={(option) => {
                const label = []
                if (option.isWhitelist) {
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
        <ButtonSpace
          onClick={() => {
            clearOptionData()
            onClose(currentTabIndex ?? 0)
          }}
          color="default"
          variant="outlined"
        >
          {t('button.cancel')}
        </ButtonSpace>
        <ButtonSpace
          disabled={isInviteButtonDisabled}
          onClick={() => handleConfirmInviteUser()}
          color="primary"
          variant="contained"
        >
          {t('button.invite')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
