import { useState } from 'react'
import { Button } from '@material-ui/core'
import PageToolbar from 'layout/PageToolbar'
import { Table } from 'components/Table'
import PackageCreateDialog from './PackageCreateDialog'

export default function Package(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          Create Package
        </Button>
      </PageToolbar>
      <Table />
      <PackageCreateDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </div>
  )
}
