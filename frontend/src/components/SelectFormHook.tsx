import {Control, Controller} from "react-hook-form";
import {FormHelperText, Select} from "@mui/material";
import React from "react";
import MenuItem from "@mui/material/MenuItem";

interface SelectFormWithHookProps {
    control: Control<any, any>, // Comes from the useForm() hook in React-Hook-Form
    name: string // Necessary to identify component from a form in React-Hook-Form
    label: string,
    options: string[] // TODO: should we have value AND label for each item?1
    defaultValue: string,
    errors?: any,
    type?: "password"|"text"|"email",
    fullWidth?: boolean
    onChange?: (value: any) => void // Needed to inform parent component about the Textfield current value
}

export const SelectFormWithHook = (props: SelectFormWithHookProps) => {

    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            render={({ field, fieldState  }) => (
                <>
                    <Select
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
                        error={!!props.errors}
                        type={props.type}
                        fullWidth={props.fullWidth}
                    >
                        {(["",...props.options]).map((option: string, index: number) => {
                            return(
                                <MenuItem
                                    key={index}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            )
                        })}
                    </Select>
                    <FormHelperText
                        error={!!props.errors}
                    >
                        {fieldState.error?.message}
                    </FormHelperText>
                </>
            )}
        />
    );
};