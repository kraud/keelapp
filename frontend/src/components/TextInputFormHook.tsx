import {Control, Controller} from "react-hook-form";
import {TextField} from "@mui/material";
import React, {useEffect} from "react";

interface TextInputFormWithHookProps {
    control: Control<any, any>, // Comes from the useForm() hook in React-Hook-Form
    name: string // Necessary to identify component from a form in React-Hook-Form
    label: string,
    defaultValue: string,
    errors?: any,
    type?: "password"|"text"|"email",
    fullWidth?: boolean
    onChange?: (value: any) => void // Needed to inform parent component about the Textfield current value
}

export const TextInputFormWithHook = (props: TextInputFormWithHookProps) => {

    // WILL BE USED NEXT, ONCE REFACTOR IS COMPLETED
    // this is needed when updating the amount of forms on screen for adding/editing words
    // we re-populate the list with data from completeWordData
    // useEffect(() => {
    //     if(props.defaultValue !== ""){
    //         if (props.onChange!) { // if added, we share with parent the new value
    //             props.onChange(props.defaultValue)
    //         }
    //     }
    // }, [])

    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            render={({ field, fieldState  }) => (
                <TextField
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
                />
            )}
        />
    );
};