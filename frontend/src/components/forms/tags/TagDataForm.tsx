import {Chip, CircularProgress, Grid, Typography} from "@mui/material";
import {TextInputFormWithHook} from "../../TextInputFormHook";
import globalTheme from "../../../theme/theme";
import {RadioGroupWithHook} from "../../RadioGroupFormHook";
import React, {useEffect, useState} from "react";
import {SearchResult, TagData, TranslationItem, WordDataBE} from "../../../ts/interfaces";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {useDispatch, useSelector} from "react-redux";
import {AutocompleteSearch} from "../../AutocompleteSearch";
import {searchWordByAnyTranslation} from "../../../features/words/wordSlice";
import {Lang} from "../../../ts/enums";
import {useNavigate} from "react-router-dom";
import {getUserById, resetUserSliceState} from "../../../features/users/userSlice";
import LinearIndeterminate from "../../Spinner";
import {getWordChipDataByLangInOrder} from "../../generalUseFunctions";
import {CountryFlag} from "../../GeneralUseComponents";
import {getPartOfSpeechAbbreviated} from "../commonFunctions";
import tagService from "../../../features/tags/tagService";
import {toast} from "react-toastify";

interface TagDataFormProps {
    currentTagData: TagData,
    displayOnly?: boolean,

    updateTagFormData: (tagFormData: TagData) => void,
}

export const TagDataForm = (props: TagDataFormProps) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isLoadingTags, tagLabelIsAlreadyInUse} = useSelector((state: any) => state.tags)
    const {user} = useSelector((state: any) => state.auth)
    const {userResult, isLoadingUser} = useSelector((state: any) => state.user)
    const {searchResults, isSearchLoading} = useSelector((state: any) => state.words)

    // TODO: see if we can use the redux-method for requests as part of validation, instead of sending request directly?
    // function checkLabelAvailabilityRedux(label: string){
    //     //@ts-ignore
    //     dispatch(checkIfTagLabelIsAvailable({tagLabel: label, userId: user._id}))
    //     return(tagLabelIsAlreadyInUse)
    // }

    async function checkLabelAvailability(label: string){
        if(label.length > 2){
            try{
                return(await tagService.checkIfTagLabelAvailable({tagLabel: label, userId: user._id}, user.token))
            } catch(error){
                toast.error('There was an error while processing that label.')
            }
        } else { return true }
    }

    //@ts-ignore
    let delayTimer: any = null
    let isOk: boolean = false
    //@ts-ignore
    let resolveRef: any = null

    const validationSchema = Yup.object().shape({
        public: Yup.string().required("Required")
            .oneOf(['Public', 'Private', 'Friends-Only'], "Required"),
        label: Yup.string()
            .required("A tag label is required")
            .matches(/^\S+$/, "Label does not allow spaces. Try CamelCasing or snake_casing instead.")
            .min(3, 'Label must be longer than 2 characters')
            .max(30, 'Label is too long')
            .test({
                name: 'checkIfLabelIsUniqueForThisUser',
                message: 'That label is already in use',
                test: async (labelCandidate: string) => {
                    const tagLabelStatus = await checkLabelAvailability(labelCandidate)
                    // logic can be simplified, but this is easier to read.
                    if(
                        !tagLabelStatus.isAvailable &&  // if there is a tag with this label
                        (tagLabelStatus.tagId !== props.currentTagData._id) // and it is not the current tag
                    ){
                        return false // then the label is being used by another tag
                    } else {
                        return true // else, the label is not being used OR we're currently editing the tag with that label
                    }
                }
            }),
            // TODO: find a way to include a timer, so we don't make a request after every keystroke.
            // .test(
            //     'checkIfLabelIsUniqueForThisUser',
            //     'That label is already in use',
            //     //@ts-ignore
            //     async (label: string) => {
            //         clearTimeout(delayTimer)
            //
            //         if (resolveRef) {
            //             resolveRef(isOk)
            //             resolveRef = null
            //         }
            //
            //         return await new Promise((resolve) => {
            //             resolveRef = resolve;
            //             delayTimer = setTimeout(async () => {
            //                 isOk = await checkLabelAvailability(label)
            //
            //                 resolve(isOk)
            //                 resolveRef = null;
            //             }, 2500)
            //         })
            //     }
            // ),
        description: Yup.string().nullable()
            .min(5, 'Description must be longer than 5 characters')
            .max(250, 'Description is too long'),
    })

    const {
        control, formState: { errors, isValid, isDirty }, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all", // Triggers validation/errors without having to submit
    })

    const [tagPublic, setTagPublic] = useState<'Public' | 'Private' | 'Friends-Only'|"">("")

    const [tagLabel, setTagLabel] = useState("")
    const [tagDescription, setTagDescription] = useState("")
    const [selectedWords, setSelectedWords] = useState<WordDataBE[]>([]) // will always be 'type: "word"'

    useEffect(() => {
        if(!props.displayOnly){
            props.updateTagFormData({
                _id: props.currentTagData._id, // if it's a new tag that will be "", if editing an existing tag it will be a real ID
                author: user._id, // if we're editing a Tag, we must be the author of it first
                public: tagPublic as 'Public' | 'Private' | 'Friends-Only',
                label: tagLabel,
                description: tagDescription,
                //  => must decide how to display the list later (in which language? clarify amount of translations available for each?)
                words: selectedWords,

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
            if(props.currentTagData.words !== undefined){
                setSelectedWords(props.currentTagData.words)
            }
            // when the author of the tag is not the current user => we get username from BE
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
            selectedWords.filter((word: WordDataBE, selectedIndex: number) => {
                return(wordIndex !== selectedIndex)
            })
        )
    }

    const filterAlreadySelectedOptions = (rawOptions: SearchResult[], selectedOptions: WordDataBE[]) => {
        const selectedOptionsIds = selectedOptions.map((selectedOption: WordDataBE) => {
            //@ts-ignore
            return(selectedOption._id) // TODO: LOOK INTO WordDataBE and fix '_id' and 'id' issues
        })
        let filteredOptions: SearchResult[] = []
        rawOptions.forEach((option: SearchResult) => {
            if(
                (option.type === 'word') &&
                !(selectedOptionsIds.includes(option.id)) // option is not selected
            ){
                filteredOptions.push(option)
            }
        })
        return(filteredOptions)
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
                        {(
                            (props.currentTagData.words !== undefined) &&
                            (props.currentTagData.words.length > 0)
                        )
                            ? (props.currentTagData.words.length > 1)
                                ? `${props.currentTagData.words.length} words`
                                : `${props.currentTagData.words.length} word`
                            :"- no words assigned yet -"
                        }
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
                                // TODO: add data about amount of people that follow this tag
                            )
                    }
                </Grid>
            }
            {/* TODO: when copying, we should save somewhere the original author of the tag, and display it here as well */}
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
                        options={filterAlreadySelectedOptions(searchResults, selectedWords)} // filter results that have Ids that are already selected
                        getOptions={(inputValue: string) => {
                            // @ts-ignore
                            dispatch(searchWordByAnyTranslation(inputValue))
                        }}
                        onSelect={(selectedWordItem: SearchResult) => {
                            // add selection to a list of selected words that will be displayed under this searchbar
                            if(selectedWordItem.type === 'word'){
                                setSelectedWords((prevSelectedWordsState: WordDataBE[]) => (
                                    [...prevSelectedWordsState, selectedWordItem.completeWordInfo as WordDataBE]
                                ))
                            }
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
                {/* TODO: review if it is possible to refactor/replace with ChipList component */}
                {(selectedWords.map((selectedWordItem: WordDataBE, index: number) => {
                    // TranslationItem + displayLabel
                    type WordChipDisplayData = {
                        displayLabel: string,
                        wordId: string,
                    } & (TranslationItem)

                    const wordDataToDisplay: WordChipDisplayData = getWordChipDataByLangInOrder(selectedWordItem, user.languages) as WordChipDisplayData
                    return (
                        <Grid
                            item={true}
                            key={index.toString() + '-' + selectedWordItem}
                        >
                            <Chip
                                variant="filled"
                                label={
                                    <>
                                        {wordDataToDisplay.displayLabel}
                                        <Typography
                                            variant={'body2'}
                                            color={'AllWhite'}
                                            alignSelf={"left"}
                                            sx={{
                                                display: 'inline',
                                                paddingLeft: globalTheme.spacing(1),
                                            }}
                                        >
                                             ({getPartOfSpeechAbbreviated(selectedWordItem.partOfSpeech)})
                                        </Typography>
                                    </>
                                }
                                color={"info"}
                                sx={{
                                    maxWidth: "max-content",
                                    "& .MuiChip-deleteIcon": {
                                        display: props.displayOnly ?'none' :'inherit'
                                    },
                                }}
                                onClick={() => {
                                    navigate(`/word/${wordDataToDisplay.wordId}`)
                                }}
                                onDelete={() => {
                                    if(!(props.displayOnly)){
                                        handleDeleteWordFromList(index)
                                    }
                                }}
                                size={"medium"}
                                icon={<>
                                    <CountryFlag
                                        country={wordDataToDisplay.language}
                                        border={true}
                                        sxProps={{
                                            marginLeft: globalTheme.spacing(2)
                                        }}
                                    />
                                </>}
                            />
                        </Grid>
                    )
                }))}
            </Grid>
        </Grid>
    )
}