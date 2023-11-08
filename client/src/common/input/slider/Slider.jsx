import React from "react"
import { InputContainer } from "../layout/InputContainer"
import { InputLabel } from "../layout/InputLabel"
import { Handle, Input, Marker, MarkerLabel, Range, Track } from "./layout"

export function Slider(props) {
    const {
        id,
        label,
        value,
        onChange: handleChange,
        min,
        max,
        step,
        markers,
        getValueName
    } = props

    return (
        <InputContainer>
            <InputLabel>{label}</InputLabel>
            <Input
                id={id}
                min={min}
                max={max}
                step={step}
                value={value}
                getAriaLabel={() => label}
                getAriaValueText={getValueName}
                hasMarkers={Number(markers?.length) > 0}
                onChange={value => handleChange(value)}
            >
                {({ hasFocus }) => (
                    <Track>
                        <Range />
                        {markers?.map(marker => (
                            <Marker key={marker.value} value={marker.value}>
                                <MarkerLabel>{marker.label}</MarkerLabel>
                            </Marker>
                        ))}
                        <Handle hasFocus={hasFocus} />
                    </Track>
                )}
            </Input>
        </InputContainer>
    )
}
