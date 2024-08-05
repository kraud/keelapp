import {Control, Controller} from "react-hook-form";
import {TextField} from "@mui/material";
import React from "react";
import {InputProps as StandardInputProps} from "@mui/material/Input/Input";

interface TextInputFormWithHookProps {
    control: Control<any, any>, // Comes from the useForm() hook in React-Hook-Form
    name: string // Necessary to identify component from a form in React-Hook-Form
    label: string,
    defaultValue: string,
    errors?: any,
    type?: "password"|"text"|"email",
    fullWidth?: boolean
    onChange?: (value: any) => void // Needed to inform parent component about the Textfield current value
    disabled?: boolean
    triggerOnEnterKeyPress?: () => void
    inputProps?: Partial<StandardInputProps>
}

export const TextInputFormWithHook = (props: TextInputFormWithHookProps) => {
    const componentStyles = {
        disabledStyles: {
            "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
            },
            "& label": {
                color: 'black',
                WebkitTextFillColor: 'black',
            },
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: 'black !important',
            }
        },
    }

    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            render={({ field, fieldState  }) => (
                <TextField
                    onKeyDown={(e: any) => {
                        if((e.key === 'Enter') && (props.triggerOnEnterKeyPress !== undefined)){
                            props.triggerOnEnterKeyPress()
                        }
                    }}
                    inputRef={field.ref}
                    onChange={(value: any) => {
                        if(props.onChange!){ // if added, we share with parent the new value
                            props.onChange(value.target.value)
                        }
                        field.onChange(value)
                    }}
                    onBlur={field.onBlur}
                    value={field.value}
                    label={props.label}
                    helperText={fieldState.error?.message}
                    error={!!props.errors}
                    type={props.type}
                    fullWidth={props.fullWidth}
                    disabled={props.disabled}
                    sx={(props.disabled!) ?componentStyles.disabledStyles :undefined}
                    InputProps={{
                        ...props.inputProps
                    }}
                />
            )}
        />
    );
};