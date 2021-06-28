/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from 'react-i18next'
import { DataGrid, DataGridProps, GridToolbar } from '@material-ui/data-grid'
import { getMuiLocales } from 'i18n'
import config from 'config'

export default function DataGridLocale(props: DataGridProps): JSX.Element {
  const { i18n } = useTranslation()
  const { gridLocaleText } = getMuiLocales(i18n.language)
  const { components, ...rest } = props

  return (
    <DataGrid
      components={{
        Toolbar: GridToolbar,
        ...components,
      }}
      rowsPerPageOptions={config.tableRowsPerPageOptions}
      localeText={gridLocaleText}
      {...rest}
    />
  )
}
