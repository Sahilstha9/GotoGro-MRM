import React from "react"
import styled from "styled-components"
import { InputContainer } from "../layout/InputContainer"
import { InputLabel } from "../layout/InputLabel"
import { RadioProvider } from "./RadioContext"

const GroupContainer = styled.div`
  display: flex;

  & > * {
    margin-right: 8px;
  }
`

export function RadioGroup(props) {
    const { id, label, value, onChange: handleChange, children } = props

    return (
        <RadioProvider
            value={{
                id,
                selected: value,
                handleChange: event => handleChange(event.target.value)
            }}
        >
            <InputContainer role="radiogroup" aria-labelledby={id}>
                <InputLabel>
                    <label htmlFor={id}>{label}</label>
                </InputLabel>
                <GroupContainer>{children}</GroupContainer>
            </InputContainer>
        </RadioProvider>
    )
}
