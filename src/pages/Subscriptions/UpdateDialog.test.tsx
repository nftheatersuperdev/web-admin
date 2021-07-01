import { screen } from '@testing-library/react'
import { noop, renderComponent } from 'tests/utils'
import UpdateDialog from './UpdateDialog'

describe('UpdateDialog', () => {
  const mockSubscription = {
    brand: 'Tesla',
    createdAt: '2021-06-16T20:08:29.085Z',
    duration: '1w',
    email: 'furyou888@gmail.com',
    endAddress: ' Phra Borom Maha Ratchawang Phra Nakhon Bangkok Thailand 10200',
    endDate: '2021-06-25T01:00:00.000Z',
    fastChargeTime: 4,
    firstName: 'Ryoo',
    id: '51da7007-6aec-4d58-ab77-e2d4be52455b',
    modelId: '51da7007-6aec-4d58-ab77-e2d4be52455b',
    lastName: 'Fuu',
    model: 'Model 3',
    phoneNumber: '+33673359664',
    plateNumber: 'r8xsh',
    price: 10000,
    seats: 5,
    startAddress: ' Phra Borom Maha Ratchawang Phra Nakhon Bangkok Thailand 10200',
    startDate: '2021-06-18T01:00:00.000Z',
    topSpeed: 233,
    updatedAt: '2021-06-16T20:08:29.085Z',
    vin: 'ot37yz6ghj8wkb6np',
  }

  it('should render correct sections', () => {
    renderComponent(<UpdateDialog onClose={noop} open={true} subscription={mockSubscription} />)
    expect(screen.getByText('Update Subscription Details')).toBeInTheDocument()
    expect(screen.getByText('Booking Details')).toBeInTheDocument()
    expect(screen.getByText('Car Details')).toBeInTheDocument()
  })
})
