import {InputHTMLAttributes, useEffect, useState} from "react";
import {TextField} from "@mui/material";
import React from "react";

interface DebouncedTextFieldProps {
    label?: string,
    placeholder?: string,
    variant?: 	'filled' | 'outlined' | 'standard',
    fullWidth?: boolean,
    value:  string | number,
    onChange: (value:  string | number) => void,
    debounce?: number,
}

export function DebouncedTextField({
    value: initialValue,
    onChange,
    variant = 'outlined',
    debounce = 500,
    label,
    placeholder,
    fullWidth,
   ...props
}: DebouncedTextFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {

    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        // @ts-ignore
        <TextField
            onChange={e => setValue(e.target.value)}
            value={value}
            label={label}
            placeholder={placeholder}
            fullWidth={fullWidth}
            variant={variant}
            {...props}
        />
    )
}