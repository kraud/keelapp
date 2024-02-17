import {Chip, CircularProgress, Grid, Typography} from "@mui/material";
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
import {CountryFlag} from "../../GeneralUseComponents";
import {Lang} from "../../../ts/enums";
import {useNavigate} from "react-router-dom";
import {getUserById, resetUserSliceState} from "../../../features/users/userSlice";
import LinearIndeterminate from "../../Spinner";

interface TagDataFormProps {
    currentTagData: TagData,
    displayOnly?: boolean,

    updateTagFormData: (tagFormData: TagData) => void,
}

export const TagDataForm = (props: TagDataFormProps) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isLoadingTags} = useSelector((state: any) => state.tags)
    const {user} = useSelector((state: any) => state.auth)
    const {userResult, isLoadingUser} = useSelector((state: any) => state.user)
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)

    const validationSchema = Yup.object().shape({
        public: Yup.string().required("Required")
            .oneOf(['Public', 'Private', 'Friends-Only'], "Required"),
        label: Yup.string()// TODO: make it so it MUST be a single word?
            .required("A tag label is required")
            .min(2, 'Label must be longer than 2 characters')
            .max(30, 'Label is too long'),
        description: Yup.string().nullable()
            .min(5, 'Description must be longer than 5 characters')
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
    // TODO: change from SearchResult to TagData?
    const [selectedWords, setSelectedWords] = useState<SearchResult[]>([]) // will always be 'type: "word"'

    useEffect(() => {
        if(!props.displayOnly){
            props.updateTagFormData({
                _id: props.currentTagData._id, // if it's a new tag that will be "", if editing an existing tag it will be a real ID
                author: user._id, // if we're editing a Tag, we must be the author of it first
                public: tagPublic as 'Public' | 'Private' | 'Friends-Only',
                label: tagLabel,
                description: tagDescription,
                // TODO: add selectedWords ids here as 'wordsId'
                wordsId: selectedWords.map((word: SearchResult) => {
                    if(word.type == 'word'){
                        // TODO: this should be WordData
                        //  => each SearchResult type=word should have its full word data included?
                        return word
                    }
                }),
                //  => must decide how to display the list later (in which language? clarify amount of translations available for each?)

                completionState: isValid,
                isDirty: isDirty
            })
        }
    }, [tagPublic, tagLabel, tagDescription, isValid, isDirty, selectedWords])

    // This will only be run on first render
    // we use it to populate the form fields with the previously added information
    useEffect(() => {
        if((props.currentTagData!!) && (props.currentTagData._id!!)){
            setValue(
                'public',
                props.currentTagData.public,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagPublic(props.currentTagData.public as 'Public' | 'Private' | 'Friends-Only'|"")
            setValue(
                'label',
                props.currentTagData.label,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagLabel(props.currentTagData.label)
            setValue(
                'description',
                props.currentTagData.description,
                {
                    shouldValidate: true,
                    shouldTouch: true
                }
            )
            setTagDescription(props.currentTagData.description)

            // TODO: add update to list of related-words state here

            if((props.currentTagData.author !== user._id)){
                // @ts-ignore
                dispatch(getUserById(props.currentTagData.author))
            } else {
                dispatch(resetUserSliceState())
            }
        }
    },[props.currentTagData]) // TODO: check if this is ok? It was not working with only []

    const handleDeleteWordFromList = (wordIndex: number) => {
        setSelectedWords(
            selectedWords.filter((word: SearchResult, selectedIndex: number) => {
                return(wordIndex !== selectedIndex)
            })
        )
    }

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
            {(props.displayOnly) &&
                <Grid
                    item={true}
                    xs={12}
                >
                    {
                        (isLoadingUser)
                            ?
                            <LinearIndeterminate/>
                            :
                            (
                                (
                                    (userResult !== undefined)
                                    ||
                                    (props.currentTagData.author === user._id)
                                ) &&
                                <Typography
                                    variant={"h6"}
                                    display={{
                                        md: "inline"
                                    }}
                                >
                                    {
                                        (props.currentTagData.author === user._id)
                                            ? 'Created by you'
                                            : `Created by: ${userResult.username}`
                                    }
                                </Typography>
                            )
                    }
                </Grid>
            }
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
            {!(props.displayOnly) &&
                <Grid
                    item={true}
                    xs={12}
                >
                    <AutocompleteSearch
                        // TODO. OPTION 2: filter selected words by id
                        options={searchResults} // filter results that have Ids that are already selected?
                        getOptions={(inputValue: string) => {
                            // @ts-ignore
                            dispatch(searchWordByAnyTranslation(inputValue))
                        }}
                        onSelect={(selectedWordItem: SearchResult) => {
                            // TODO. OPTION 1: check that item is not already selected
                            // add selection to a list of selected words that will be displayed under this searchbar
                            setSelectedWords((prevSelectedWordsState: SearchResult[]) => (
                                [...prevSelectedWordsState, selectedWordItem]
                            ))
                        }}
                        isSearchLoading={isSearchLoading}
                        textColor={'black'}
                        sxPropsAutocomplete={{
                            backgroundColor: 'gray'
                        }}
                    />
                </Grid>
            }
            {/* LIST OF WORDS RELATED TO THIS TAG */}
            <Grid
                container={true}
                item={true}
                xs={12}
            >
                {(selectedWords.map((selectedWordItem: SearchResult, index: number) => {
                    return (
                        <Grid
                            item={true}
                            key={index.toString() + '-' + selectedWordItem}
                        >
                            <Chip
                                variant="filled"
                                label={selectedWordItem.label}// TODO: display a default string? On what language? Look into global variable?
                                color={"info"}
                                sx={{
                                    maxWidth: "max-content",
                                }}
                                onClick={() => {
                                    navigate(`/word/${selectedWordItem.id}`)
                                }}
                                onDelete={() => {
                                    handleDeleteWordFromList(index)
                                }}
                                size={"medium"}
                                icon={
                                    <CountryFlag
                                        country={
                                        (selectedWordItem.type === 'word')
                                            ? selectedWordItem.language
                                            : Lang.EE // random other?
                                    }
                                        border={true}
                                        sxProps={{
                                            marginLeft: globalTheme.spacing(2)
                                        }}
                                    />
                                }
                            />
                        </Grid>
                    )
                }))}
            </Grid>
        </Grid>
    )
}