import * as React from 'react';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Control, Controller} from "react-hook-form";
import {Checkbox, FormGroup, FormHelperText} from "@mui/material";

export interface CheckboxItemData {
    label: string,
    value: any

}
interface CheckboxGroupWithHookProps {
    control: Control<any, any>, // Comes from the useForm() hook in React-Hook-Form
    name: string // Necessary to identify component from a form in React-Hook-Form
    groupLabel: string,
    options: CheckboxItemData[]
    defaultValue: [],
    errors?: any,
    fullWidth?: boolean
    currentValues?: CheckboxItemData[]
    onChange: (value: CheckboxItemData[]) => void // Needed to inform parent component about the Radio Group current value
    disabled?: boolean
}

export const CheckboxGroupWithHook = (props: CheckboxGroupWithHookProps) => {
    const componentStyles = {
        optionCheckbox: {
        },
    }

    const getSelectedItems = (selectedValue: any[]) => {
        const listOfSelectedValues = (selectedValue).map((item: CheckboxItemData) => {
            return(item.value)
        })
        const selectedOptions = props.options.filter((option: CheckboxItemData) =>  listOfSelectedValues.includes(option.value))
        return(
            (selectedOptions).map((selectedOption) => {
                return(
                    <FormControlLabel
                        sx={{}}
                        value={selectedOption.value}
                        label={selectedOption.label}
                        checked={true}
                        control={
                            <Checkbox
                                sx={componentStyles.optionCheckbox}
                                onChange={() => null}
                                disabled={props.disabled}
                            />
                        }
                    />
                )
            })
        )
    }

    return (
        <FormGroup
            sx={{}}
            row
            // name={props.name}
        >
            <Controller
                name={props.name}
                control={props.control}
                defaultValue={props.defaultValue}
                render={({ field, fieldState  }) => (
                    <>
                        {
                            (props.disabled!)
                            ?
                            getSelectedItems(field.value)
                            :
                            (props.options).map((option: CheckboxItemData, index: number) => {
                                return(
                                    <FormControlLabel
                                        checked={
                                            (field.value).map((item: CheckboxItemData) => {
                                                return(item.value)
                                            }).includes(option.value)
                                        }
                                        sx={{}}
                                        key={index}
                                        value={option.value}
                                        label={option.label}
                                        control={
                                            <Checkbox
                                                sx={componentStyles.optionCheckbox}
                                                onChange={() =>  {
                                                    const listOfSelectedValues = (field.value).map((item: CheckboxItemData) => {
                                                        return(item.value)
                                                    })
                                                    if (!(listOfSelectedValues).includes(option.value)) {
                                                        field.onChange([...field.value, option])
                                                        props.onChange([...field.value, option])
                                                        return
                                                    }
                                                    const newTopics = field.value.filter((selectedValue: any) => {
                                                        return((selectedValue.value) !== option.value)
                                                    })
                                                    field.onChange(newTopics)
                                                    props.onChange(newTopics)
                                                }}
                                                disabled={props.disabled}
                                            />
                                        }
                                    />
                                )
                            })
                        }
                        <FormHelperText
                            error={!!props.errors}
                        >
                        {fieldState.error?.message}
                        </FormHelperText>
                    </>
                )}
            />
        </FormGroup>
    );
};