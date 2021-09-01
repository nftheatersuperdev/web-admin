/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from 'react-i18next'
import { DataGrid, DataGridProps, GridPageChangeParams, GridToolbar } from '@material-ui/data-grid'
import { getMuiLocales } from 'i18n'
import config from 'config'

type DataGridLocaleProps = Omit<DataGridProps, 'onPageChange'> & {
  onFetchNextPage?: () => void
  onFetchPreviousPage?: () => void
  onPageChange?: (index: number) => void
  customToolbar?: React.FC
}

export default function DataGridLocale(props: DataGridLocaleProps): JSX.Element {
  const { i18n } = useTranslation()
  const { gridLocaleText } = getMuiLocales(i18n.language)
  const {
    components,
    page: currentPageIndex = 0,
    onPageChange,
    onFetchNextPage,
    onFetchPreviousPage,
    customToolbar,
    ...rest
  } = props

  const handlePageChange = (params: GridPageChangeParams) => {
    // If we navigate FORWARD in our pages, i.e. the new page number is higher than current page
    if (params.page > currentPageIndex) {
      onFetchNextPage?.()
    } else {
      // If we navigate BACKWARD in our pages, i.e. the new page number is lower than current page
      onFetchPreviousPage?.()
    }
    onPageChange?.(params.page)
  }

  return (
    <DataGrid
      components={{
        Toolbar: customToolbar ?? GridToolbar,
        ...components,
      }}
      onPageChange={handlePageChange}
      page={currentPageIndex}
      rowsPerPageOptions={config.tableRowsPerPageOptions}
      localeText={gridLocaleText}
      {...rest}
    />
  )
}
