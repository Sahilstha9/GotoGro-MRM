import React, { forwardRef, useEffect, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { InputField } from "./InputField"

function HiddenInputFieldRenderer(props, ref) {
    const { type = "text", ...inputProps } = props

    const inputRef = useRef(null)
    useEffect(() => {
        const { current: input } = inputRef
        if (!input) return

        const onFocus = () => {
            input.type = type
        }
        const onBlur = () => {
            input.type = "password"
        }

        input.addEventListener("focus", onFocus)
        input.addEventListener("blur", onBlur)

        return () => {
            input.removeEventListener("focus", onFocus)
            input.removeEventListener("blur", onBlur)
        }
    }, [type])

    return (
        <InputField
            ref={mergeRefs([inputRef, ref])}
            type="password"
            {...inputProps}
        />
    )
}

export const HiddenInputField = forwardRef(HiddenInputFieldRenderer)
