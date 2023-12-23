import {CircularProgress, Grid, Typography} from "@mui/material";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import globalTheme from "../../../theme/theme";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import React, {useEffect, useState} from "react";
import {TagData} from "../../../ts/interfaces";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {useSelector} from "react-redux";

interface TagFormProps {
    currentTagData: TagData,
    displayOnly?: boolean,
}

export const TagDataForm = (props: TagFormProps) => {
    const { currentTagData } = props
    const {currentTagAmountWords, isLoadingTags} = useSelector((state: any) => state.tags)

    const validationSchema = Yup.object().shape({
        public: Yup.string().required("Required")
            .oneOf(['Public', 'Private', 'Friends-Only'], "Required"),
        label: Yup.string()
            .required("A tag label is required"),
        description: Yup.string().nullable()
            .min(5, 'Description must be longer than 2 characters')
            .max(250, 'Description is too long'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm<
        {
            public: 'Public' | 'Private' | 'Friends-Only',
            label: string,
            description: string,
        }
        >({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [tagPublic, setTagPublic] = useState<'Public' | 'Private' | 'Friends-Only'|"">("")

    const [tagLabel, setTagLabel] = useState("")
    const [tagDescription, setTagDescription] = useState("")

    useEffect(() => {
        // TODO: re-evaluate if props.updateTagFormData is needed? Could just use local state and if needed to reset => use props.currenTagData
        // props.updateTagFormData({
        //     author: 'asd',
        //     public: tagPublic as 'Public' | 'Private' | 'Friends-Only',
        //     label: tagLabel,
        //     description: tagDescription,
        //     completionState: isValid,
        //     isDirty: isDirty
        // })
    }, [tagPublic, tagLabel, tagDescription])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if(currentTagData._id!!){
            setValue(
                'public',
                currentTagData.public,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagPublic(currentTagData.public as 'Public' | 'Private' | 'Friends-Only'|"")
            setValue(
                'label',
                currentTagData.label,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagLabel(currentTagData.label)
            setValue(
                'description',
                currentTagData.description,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagDescription(currentTagData.description)
        }
    },[])

    return(
        <Grid
            item={true}
            container={true}
            rowSpacing={2}
        >
            <Grid
                item={true}
                xs={12}
            >
                {(!props.displayOnly)
                    ?
                    <Typography
                        variant={"h3"}
                        display={{
                            md: "inline"
                        }}
                    >
                        {tagLabel}
                    </Typography>
                    :
                    <TextInputFormWithHook
                        control={control}
                        label={"Label"}
                        name={"label"}
                        defaultValue={""}
                        errors={errors.label}
                        onChange={(value: any) => {
                            setTagLabel(value)
                        }}
                        fullWidth={true}
                        disabled={props.displayOnly}
                    />
                    // <TextField
                    //     label={"Label"}
                    //     type={"text"}
                    //     fullWidth={true}
                    //     value={fullTagData.label}
                    //     onChange={(value) => {
                    //         setFullTagData({
                    //                 ...fullTagData,
                    //                 label: value.target.value,
                    //             })
                    //     }}
                    // />
                }
                {/* AMOUNT OF WORDS RELATED TO THIS TAG*/}
                {(isLoadingTags)
                    ?
                    <CircularProgress
                        sx={{
                            marginLeft: {
                                md: globalTheme.spacing(3)
                            }
                        }}
                    />
                    :
                    (!props.displayOnly) &&
                    <Typography
                        variant={"h6"}
                        display={{
                            md: "inline"
                        }}
                        sx={{
                            paddingLeft: {
                                md: globalTheme.spacing(3)
                            }
                        }}
                    >
                        {((fullTagData.wordsId !== undefined))
                            ? (fullTagData.wordsId.length > 1)
                                ? `${fullTagData.wordsId.length} words`
                                : `${fullTagData.wordsId.length} word`
                            :""
                        }
                    </Typography>
                }
            </Grid>
            <Grid
                item={true}
                xs={12}
            >
                <RadioGroupWithHook
                    control={control}
                    label={"Public"}
                    name={"public"}
                    options={['Public', 'Private', 'Friends-Only']}
                    defaultValue={""}
                    errors={errors.public}
                    onChange={(value: any) => {
                        setTagPublic(value)
                    }}
                    fullWidth={false}
                    disabled={props.displayOnly}
                />
            </Grid>
            {(props.displayOnly)
                ?
                <Typography
                    variant={"h6"} // TODO: this should change depending on screen size (styling as well)
                    display={{
                        md: "inline"
                    }}
                >
                    {tagDescription}
                </Typography>
                :
                <TextInputFormWithHook
                    control={control}
                    label={"Description"}
                    name={"description"}
                    defaultValue={""}
                    errors={errors.description}
                    onChange={(value: any) => {
                        setTagDescription(value)
                    }}
                    fullWidth={true}
                    disabled={props.displayOnly}
                />
                // <TextField
                //     label={"Description"}
                //     type={"text"}
                //     multiline
                //     rows={3}
                //     fullWidth={true}
                //     value={fullTagData.description}
                //     onChange={(value) => {
                //         setFullTagData({
                //             ...fullTagData,
                //             description: value.target.value,
                //         })
                //     }}
                // />
            }
            {/* TODO: add search words? */}
        </Grid>
    )
}