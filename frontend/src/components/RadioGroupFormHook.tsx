import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Control, Controller} from "react-hook-form";
import {FormHelperText} from "@mui/material";
import globalTheme from "../theme/theme";

interface RadioGroupHookProps {
    control: Control<any, any>, // Comes from the useForm() hook in React-Hook-Form
    name: string // Necessary to identify component from a form in React-Hook-Form
    label: string,
    options: string[] // TODO: should we have value AND label for each item?
    defaultValue: string,
    errors?: any,
    type?: "password"|"text"|"email",
    fullWidth?: boolean
    onChange?: (value: any) => void // Needed to inform parent component about the Radio Group current value
    disabled?: boolean
}

export const RadioGroupWithHook = (props: RadioGroupHookProps) => {
    const componentStyles = {
        optionPill: {
            borderStyle: "solid",
            borderWidth: "2px",
            borderRadius: '25px',
            borderColor: 'rgb(0, 144, 206)',
            backgroundColor: 'rgb(0, 144, 206)',
            padding: '5px 15px 5px 10px',
            color: 'white',
            fontWeight: '400',
            "span":{
                "&.MuiFormControlLabel-label.Mui-disabled": {
                    color: 'black',
                },
            },
        },
        optionCircle: {
            padding: '0px',
            paddingRight: '5px',
            color: 'white',
            "&.Mui-disabled": {
                color: 'black',
            },
        },
        optionGroup: {
            paddingLeft: globalTheme.spacing(1),
        },
        firstOption: {
            borderRadius: '15px 4px 4px 15px'
        },
        middleOption: {
            borderRadius: '4px'
        },
        lastOption: {
            borderRadius: '4px 15px 15px 4px'
        }
    }

    const getSelectedItem = (selectedValue: string) => {
        const option = props.options.find(option => option === selectedValue)
        return(
            <FormControlLabel
                sx={{
                    ...componentStyles.middleOption,
                    ...componentStyles.optionPill,
                }}
                value={option}
                label={option}
                control={
                    <Radio
                        //@ts-ignore
                        color={'allWhite'}
                        sx={componentStyles.optionCircle}
                        onChange={() => null}
                        disabled={props.disabled}
                    />
                }
            />
        )
    }

    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            render={({ field, fieldState  }) => (
                <>
                    <RadioGroup
                        sx={componentStyles.optionGroup}
                        {...field}
                        row
                        name={props.name}
                    >
                        { (props.disabled!)
                            ?
                            getSelectedItem(field.value)
                            :
                            (props.options).map((option: string, index: number) => {
                                return(
                                    <FormControlLabel
                                        sx={{
                                            ...componentStyles.optionPill,
                                            ...
                                                (index === 0)
                                                    ? componentStyles.firstOption
                                                    : (index === (props.options.length -1))
                                                        ? componentStyles.lastOption
                                                        : componentStyles.middleOption


                                        }}
                                        key={index}
                                        value={option}
                                        label={option}
                                        control={
                                            <Radio
                                                //@ts-ignore
                                                color={'allWhite'}
                                                sx={componentStyles.optionCircle}
                                                onChange={() => {
                                                    if(props.onChange!){
                                                        props.onChange!(option)
                                                    }
                                                }}
                                                disabled={props.disabled}
                                            />
                                        }
                                    />
                                )
                            })
                        }
                    </RadioGroup>
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