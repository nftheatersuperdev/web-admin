import { useQuery } from 'react-query'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import ls from 'localstorage-slim'
import {
  Button,
  Card,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'auth/AuthContext'
import { PRIVILEGES, hasAllowedPrivilege } from 'auth/privileges'
import {
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  formatDate,
} from 'utils'
import { Page } from 'layout/LayoutRoute'
import Backdrop from 'components/Backdrop'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { getDetailsById } from 'services/web-bff/booking'
import { BookingRental, BookingPayment } from 'services/web-bff/booking.type'
import { useStyles, ChipServiceType, ChipPaymentType, DisabledField } from './styles'
import {
  defaultBookingDetail,
  DefaultCarDetail,
  convertToDuration,
  columnFormatBookingStatus,
  BookingStatus,
  formatIsExtend,
  ServiceTypeLocation,
} from './utils'

interface SubscriptionDetailParams {
  bookingId: string
  bookingDetailId: string
}

export function hasStatusAllowedToDoCarReplacement(status: string | undefined): boolean {
  if (!status) {
    return false
  }
  return [BookingStatus.ACCEPTED, BookingStatus.DELIVERED].includes(status.toLowerCase())
}

export default function SubscriptionDetail(): JSX.Element {
  const classes = useStyles()
  const { getPrivileges, firebaseUser } = useAuth()
  const currentPrivilege = getPrivileges()
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()

  const getStateAsString = (state: string): string | null => {
    if (typeof state === 'string') {
      return state
    }
    return null
  }

  const getResellerServiceAreaId = (state: string, localReseller: string): string | null => {
    return getStateAsString(state) || localReseller || null
  }

  const resellerCar = ls.get<string>('reseller_car')
  const resellerServiceAreaId = getResellerServiceAreaId(
    location.state as string,
    resellerCar as string
  )

  const { bookingId, bookingDetailId } = useParams<SubscriptionDetailParams>()

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.bookingManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.bookingManagement.booking'),
      link: '/booking',
    },
    {
      text: t('sidebar.bookingManagement.detail'),
      link: `/booking/${bookingId}`,
    },
  ]

  const { data: bookingDetails, isFetching } = useQuery(
    'booking',
    () => getDetailsById(resellerServiceAreaId, bookingDetailId),
    {
      refetchOnWindowFocus: false,
    }
  )

  // eslint-disable-next-line
  const defaultVal = (value: any, defaultValue?: any) => {
    if (value) {
      return value
    }

    return defaultValue
  }

  const getBookingDetail = (bookingDetails: BookingRental[] | undefined) => {
    if (bookingDetails && bookingDetails.length > 0) {
      const bookingData = bookingDetails.find((booking) => booking.id === bookingDetailId)
      if (bookingData) {
        bookingData.id = defaultVal(bookingData.id, '-')
        bookingData.rentDetail.chargePrice = defaultVal(bookingData.rentDetail.chargePrice, 0)
        bookingData.rentDetail.durationDay = defaultVal(bookingData.rentDetail.durationDay, 0)
        bookingData.rentDetail.voucherId = defaultVal(
          bookingData.rentDetail.voucherId,
          t('subscription.noData')
        )
        bookingData.rentDetail.voucherCode = defaultVal(
          bookingData.rentDetail.voucherCode,
          t('subscription.noData')
        )
        bookingData.bookingId = defaultVal(bookingData.bookingId, '-')
        bookingData.customer.id = defaultVal(bookingData.customer.id, '-')
        bookingData.customer.firstName = defaultVal(bookingData.customer.firstName, '-')
        bookingData.customer.lastName = defaultVal(bookingData.customer.lastName, '-')
        bookingData.customer.email = defaultVal(bookingData.customer.email, '-')
        bookingData.customer.phoneNumber = defaultVal(bookingData.customer.phoneNumber, '-')
        bookingData.isSelfPickUp = defaultVal(bookingData.isSelfPickUp, false)
      }
      return bookingData
    }
    return defaultBookingDetail()
  }

  const bookingDetail = getBookingDetail(bookingDetails)

  const getMaxEndDate = (bookingDetails: BookingRental[] | undefined) => {
    let endDate = new Date()
    if (bookingDetails && bookingDetails.length > 0) {
      endDate = new Date(
        Math.max(
          ...bookingDetails.map((bookingDetail) => new Date(bookingDetail.endDate).getTime())
        )
      )
    }
    return endDate
  }

  const maxEndDate = getMaxEndDate(bookingDetails)

  const getCarActivities = (bookingDetail: BookingRental | undefined) => {
    if (bookingDetail) {
      return bookingDetail.carActivities.reverse()
    }
    return []
  }
  const carActivities = getCarActivities(bookingDetail)

  const isAllowToDoCarReplacement = hasStatusAllowedToDoCarReplacement(bookingDetail?.displayStatus)
  const isTherePermissionToDoCarReplacement = hasAllowedPrivilege(currentPrivilege, [
    PRIVILEGES.PERM_BOOKING_RENTAL_EDIT,
  ])
  const checkDateOverToday = (bookingDetail: BookingRental | undefined) => {
    if (bookingDetail) {
      return new Date(bookingDetail?.endDate) < new Date()
    }
    return false
  }
  const isEndDateOverToday = checkDateOverToday(bookingDetail)

  const initialCarDetail = (): DefaultCarDetail => {
    return {
      no: 0,
      carId: '',
      location: '',
      brand: '',
      model: '',
      colour: '',
      plateNumber: '',
      pickupDate: '',
      returnDate: '',
      serviceType: false,
      owner: '',
      reseller: '',
      deliveryTask: {
        latitude: 0,
        longitude: 0,
        date: '',
        fullAddress: '',
        remark: '',
        createdDate: '',
      },
      returnTask: {
        latitude: 0,
        longitude: 0,
        date: '',
        fullAddress: '',
        remark: '',
      },
    }
  }
  const getServiceTypeLocation = (
    serviceTypeLocations: ServiceTypeLocation[],
    isSelfPickup: boolean | undefined
  ) => {
    const deliverBy = isSelfPickup === true ? 'SELF_PICK_UP' : 'DELIVERY_BY_EVME'
    const serviceLocation = serviceTypeLocations.find(
      (location: ServiceTypeLocation) =>
        location.isActive === true && location.serviceType === deliverBy
    )
    return serviceLocation
  }

  // eslint-disable-next-line
  const multipleDefaultVal = (value: any, anotherValue: any, defaultValue?: any) => {
    if (value) {
      return value
    }

    if (anotherValue) {
      return anotherValue
    }

    return defaultValue
  }

  // eslint-disable-next-line
  const createCarDetail = (car: any, index: number): DefaultCarDetail => {
    const carDetail = initialCarDetail()

    let task = null
    if (car?.resellerServiceArea?.serviceTypeLocations) {
      task = getServiceTypeLocation(
        car?.resellerServiceArea?.serviceTypeLocations,
        bookingDetail?.isSelfPickUp
      )
    }

    carDetail.no = index + 1
    carDetail.carId = multipleDefaultVal(car?.carId, bookingDetail?.carId, '-')
    carDetail.location = multipleDefaultVal(
      car?.carDetail?.resellerServiceArea?.areaNameEn,
      car?.location,
      '-'
    )
    carDetail.brand = multipleDefaultVal(
      car?.carDetail?.carSku?.carModel?.brand?.name,
      car?.carSku?.carModel?.brand?.name,
      '-'
    )
    carDetail.model = multipleDefaultVal(
      car?.carDetail?.carSku?.carModel?.name,
      car?.carSku?.carModel?.name,
      '-'
    )
    carDetail.colour = multipleDefaultVal(car?.carDetail?.carSku?.color, car?.carSku?.color, '-')
    carDetail.plateNumber = multipleDefaultVal(car?.carDetail?.plateNumber, car?.plateNumber, '-')
    carDetail.pickupDate = multipleDefaultVal(
      car?.deliveryTask?.date,
      bookingDetail?.startDate,
      '-'
    )
    carDetail.returnDate = multipleDefaultVal(car?.returnTask?.date, bookingDetail?.endDate, '-')
    carDetail.serviceType = multipleDefaultVal(
      car?.isSelfPickUp,
      bookingDetail?.isSelfPickUp,
      false
    )
    carDetail.owner = multipleDefaultVal(car?.carDetail?.owner, car?.owner, '-')
    carDetail.reseller = multipleDefaultVal(car?.carDetail?.reSeller, car?.reSeller, '-')
    carDetail.deliveryTask.latitude = multipleDefaultVal(
      car?.deliveryTask?.latitude,
      task?.latitude,
      '-'
    )
    carDetail.deliveryTask.longitude = multipleDefaultVal(
      car?.deliveryTask?.longitude,
      task?.longitude,
      '-'
    )
    carDetail.deliveryTask.fullAddress = multipleDefaultVal(
      car?.deliveryTask?.fullAddress,
      task?.addressTh,
      '-'
    )
    carDetail.deliveryTask.date =
      multipleDefaultVal(car?.deliveryTask?.date, bookingDetail?.startDate, '-') ?? '-'
    carDetail.deliveryTask.createdDate =
      multipleDefaultVal(car?.deliveryTask?.createdDate, bookingDetail?.createdDate, '-') ?? '-'
    carDetail.deliveryTask.remark =
      multipleDefaultVal(car?.deliveryTask?.remark, bookingDetail?.remark, '-') ?? '-'
    carDetail.returnTask.latitude = multipleDefaultVal(car?.returnTask?.latitude, task?.latitude, 0)
    carDetail.returnTask.longitude = multipleDefaultVal(
      car?.returnTask?.longitude,
      task?.longitude,
      0
    )
    carDetail.returnTask.fullAddress = multipleDefaultVal(
      car?.returnTask?.fullAddress,
      task?.addressTh,
      '-'
    )
    carDetail.returnTask.date = multipleDefaultVal(
      car?.returnTask?.date,
      bookingDetail?.endDate,
      '-'
    )
    carDetail.returnTask.remark = multipleDefaultVal(
      car?.returnTask?.remark,
      bookingDetail?.remark,
      '-'
    )

    return carDetail
  }

  const getCarDetails = (): DefaultCarDetail[] => {
    if (carActivities.length > 0) {
      return carActivities.map(createCarDetail)
    }

    if (bookingDetail?.car) {
      return [createCarDetail(bookingDetail.car, 0)]
    }

    return []
  }
  const columnHead = [
    {
      colName: t('booking.carDetail.no'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.location'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.brand'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.model'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.color'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.plateNumber'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.pickupDate'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.returnDate'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.serviceType'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.owner'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.reseller'),
      hidden: false,
    },
  ]
  const columnRow = [
    {
      field: 'no',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
    {
      field: 'location',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
    {
      field: 'brand',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
    {
      field: 'model',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
    {
      field: 'colour',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
    {
      field: 'plateNumber',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
    {
      field: 'pickupDate',
      hidden: false,
      render: (value: string) => {
        return (
          <div className={classes.paddingLeftCell}>
            {value ? formatDate(value, DEFAULT_DATETIME_FORMAT_MONTH_TEXT) : '-'}
          </div>
        )
      },
    },
    {
      field: 'returnDate',
      hidden: false,
      render: (value: string) => {
        return (
          <div className={classes.paddingLeftCell}>
            {value ? formatDate(value, DEFAULT_DATETIME_FORMAT_MONTH_TEXT) : '-'}
          </div>
        )
      },
    },
    {
      field: 'serviceType',
      hidden: false,
      render: (value: string) => {
        return (
          <ChipServiceType
            label={
              value === 'true'
                ? t('booking.carDetail.serviceTypes.selfPickUp')
                : t('booking.carDetail.serviceTypes.deliverByEVme')
            }
            color="primary"
          />
        )
      },
    },
    {
      field: 'owner',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
    {
      field: 'reseller',
      hidden: false,
      render: (value: string) => {
        return <div className={classes.paddingLeftCell}>{value}</div>
      },
    },
  ]
  const carDetails = getCarDetails()
  const rowData = carDetails?.map((car: DefaultCarDetail) => {
    return (
      <TableRow
        hover
        key={`booking-${bookingId}-${bookingDetailId}`}
        onClick={() =>
          history.push({
            pathname: `/booking/${bookingId}/${bookingDetailId}/car/${car.carId}`,
            state: {
              carActivity: car,
              isSelfPickUp: bookingDetail?.isSelfPickUp,
              resellerServiceAreaId,
            },
          })
        }
      >
        {columnRow.map((col) => (
          <TableCell key={col.field} hidden={col.hidden}>
            <div className={classes.paddingLeftCell}>
              {col.render ? col.render(car[col.field].toString()) : <div>{car[col.field]}</div>}
            </div>
          </TableCell>
        ))}
      </TableRow>
    )
  }) || (
    <TableRow>
      <TableCell colSpan={columnHead.length} align="center">
        {t('booking.noData')}
      </TableCell>
    </TableRow>
  )

  return (
    <Page>
      <PageTitle title={t('sidebar.bookingManagement.detail')} breadcrumbs={breadcrumbs} />
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">
            <strong>{t('sidebar.bookingManagement.detail')}</strong>
          </Typography>
        </Grid>
        {/* Booking Detail ID and Status */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__bookingdetailid"
              label={t('booking.details.id')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.id}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__status"
              label={t('booking.details.status')}
              fullWidth
              disabled
              variant="outlined"
              value={columnFormatBookingStatus(bookingDetail?.displayStatus, t)}
            />
          </Grid>
        </Grid>
        {/* Price and Duration */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__price"
              label={t('booking.details.price')}
              fullWidth
              disabled
              variant="outlined"
              value={Number(bookingDetail?.rentDetail.chargePrice).toLocaleString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__duration"
              label={t('booking.details.duration')}
              fullWidth
              disabled
              variant="outlined"
              value={convertToDuration(bookingDetail?.rentDetail.durationDay, t)}
            />
          </Grid>
        </Grid>
        {/* Voucher ID and Voucher Code */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__voucherid"
              label={t('booking.details.voucherId')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.rentDetail.voucherId}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__vouchercode"
              label={t('booking.details.voucherCode')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.rentDetail.voucherCode}
            />
          </Grid>
        </Grid>
        {/* Start Date and End Date */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__startdate"
              label={t('booking.details.startDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.startDate).format(DEFAULT_DATE_FORMAT_MONTH_TEXT)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__enddate"
              label={t('booking.details.endDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.endDate).format(DEFAULT_DATE_FORMAT_MONTH_TEXT)}
            />
          </Grid>
        </Grid>
        {/* Created Date and Updated Date */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__createdate"
              label={t('booking.details.createDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.createdDate).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__updatedate"
              label={t('booking.details.updateDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.updatedDate).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
            />
          </Grid>
        </Grid>
        {/* Is Extend and Parent ID */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__isextend"
              label={t('booking.details.isExtend')}
              fullWidth
              disabled
              variant="outlined"
              value={formatIsExtend(bookingDetail?.isExtend)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__parentid"
              label={t('booking.details.parentId')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.bookingId || '-'}
            />
          </Grid>
        </Grid>
      </Card>

      <Card className={classes.subCard}>
        <Grid className={classes.gridSubTitle}>
          <Typography variant="h6">
            <strong>{t('booking.carDetail.title')}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              history.push({
                pathname: `/booking/${bookingId}/${bookingDetailId}/car-replacement`,
                state: { bookingDetail, maxEndDate, editorEmail: firebaseUser?.email || '-' },
              })
            }
            disabled={
              !bookingDetail ||
              !isAllowToDoCarReplacement ||
              !isTherePermissionToDoCarReplacement ||
              isEndDateOverToday
            }
          >
            {t('booking.carDetail.replacement')}
          </Button>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                {columnHead.map((col) => (
                  <TableCell key={col.colName} hidden={col.hidden}>
                    <div className={classes.columnHeader}>{col.colName}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{rowData}</TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card className={classes.subCard}>
        <Grid className={classes.gridSubTitle}>
          <Typography variant="h6">
            <strong>{t('booking.customer.title')}</strong>
          </Typography>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('booking.customer.customerId')}</TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.firstName')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.lastName')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.email')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.phone')}</div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingDetail?.customer ? (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {bookingDetail.customer.id || '-'}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.firstName || '-'}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.lastName || '-'}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.email || '-'}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.phoneNumber || '-'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('booking.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card className={classes.subCard}>
        <Grid className={classes.gridSubTitle}>
          <Typography variant="h6">
            <strong>{t('booking.payment.title')}</strong>
          </Typography>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('booking.payment.id')}</TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.amount')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.paymentType')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.purpose')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.status')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.statusMessage')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.updatedDate')}</div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingDetail?.payments && bookingDetail?.payments.length > 0 ? (
                bookingDetail?.payments.map((payment: BookingPayment) => (
                  <TableRow key={payment.id}>
                    <TableCell component="th" scope="row">
                      {payment.externalTransactionId || '-'}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {Number(payment.amount || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>{payment.type || '-'}</div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>{payment.description || '-'}</div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        <ChipPaymentType label={payment.status} color="primary" />
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>{payment.statusMessage || '-'}</div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        <div className={classes.wrapWidth}>
                          <div className={classes.rowOverflow}>
                            {formatDate(payment?.updatedDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('booking.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* <CarDetailDialog
        open={carDetailDialogOpen}
        car={carDetail}
        isSelfPickUp={bookingDetail.isSelfPickUp}
        onClose={() => {
          setCarDetail(undefined)
          setCarDetailDialogOpen(false)
        }}
      />
      <CarReplacementDialog
        editorEmail={firebaseUser?.email || '-'}
        open={carReplacementDialogOpen}
        bookingDetail={bookingDetail}
        maxEndDate={maxEndDate}
        onClose={(needRefetch) => {
          if (needRefetch) {
            refetchBooking()
          }
          setCarReplacementlogOpen(false)
        }}
      /> */}
      <Backdrop open={isFetching} />
    </Page>
  )
}
