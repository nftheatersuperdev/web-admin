import { Table, HeadCell } from 'components/Table'
import { useSubscriptions } from 'services/evme'

const TABLE_SCHEMA: HeadCell[] = [
  { id: 'brand', numeric: true, disablePadding: true, label: 'Car Brand' },
  { id: 'model', numeric: true, disablePadding: false, label: 'Car Model' },
  { id: 'startDate', numeric: true, disablePadding: false, label: 'Start Date' },
  { id: 'endDate', numeric: true, disablePadding: false, label: 'End Date' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Customer' },
  { id: 'phoneNumber', numeric: true, disablePadding: false, label: 'Phone' },
]

export default function Subscription(): JSX.Element {
  const { isSuccess, data } = useSubscriptions()

  // Transform response into table format
  const rows = isSuccess
    ? data?.edges?.map(({ node }) => ({
        id: node?.id,
        brand: node?.car?.carModel?.brand,
        model: node?.car?.carModel?.model,
        startDate: node?.startDate,
        endDate: node?.endDate,
        email: node?.user?.email,
        phoneNumber: node?.user?.phoneNumber,
      }))
    : []

  return (
    <div>
      <Table title="Subscriptions" rows={rows} headCells={TABLE_SCHEMA} />
    </div>
  )
}
