import {Control, Controller, FieldValues, useForm} from "react-hook-form";
import {TextField} from "@mui/material";
import React from "react";

interface TextInputFormWithHookProps {
    control: Control<any, any>, // Comes from the useForm() hook in React-Hook-Form
    name: string // Necessary to identify component from a form in React-Hook-Form
    label: string,
    defaultValue: string,
    errors?: any,
    type?: "password"|"text"|"email",
    fullWidth?: boolean
}

export const TextInputFormWithHook = (props: TextInputFormWithHookProps) => {

    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            render={({ field, fieldState  }) => (
                <TextField
                    inputRef={field.ref}
                    onChange={field.onChange}
                    value={field.value}
                    label={props.label}
                    helperText={fieldState.error?.message}
                    error={!!props.errors}
                    type={props.type}
                />
            )}
        />
    );
};