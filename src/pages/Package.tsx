import { useState } from 'react'
import { Button } from '@material-ui/core'
import PageToolbar from 'layout/PageToolbar'
import { Table, HeadCell } from 'components/Table'
import { usePackages } from 'services/evme'
import PackageCreateDialog from './PackageCreateDialog'

const TABLE_SCHEMA: HeadCell[] = [
  { id: 'id', numeric: true, disablePadding: true, label: 'Package ID' },
  { id: 'active', numeric: true, disablePadding: false, label: 'Is Active' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created Date' },
]

export default function Package(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { isSuccess, data } = usePackages()

  // Transform response into table format
  const rows = isSuccess
    ? data?.edges?.map(({ node }) => ({
        id: node?.id,
        active: node?.active ? 'Active' : 'Disabled',
        createdAt: node?.createdAt,
      }))
    : []

  return (
    <div>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          Create Package
        </Button>
      </PageToolbar>
      <Table title="Packages" rows={rows} headCells={TABLE_SCHEMA} />
      <PackageCreateDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </div>
  )
}
