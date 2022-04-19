import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { getById } from 'services/web-bff/car'
import { Page } from 'layout/LayoutRoute'
import ModelForm from './ModelForm'
import { ModelAndPricingEditParams } from './types'
import PricingForm from './PricingForm'

export default function ModelAndPricingEdit(): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const { id } = useParams<ModelAndPricingEditParams>()

  const { data: car, refetch } = useQuery('model-and-pricing-edit-page', () =>
    getById({ accessToken, id })
  )

  return (
    <Page>
      <ModelForm car={car} refetch={refetch} />
      <PricingForm carId={id || ''} modelOptions={[{ id, modelName: car?.name || '' }]} />
    </Page>
  )
}
