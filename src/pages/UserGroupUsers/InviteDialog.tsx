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
import { useFindUsersByNotInUserGroupAndKeyword, useAddUsersToUserGroup } from 'services/evme'
import { User } from 'services/evme.types'

interface InviteDialogProps {
  userGroupId: string
  open: boolean
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

// eslint-disable-next-line complexity
export default function InviteDialog({
  userGroupId,
  open,
  onClose,
}: InviteDialogProps): JSX.Element {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [selectOptions, setSelectOptions] = useState<User[]>()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const {
    data: users,
    refetch,
    isFetching,
  } = useFindUsersByNotInUserGroupAndKeyword(userGroupId, keyword)
  const addUsersToUserGroup = useAddUsersToUserGroup()

  const clearOptionData = async () => {
    setKeyword('')
    setSelectedUser(null)
    await refetch()
  }

  const handleConfirmInviteUser = () => {
    if (selectedUser) {
      toast.promise(
        addUsersToUserGroup.mutateAsync({
          id: userGroupId,
          relationIds: [selectedUser.id],
        }),
        {
          loading: t('toast.loading'),
          success: () => {
            clearOptionData()
            onClose()
            return t('userGroups.dialog.invitation.success')
          },
          error: t('userGroups.dialog.invitation.error'),
        }
      )
    }
  }

  const handleOnSelectedOption = async (value: User | null) => {
    if (value?.id) {
      setSelectedUser(value)
    } else {
      await clearOptionData()
    }
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
    setSelectOptions(users)
  }, [users])

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('userGroups.dialog.invitation.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              id="users"
              autoHighlight
              options={selectOptions || []}
              getOptionLabel={(option) => {
                const label = []
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
          disabled={!selectedUser || isLoading}
          onClick={() => handleConfirmInviteUser()}
          color="primary"
          variant="outlined"
        >
          {t('button.confirm')}
        </ButtonSpace>
        <ButtonSpace
          onClick={() => {
            clearOptionData()
            onClose()
          }}
          color="default"
          variant="outlined"
        >
          {t('button.cancel')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
