import { FC } from "react"
import { ButtonWrapper, CloseButton, StepHeader } from "./header"

type CloseOnlyHeaderProps = {
  onClose: () => void
}

export const CloseOnlyHeader: FC<CloseOnlyHeaderProps> = ({ onClose }) => {
  return (
    <StepHeader>
      <ButtonWrapper />
      <CloseButton onClick={onClose}>close</CloseButton>
    </StepHeader>
  )
}
