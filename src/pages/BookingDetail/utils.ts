import { BookingRental } from 'services/web-bff/booking.type'

export interface BookingDetailParams {
  bookingId: string
  bookingDetailId: string
}

export const initialBookingDetail: BookingRental = {
  id: '',
  bookingId: '',
  customerId: '',
  customer: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  },
  rentDetail: {
    id: '',
    bookingDetailId: '',
    packagePriceId: '',
    voucherId: '',
    voucherCode: '',
    paymentTerm: '',
    tenantPrice: 0,
    durationDay: 0,
    discountPrice: '',
    chargePrice: 0,
    currency: '',
    agreementId: '',
    status: '',
    isAcceptedAgreement: false,
    isAcceptedCarCondition: false,
    createdDate: '',
    updatedDate: '',
  },
  carActivities: [],
  payments: [],
  carId: '',
  carTasks: [],
  car: {
    id: '',
    plateNumber: '',
    vin: '',
    carTrackId: '',
    isActive: false,
    carSku: {
      id: '',
      images: [],
      carModel: {
        id: '',
        connectorTypes: [],
        name: '',
        bodyType: '',
        brand: {
          name: '',
          imageUrl: '',
        },
        carSkus: [],
        chargers: [],
        year: 0,
        chargeTime: 0,
        acceleration: 0,
        batteryCapacity: 0,
        fastChargeTime: 0,
        horsePower: 0,
        priority: 0,
        range: 0,
        topSpeed: 0,
        totalPower: 0,
        totalTorque: 0,
        seats: 0,
        segment: '',
        subModelName: '',
        condition: '',
        rentalPackages: null,
        createdDate: '',
        updatedDate: '',
      },
      color: '',
      colorHex: '',
      createdDate: '',
      updatedDate: '',
    },
    resellerServiceArea: {
      id: '',
      businessId: '',
      areaNameTh: '',
      areaNameEn: '',
      serviceTypeLocations: [],
    },
    createdDate: '',
    updatedDate: '',
  },
  startDate: '',
  endDate: '',
  displayStatus: '',
  status: '',
  bookingTypeId: '',
  remark: '',
  isPaymentRequired: false,
  isTimeslotRequired: false,
  isExtend: false,
  isReplacement: false,
  isSelfPickUp: false,
  createdBy: '',
  updatedBy: '',
}
