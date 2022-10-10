import { ChangeEventHandler, FC, useCallback } from 'react';

import './input.component.scss'

type InputProps = {
  placeholder: string
  onChange?: (value: string) => void
  disabled?: boolean
  id?: string
  className?: string
  value?: string
}

export const Input: FC<InputProps> = ({ disabled, placeholder, onChange, id, className ,value }) => {
  const onChangeEventHndlr: ChangeEventHandler<HTMLInputElement> = useCallback(({ target: { value } }) => {
    if (onChange) {
      onChange(value)
    }
  }, [])

  return <input
    id={id}
    className={`kyc-input ${disabled ? 'disabled' : ''} ${className}`}
    type="text"
    placeholder={placeholder}
    onChange={onChangeEventHndlr}
    disabled={disabled}
    value={value}
  />
}