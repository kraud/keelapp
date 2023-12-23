import {CircularProgress, Grid, Typography} from "@mui/material";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import globalTheme from "../../../theme/theme";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import React, {useEffect, useState} from "react";
import {SearchResult, TagData} from "../../../ts/interfaces";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {useDispatch, useSelector} from "react-redux";
import {AutocompleteSearch} from "../../AutocompleteSearch";
import {searchWordByAnyTranslation} from "../../../features/words/wordSlice";

interface TagDataFormProps {
    currentTagData: TagData,
    displayOnly?: boolean,

    updateTagFormData: (tagFormData: TagData) => void,
}

export const TagDataForm = (props: TagDataFormProps) => {

    const dispatch = useDispatch()
    const { currentTagData } = props
    const {isLoadingTags} = useSelector((state: any) => state.tags)
    const {user} = useSelector((state: any) => state.auth)
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)

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
        if(!props.displayOnly){
            props.updateTagFormData({
                _id: currentTagData._id, // if it's a new tag that will be "", if editing an existing tag it will be a real ID
                author: user._id, // if we're editing a Tag, we must be the author of it first
                public: tagPublic as 'Public' | 'Private' | 'Friends-Only',
                label: tagLabel,
                description: tagDescription,
                completionState: isValid,
                isDirty: isDirty
            })
        }
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
                {(props.displayOnly)
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
                    (props.displayOnly) &&
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
                        {/*{((props.currentTagData.wordsId !== undefined))*/}
                        {/*    ? (props.currentTagData.wordsId.length > 1)*/}
                        {/*        ? `${props.currentTagData.wordsId.length} words`*/}
                        {/*        : `${props.currentTagData.wordsId.length} word`*/}
                        {/*    :""*/}
                        {/*}*/}
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
            <Grid
                item={true}
                xs={12}
            >
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
                }
            </Grid>
            {/*
                TODO: modify and add an AutocompleteMultiple/Search for words here.
                    Selected words' ids will be stored inside wordsId property of Tag
            */}
            <Grid
                item={true}
                xs={12}
            >
                <AutocompleteSearch
                    options={searchResults} // filter results that have Ids that are already selected?
                    getOptions={(inputValue: string) => {
                        // @ts-ignore
                        dispatch(searchWordByAnyTranslation(inputValue))
                    }}
                    onSelect={(selection: SearchResult) => {
                        // add selection to a list of selected words that will be displayed under this searchbar
                    }}
                    isSearchLoading={isSearchLoading}
                    textColor={'black'}
                    sxPropsAutocomplete={{
                        backgroundColor: 'gray'
                    }}
                />
            </Grid>
            {/* TODO: small list of selected words here. Updated when  */}
        </Grid>
    )
}