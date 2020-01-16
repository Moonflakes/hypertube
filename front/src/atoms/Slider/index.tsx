import React from 'react'
import theme from '../../theme';
import { DefaultTheme } from 'styled-components';
import { Range, createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

interface SliderProps {
    min: number
    max: number
    value: number[]
    onChange: any
    theme?: DefaultTheme
    children?: any
}

const RangeTool = createSliderWithTooltip(Range);

const Slider: React.FC<SliderProps> = (props: SliderProps) => {

    const handleStyle = {
        width: 15,
        height: 15,
        backgroundColor: theme.colors.white,
        boxShadow: "none",
        border: `1px solid ${theme.colors.primaryRed}`,
        '&:hover': {
            boxShadow: "none",
            border: "none"
        },
        '&:active': {
            boxShadow: "none",
            border: "none"
        },
    }

    const trackStyle = {
        backgroundColor: theme.colors.primaryRed,
        width: "100%"
    }

    return (
        <>
        {props.children}
        <RangeTool
            handleStyle={handleStyle}
            trackStyle={[trackStyle]}
            min={props.min}
            max={props.max}
            defaultValue={[props.value[0], props.value[1]]}
            onChange={props.onChange}
        />
        </>
    )
}
export default Slider;