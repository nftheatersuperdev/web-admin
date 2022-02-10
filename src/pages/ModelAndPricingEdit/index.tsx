import { useParams } from 'react-router-dom'
import { Page } from 'layout/LayoutRoute'
import { useCarModelById } from 'services/evme'
import ModelForm from './ModelForm'
import { ModelAndPricingEditParams } from './types'
import PricingForm from './PricingForm'

export default function ModelAndPricingEdit(): JSX.Element {
  const { carModelId } = useParams<ModelAndPricingEditParams>()
  const mockDateTime = new Date().toDateString()
  const { data: carModel, refetch } = useCarModelById({
    carModelId,
    availableFilter: { startDate: mockDateTime, endDate: mockDateTime },
  })

  return (
    <Page>
      <ModelForm carModel={carModel} refetch={refetch} />
      <PricingForm
        modelId={carModel?.id || ''}
        modelOptions={[{ id: carModel?.id || '', modelName: carModel?.model || '' }]}
      />
    </Page>
  )
}
