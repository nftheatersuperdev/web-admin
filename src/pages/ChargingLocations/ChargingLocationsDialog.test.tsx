import { screen } from '@testing-library/react'
import { noop, renderComponent } from 'tests/utils'
import ChargingLocationsDialog from './ChargingLocationsDialog'

describe('ChargingLocationsDialog', () => {
  const chargingLocation = {
    name: 'MG Sequoya Co., Ltd. - เซควาญ่าเอ็มจี จำกัด (คันนายาว)',
    provider: 'plugshare',
    address: '599 ถนนรามอินทรา แขวงคันนายาว เขตคันนายาว กรุงเทพฯ 10230',
  }

  it('should show correct title, provider and address', () => {
    renderComponent(
      <ChargingLocationsDialog open={true} onClose={noop} location={chargingLocation} />
    )
    expect(screen.getByText(chargingLocation.name)).toBeInTheDocument()
    expect(screen.getByText(chargingLocation.provider)).toBeInTheDocument()
    expect(screen.getByText(chargingLocation.address)).toBeInTheDocument()
  })
})
