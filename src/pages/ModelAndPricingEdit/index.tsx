import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getModelPriceById } from 'services/web-bff/car'
import { Page } from 'layout/LayoutRoute'
import { ModelAndPricingEditParams } from './types'
import ModelForm from './ModelForm'
import PricingForm from './PricingForm'

export default function ModelAndPricingEdit(): JSX.Element {
  const { id } = useParams<ModelAndPricingEditParams>()

  const { data: car } = useQuery('model-and-pricing-edit-page', () => getModelPriceById({ id }))

  return (
    <Page>
      <ModelForm car={car} />
      <PricingForm rentalPackages={car?.rentalPackages} />
    </Page>
  )
}
