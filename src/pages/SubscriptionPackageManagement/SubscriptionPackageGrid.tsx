/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from 'react-i18next'
import {
  DataGrid,
  DataGridProps,
  GridCellParams,
  GridPageChangeParams,
  GridToolbar,
} from '@material-ui/data-grid'
import { getMuiLocales } from 'i18n'
import config from 'config'
import { useState } from 'react'
import { Snackbar } from '@material-ui/core'
import { Page } from 'layout/LayoutRoute'

type DataGridLocaleProps = Omit<DataGridProps, 'onPageChange'> & {
  onFetchNextPage?: () => void
  onFetchPreviousPage?: () => void
  onPageChange?: (index: number) => void
  customToolbar?: React.FC
}

export default function SubscriptionPackageGrid(props: DataGridLocaleProps): JSX.Element {
  const { i18n, t } = useTranslation()
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
  const [isCopy, setIsCopy] = useState(false)

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

  const handleCellDoubleClick = (param: GridCellParams) => {
    setIsCopy(true)
    setTimeout(() => {
      setIsCopy(false)
      navigator.clipboard.writeText(param.value as string)
    }, 1000)
  }

  return (
    <Page>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isCopy}
        autoHideDuration={1000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id"> {t('actionsEvent.copy')} </span>}
      />

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
        onCellDoubleClick={(param) => handleCellDoubleClick(param)}
      />
    </Page>
  )
}
