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
    options: string[] // TODO: should we have value AND label for each item?1
    defaultValue: string,
    errors?: any,
    type?: "password"|"text"|"email",
    fullWidth?: boolean
    onChange?: (value: any) => void // Needed to inform parent component about the Radio Group current value
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
        },
        optionCircle: {
            padding: '0px',
            paddingRight: '5px',
            color: 'white',
        },
        optionGroup: {
            paddingLeft: globalTheme.spacing(1),
        },
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
                        {
                            (props.options).map((option: string, index: number) => {
                                return(
                                    <FormControlLabel
                                        sx={componentStyles.optionPill}
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