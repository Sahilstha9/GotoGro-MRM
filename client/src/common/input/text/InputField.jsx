import React, { forwardRef } from "react"
import styled from "styled-components"
import { FlexContainer } from "../../layout/FlexContainer"
import { InputError } from "../error/InputError"
import { getLengthConstraintColor } from "../getLengthConstraintColor"
import { Input } from "../layout/Input"
import { InputConstraint } from "../layout/InputConstraint"
import { InputContainer } from "../layout/InputContainer"
import { InputLabel } from "../layout/InputLabel"

const TextInput = styled(Input)`
  ${FlexContainer} > & {
    flex: 1;
  }
`

function InputFieldRenderer(props, ref) {
    const {
        id,
        value,
        onChange: handleChange,
        label,
        hideLabel,
        type,
        rows,
        placeholder,
        maxLength,
        required,
        disabled,
        readOnly,
        error,
        className,
        onClick: handleClick,
        onFocus: handleFocus,
        onBlur: handleBlur,
        children
    } = props

    const input = (
        <TextInput
            ref={ref}
            as={rows ? "textarea" : "input"}
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            style={{ height: rows ? 15 + 21 * rows : undefined }}
            onChange={event => handleChange(event.target.value)}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label={hideLabel ? label : undefined}
        />
    )

    return (
        <InputContainer className={className}>
            <InputLabel>
                {!hideLabel && <label htmlFor={id}>{label}</label>}
                {required && <InputConstraint state="normal">Required</InputConstraint>}
                {maxLength && (
                    <InputConstraint
                        state={getLengthConstraintColor(value.length, maxLength)}
                    >
                        {value.length}/{maxLength}
                    </InputConstraint>
                )}
            </InputLabel>
            {Object.prototype.hasOwnProperty.call(props, "children") ? (
                <FlexContainer>
                    {input}
                    {children}
                </FlexContainer>
            ) : (
                input
            )}
            <InputError error={error} />
        </InputContainer>
    )
}

export const InputField = forwardRef(InputFieldRenderer)
