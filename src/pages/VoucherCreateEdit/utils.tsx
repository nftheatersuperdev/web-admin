import { FormEvent, KeyboardEvent } from 'react'

export const handleValidateNumericKeyPress = (event: KeyboardEvent): void => {
  const allowCharacters = /\d/
  if (!allowCharacters.test(event.key)) {
    event.preventDefault()
  }
}

export const handleValidatePercentageValue = (event: FormEvent, maximum = 100): void => {
  const target = event.target as HTMLInputElement
  target.value = target.value.toUpperCase().replace(/\s/g, '')
  if (Number(target.value) > maximum) {
    target.value = String(maximum)
  }
}

export const handleValidateCodeValue = (event: FormEvent): void => {
  const target = event.target as HTMLInputElement
  target.value = target.value.toUpperCase().replace(/\s/g, '')
}

export const handleValidateCodeKeyPress = (event: React.KeyboardEvent): void => {
  const allowCharacters = /[a-zA-Z0-9]/
  if (!allowCharacters.test(event.key)) {
    event.preventDefault()
  }
}

export const handleDisableEvent = (event: FormEvent): void => {
  event.preventDefault()
}

export const selectOptions = {
  ALL: 'all',
  SELECT: 'select',
}
