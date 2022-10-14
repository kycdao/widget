import { ChangeEventHandler, FC, useCallback, useEffect, useRef, useState } from 'react';

import './input.component.scss'

const specialRegex = /[!$(){}[\]:;<+?\\>]/g

type InputProps = {
  placeholder: string
  onChange?: (value: string) => void
  disabled?: boolean
  id?: string
  className?: string
  value?: string
  autoCompleteData?: string[]
  autoFocus?: boolean
}

export const Input: FC<InputProps> = ({ disabled, placeholder, onChange, id, className, value = '', autoCompleteData, autoFocus }) => {
  const [showAutoComplete, setShowAutoComplete] = useState(false)
  const autocompleteRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onChangeEventHndlr: ChangeEventHandler<HTMLInputElement> = useCallback(({ target: { value } }) => {
    if (onChange) {
      onChange(value)
    }
    setShowAutoComplete(true)
  }, [])

  useEffect(() => {
    function closeEventHndlr(this: Document, { target }: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(target as Node)) {
        setShowAutoComplete(false)
      }
    }

    document.addEventListener('mousedown', closeEventHndlr)

    return () => document.removeEventListener('mousedown', closeEventHndlr)
  }, [])

  useEffect(() => {
    function hndlr() {
      if (!showAutoComplete) {
        setShowAutoComplete(true)
      }
    }

    inputRef.current?.addEventListener('focus', hndlr)

    return () => inputRef.current?.addEventListener('focus', hndlr)
  }, [])

  const onAutocompleteHndlr = useCallback((value: string) => () => {
    if (onChange) {
      onChange(value)
    }
    setShowAutoComplete(false)
  }, [])

  return <>
    {showAutoComplete && autoCompleteData && value && <div ref={autocompleteRef} className="autocomplete">
      {autoCompleteData.filter(v => v.match(new RegExp(value.replace(specialRegex, ''), 'ig'))).map((v, i) =>
        <div dangerouslySetInnerHTML={{ __html: v.replace(new RegExp(`(${value.replace(specialRegex, '')})`, 'ig'), '<strong>$1</strong>')}} className={`kyc-option full-width${i === 0 ? ' first' : ''}`} onClick={onAutocompleteHndlr(v)} key={v} />)}
    </div>}
          <input
            autoFocus={autoFocus}
            ref={inputRef}
            id={id}
            className={`kyc-input ${disabled ? 'disabled' : ''} ${className}`}
            type="text"
            placeholder={placeholder}
            onChange={onChangeEventHndlr}
            disabled={disabled}
            value={value}
          />
  </>
}
