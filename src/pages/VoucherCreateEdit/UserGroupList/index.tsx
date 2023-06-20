import { Fragment } from 'react'
import { useQuery } from 'react-query'
import { Checkbox, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { FormikProps } from 'formik'
import { searchCustomerGroup } from 'services/web-bff'
import { Voucher } from 'services/web-bff/voucher.type'
import { selectOptions } from 'pages/VoucherCreateEdit/utils'
import { VoucherFormInitialValues } from '..'

export interface UserGroupListProps {
  voucher?: Voucher
  formik: FormikProps<VoucherFormInitialValues>
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const AutocompleteSpace = styled.div`
  @media (min-width: 801px) {
    margin-top: 40px;
  }
`

export default function VoucherUserGroupTab({ voucher, formik }: UserGroupListProps): JSX.Element {
  const { t } = useTranslation()

  const currentDateTime = new Date()
  const endAtDateTime = new Date(voucher?.endAt || new Date())
  const isInactive = currentDateTime > endAtDateTime

  const { data: masterCustomerGroupsData } = useQuery('master-customer-groups', () =>
    searchCustomerGroup({ data: {}, size: 1000 })
  )

  const masterCustomerGroups = masterCustomerGroupsData?.data.customerGroups || []
  const customerGroupValues = formik.values.customerGroups.map((customerGroup) =>
    masterCustomerGroups.find((masterData) => masterData.id === customerGroup.id)
  )

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <RadioGroup
          id="voucher_add_edit__user_group_radio_list"
          name="user-group-radio"
          aria-label="user-group-radio"
          onChange={(_, value) => formik.setFieldValue('customerGroupOption', value)}
          value={formik.values.customerGroupOption}
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
      <Grid item xs={12} sm={5}>
        <AutocompleteSpace>
          <Autocomplete
            multiple
            id="user-group-select"
            value={customerGroupValues}
            options={masterCustomerGroups}
            onChange={(_, value) => formik.setFieldValue('customerGroups', value)}
            getOptionLabel={(option) => option?.name || ''}
            disableCloseOnSelect
            renderOption={(option, { selected }: AutocompleteRenderOptionState) => (
              <Fragment>
                <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                {option?.name || ''}
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
            disabled={formik.values.customerGroupOption !== selectOptions.SELECT}
          />
        </AutocompleteSpace>
      </Grid>
    </Grid>
  )
}
