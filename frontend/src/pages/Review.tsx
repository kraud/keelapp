import {Button, Grid, Modal, Slide, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import globalTheme from "../theme/theme";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {deleteManyWordsById, getWordsSimplified} from "../features/words/wordSlice";
import {DnDLanguageOrderSelector} from "../components/DnDLanguageOrderSelector";
import {Lang, NounCases, PartOfSpeech} from "../ts/enums";
import {TranslationsTable} from "../components/table/TranslationsTable";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {TableFilters} from "../components/TableFilters";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {AutocompleteMultiple} from "../components/AutocompleteMultiple";
import {createColumnsReviewTable} from "../components/table/columns/ReviewTableColumns";
import {FilterItem, TagData} from "../ts/interfaces";
import {
    extractTagsArrayFromUnknownFormat,
    getAllIndividualTagDataFromFilterItem, getIntersectionBetweenLists, getPoSKeyByLabel
} from "../components/generalUseFunctions";
import {applyNewTagToSelectedWordsById, getTagById} from "../features/tags/tagSlice";
import Box from "@mui/material/Box";
import LinearIndeterminate from "../components/Spinner";
import {AppDispatch} from "../app/store";
import {useTranslation} from "react-i18next";
import {setWordsSelectedForExercises} from "../features/exercises/exerciseSlice";

export function Review(){
    const componentStyles = {
        mainContainer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(80vw, max-content)',
            background: 'white',
            border: '4px solid #0072CE',
            borderRadius: '25px',
            padding: globalTheme.spacing(3),
            boxShadow: 24,
        },
        text: {
            // cursor: (! props.onlyForDisplay!) ?"pointer" : "default",
        }
    }
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation(['review', 'common'])
    const {user} = useSelector((state: any) => state.auth)
    // Languages currently displayed as columns on the table
    const [allSelectedLanguages, setAllSelectedLanguages] = useState<string[]>(user.languages)
    // Languages currently not displayed as columns on the table
    const [otherLanguages, setOtherLanguages] = useState<string[]>([])
    const [displayFilers, setDisplayFilers] = useState(true)
    const [finishedDeleting, setFinishedDeleting] = useState(true)
    const [openAssignTagModal, setOpenAssignTagModal] = useState(false)
    const [selectedRowsForBulkTagAssign, setSelectedRowsForBulkTagAssign] = useState<string[]>([])
    const [selectedTagsData, setSelectedTagsData] = useState<TagData[]>([])
    const [isAddingTags, setIsAddingTags] = useState(false)

    const {wordsSimple, isLoading, isError, message} = useSelector((state: any) => state.words)
    const {fullTagData, isLoadingTags, isSuccessTags} = useSelector((state: any) => state.tags)
    // @ts-ignore
    const { filtersURL } = useParams<RouterWordProps>()
    let [searchParams, setSearchParams]  = useSearchParams();

    useEffect(() => {
        if(isError){
            toast.error(t('errors.somethingWrong', { error: message,  ns: 'common' }))
        }
        if(!user){
            navigate('/login')
        }
    }, [user, navigate, isError, message, dispatch])

    useEffect(() => {
        //@ts-ignore
        let {size} = searchParams
        if(size !== 0){
            if(searchParams.getAll("tags").length > 0){
                // TODO: create function so if multiple tagsId exist in URL,
                //  it sets all of them as parameters at once
                dispatch(getTagById(searchParams.getAll("tags")[0]))
                setCurrentTagFilters([{
                    type: 'tag',
                    _id: "tag-"+((searchParams.getAll("tags")).length),
                    filterValue: 'Placeholder-value. Check restrictiveArray.',
                    restrictiveArray: searchParams.getAll("tags").map((param) => {
                        return({
                            _id: param // this is the only data we currently have for this tag, we'll trigger simpleSearch with this
                        })
                    }),
                } as FilterItem])
            }
        }
        else {
            //@ts-ignore
            dispatch(getWordsSimplified())
        }
    }, [])

    useEffect(() => {
        // when we hide the filters, we request the filter-less results for the table
        if(!displayFilers){
            //@ts-ignore
            dispatch(getWordsSimplified())
        }
    }, [displayFilers])

    useEffect(() => {
        // if after updating fullTagData, the corresponding id matches the one from URL => we update currentTagFilters
        if((fullTagData!!) && ((searchParams.getAll("tags"))[0] === fullTagData._id)){
            setCurrentTagFilters((previousState) => [{
                ...previousState[0],
                restrictiveArray: [fullTagData],
            }])
        }
    }, [fullTagData])

    // allows column dragging from table to work with DnDLanguageSelector
    const changeLanguageOrderFromTable = (newList: string[]) => {
        const updatedOrderList = (newList.slice(2)).slice(0, -1). // we start at 2, since 0 it's always the select checkbox and 1 is the "type" column. -1 to remove Tags (last column)
            map((language: string) => {
                // @ts-ignore
                return(Lang[language.slice(-2)]) // we need the LAST 2 letters, to identify the language
            })
        setAllSelectedLanguages(updatedOrderList)
    }

    const genderFilters: FilterItem[] = [
        {
            _id: 'CaseGenderMaleDE',
            type: 'gender',
            filterValue: 'der',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            _id: 'CaseGenderFemaleDE',
            type: 'gender',
            filterValue: 'die',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            _id: 'CaseGenderNeutralDE',
            type: 'gender',
            filterValue: 'das',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            _id: 'CaseGenderMaleES',
            type: 'gender',
            filterValue: 'el',
            caseName: NounCases.genderES,
            language: Lang.ES,
        },
        {
            _id: 'CaseGenderFemaleES',
            type: 'gender',
            filterValue: 'la',
            caseName: NounCases.genderES,
            language: Lang.ES,
        }
    ]
    const PoSFilters: FilterItem[] = [
        {
            _id: 'PoSNoun',
            type: 'PoS',
            filterValue: 'Noun',
            partOfSpeech: PartOfSpeech.noun,
        },
        {
            _id: 'PoSAdverb',
            type: 'PoS',
            filterValue: 'Adverb',
            partOfSpeech: PartOfSpeech.adverb,
        },
        {
            _id: 'PoSAdjective',
            type: 'PoS',
            filterValue: 'Adjective',
            partOfSpeech: PartOfSpeech.adjective,
        },
        {
            _id: 'PoSVerb',
            type: 'PoS',
            filterValue: 'Verb',
            partOfSpeech: PartOfSpeech.verb,
        },
    ]

    const [currentTagFilters, setCurrentTagFilters] = useState<FilterItem[]>([])
    const [currentGenderFilters, setCurrentGenderFilters] = useState<FilterItem[]>([])
    const [currentPoSFilters, setCurrentPoSFilters] = useState<FilterItem[]>([])

    // we only send required information to filter.
    // if we send all the info about the tag as parameters in URL => exceeds limit and triggers error in request
    const reduceFullTagData = (tagFilters: FilterItem[]) => {
        const response = tagFilters.map((tagFilter: FilterItem) => {
            return({
                ...tagFilter,
                restrictiveArray: ((tagFilter.type === 'tag') &&(tagFilter.restrictiveArray !== undefined))
                    ? (tagFilter.restrictiveArray).map((item: TagData) => {
                        return({_id: item._id} as TagData)
                    })
                    : []
            })
        })
        return(response)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(getWordsSimplified([
                ...currentPoSFilters,
                ...currentGenderFilters,
                ...reduceFullTagData(currentTagFilters),
                ]))
        }, 10)

        return () => clearTimeout(timeout)
    }, [currentPoSFilters, currentGenderFilters, currentTagFilters])

    const goToDetailedView = (rowSelection: any) => {
        // rowSelection format:
        // { selectedRowIndex: true }
        if(Object.keys(rowSelection).length > 0){
            // TODO: CHANGE TO saving the row info instead of index
            // @ts-ignore
            navigate(`/word/${wordsSimple.words[parseInt(Object.keys(rowSelection)[0])].id}`)
        }
    }
    // TODO: should we change it to saving the row info instead?
    const getWordsIdFromRowSelection = (rowSelection: unknown) => {
        let wordIds: string[] = []
        // @ts-ignore
        Object.keys(rowSelection).forEach((selectionDataIndex: string) => {
            wordIds.push(wordsSimple.words[parseInt(selectionDataIndex)].id)
        })
        return(wordIds)
    }
    // TODO: should we change it to saving the row info instead?
    const getWordsDataFromRowSelection = (rowSelection: unknown) => {
        let selectedWordsData: any[] = [] // simple-word
        // @ts-ignore
        Object.keys(rowSelection).forEach((selectionDataIndex: string) => {
            selectedWordsData.push(wordsSimple.words[parseInt(selectionDataIndex)])
        })
        return(selectedWordsData)
    }

    const deleteSelectedRows = (rowSelection: unknown) => {
        dispatch(deleteManyWordsById(getWordsIdFromRowSelection(rowSelection)))
        setFinishedDeleting(false)
    }

    const onRowSelectionApplyNewTags = (rowSelection: string[]) => {
        setIsAddingTags(true)
        const selectedTagsId = selectedTagsData.map((tag: TagData) => {
            return(tag._id)
        })
        // @ts-ignore
        dispatch(applyNewTagToSelectedWordsById({selectedWords: rowSelection, newTagsToApply: selectedTagsId}))
    }

    useEffect(() => {
        // isLoading switches back to false once the response from backend is set on redux
        // finishedDeleting will only be false while waiting for a response from backend
        if(!finishedDeleting && !isLoading){
            // closeModal
            toast.success(t('toastMessages.wordDeleted', { error: message,  ns: 'review' }), {
                toastId: "click-on-modal"
            })
            // we reverse to the original state, before sending data to update
            setFinishedDeleting(true)
            //@ts-ignore
            dispatch(getWordsSimplified()) // to update the list of words displayed on the table
        }
    }, [isLoading, finishedDeleting])

    useEffect(() => {
        if(isAddingTags && !isLoadingTags && isSuccessTags){
            // closeModal
            toast.success(t('toastMessages.tagAddedToWords', { error: message,  ns: 'review' }))
            handleOnModalClose()
            //@ts-ignore
            dispatch(getWordsSimplified()) // to update the list of words displayed on the table
        }
    }, [isLoadingTags, isSuccessTags])

    const handleOnModalClose = () => {
        setOpenAssignTagModal(false)
        setSelectedTagsData([])
        setSelectedRowsForBulkTagAssign([])
    }

    // if the words we get from getSimplifiedWords does not have at least one translation in any of the currently selected languages,
    // we don't display that row.
    // TODO: we could add a toggle for this in the future, which we only display IF at least one row is hidden
    const filterWordsWithNoMatchesWithLanguageList = (rawListOfWords: any[]) => {
        let filteredList: any[] = []
        if(rawListOfWords!!){
            rawListOfWords.forEach((simpleWordRaw) => {
                if(getIntersectionBetweenLists(simpleWordRaw.storedLanguages, user.languages).length > 0 ){
                    filteredList.push(simpleWordRaw)
                }
            })
        }
        return(filteredList)
    }

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            justifyContent={(displayFilers) ?'space-around' :"flex-start"}
            alignItems={"start"}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
        >
            {/*
                TODO: refactor later into single table component with DnD language selector included
                 & add frame, pagination, filters, toggles for extra data, etc.
            */}
            <Grid
                container={true}
                item={true}
                sx={{
                    overflow: 'hidden',
                    background: '#c7c7c7',
                    padding: globalTheme.spacing(2),
                    marginBottom: globalTheme.spacing(1),
                    border: '1px solid black',
                    borderRadius: '25px',
                    width: 'max-content',
                    height: 'max-content',
                }}
                xs={12}
                lg={displayFilers ?3 :"auto"}
            >
                {/* Show/hide filter button */}
                <Grid
                    container={true}
                    item={true}
                    onClick={() => setDisplayFilers(!displayFilers)}
                    sx={{
                        cursor: 'pointer',
                        width: 'max-content',
                        marginLeft: '-17px',
                        marginTop: '-17px',
                        marginBottom: displayFilers ? globalTheme.spacing(1) :'-10px',
                        paddingTop: '10px',
                        paddingLeft: '15px',
                        paddingRight: '20px',
                        background: 'white',
                        borderRadius: '0 0 15px 0',
                        borderBottom: '1px solid black',
                        borderRight: '1px solid black',
                        height: 'max-content',
                    }}
                >
                    <Grid
                        item={true}
                    >
                        {(displayFilers)
                            ?
                            <KeyboardDoubleArrowUpIcon
                                sx={{
                                    color: 'green',
                                    fontSize: '25px',
                                }}
                            />
                            :
                            <KeyboardDoubleArrowDownIcon
                                sx={{
                                    color: 'green',
                                    fontSize: '25px',
                                }}
                            />
                        }
                    </Grid>
                    <Grid
                        item={true}
                    >
                        <Typography
                            variant={"subtitle1"}
                            color={"secondary"}
                        >
                            {(displayFilers)
                                ? t('buttons.hideFilters', { ns: 'common' })
                                : t('buttons.showFilters', { ns: 'common' })
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Slide
                    direction="down"
                    in={displayFilers}
                    mountOnEnter
                    unmountOnExit
                >
                     <Grid
                        item={true}
                        container={true}
                        direction={"column"}
                        alignItems={"center"}
                        rowSpacing={2}
                    >
                        <Grid
                            item={true}
                            container={true}
                            justifyContent={"center"}
                        >
                            <DnDLanguageOrderSelector
                                allSelectedItems={allSelectedLanguages}
                                setAllSelectedItems={(languages: string[]) => setAllSelectedLanguages(languages)}
                                otherItems={otherLanguages}
                                setOtherItems={(languages: string[]) => setOtherLanguages(languages)}
                                direction={"horizontal"}
                                selectedItemsTitle={t('fieldLabels.activeLanguages', { ns: 'review' })}
                                otherItemsTitle={t('fieldLabels.hiddenLanguages', { ns: 'review' })}
                            />
                        </Grid>
                        <Grid
                            item={true}
                            container={true}
                            justifyContent={"center"}
                            spacing={1}
                        >
                            <Grid
                                item={true}
                                xs={12}
                                sx={{
                                    marginX: globalTheme.spacing(1)
                                }}
                            >
                                <TableFilters
                                    filterOptions={genderFilters}
                                    applyFilters={(filters) => {
                                        setCurrentGenderFilters(filters)
                                    }}
                                />
                            </Grid>
                            <Grid
                                item={true}
                                xs={12}
                                sx={{
                                    marginX: globalTheme.spacing(1)
                                }}
                            >
                                <TableFilters
                                    filterOptions={PoSFilters}
                                    applyFilters={(filters) => {
                                        setCurrentPoSFilters(filters)
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            item={true}
                            container={true}
                            justifyContent={"center"}
                        >
                            <Grid
                                item={true}
                                xs={12}
                                sx={{
                                    marginX: globalTheme.spacing(1)
                                }}
                            >
                                <AutocompleteMultiple
                                    type={'tag'}
                                    values={getAllIndividualTagDataFromFilterItem(currentTagFilters)}
                                    saveResults={(results: FilterItem[]) => {
                                        setCurrentTagFilters(results)
                                    }}
                                    matchAll={true} // TODO: should be turned back to false
                                    limitTags={3}
                                    allowNewOptions={false}
                                    forceLoadingState={isLoadingTags}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Slide>
            </Grid>
            {/* TABLE */}
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
                xs={12}
                lg={(displayFilers) ?9 : "auto"}
                sx={{
                    paddingLeft: {
                        xs: 0,
                        lg: globalTheme.spacing(2),
                    }
                }}
            >
                <TranslationsTable
                    rowDataIsLoading={isLoading}
                    displayGlobalSearch={true}
                    sortedAndSelectedLanguages={allSelectedLanguages}
                    rowData={filterWordsWithNoMatchesWithLanguageList(wordsSimple.words)}
                    calculateColumns={(displayGender: boolean) => {
                        return(createColumnsReviewTable(
                            allSelectedLanguages,
                            displayGender,
                            user,
                            (partOfSpeech: string) => {
                                return(
                                    t(`partOfSpeech.${getPoSKeyByLabel(partOfSpeech as PartOfSpeech)}`, { ns: 'common' })
                                )
                            }
                        ))
                    }}
                    partsOfSpeech={wordsSimple.partsOfSpeechIncluded}
                    setOrderColumns={(languages: string[]) => changeLanguageOrderFromTable(languages)}
                    customButtonList={[
                        {
                            id: "create-exercises",
                            variant: "outlined",
                            color: "secondary",
                            disabled: false,
                            label: t('buttons.createExercises', { ns: 'common' }),
                            onClick: (rowSelection: any) => {
                                //@ts-ignore
                                dispatch(setWordsSelectedForExercises(getWordsDataFromRowSelection(rowSelection)))
                                navigate('/practice')
                            },
                            displayBySelectionAmount: (amountSelected: number) => {
                                return (amountSelected > 2)
                            },
                        },
                        {
                            id: "detailed-view",
                            variant: "outlined",
                            color: "secondary",
                            disabled: false,
                            label: t('buttons.detailedView', { ns: 'common' }),
                            onClick: (rowSelection: any) => goToDetailedView(rowSelection),
                            displayBySelectionAmount: (amountSelected: number) => {
                                return (amountSelected === 1)
                            },
                        },
                        {
                            id: "assign-tag",
                            variant: "outlined",
                            color: "secondary",
                            disabled: false,
                            label: t('buttons.assignTag', { ns: 'common' }), //
                            onClick: (rowSelection: any) => {
                                setOpenAssignTagModal(true)
                                setSelectedRowsForBulkTagAssign(getWordsIdFromRowSelection(rowSelection))
                            },
                            displayBySelectionAmount: (amountSelected: number) => {
                                // TODO: check if row selected-words are all owned by the current user (can't assign Tag to a followed word)
                                return (amountSelected > 0)
                            },
                        },
                        {
                            id: "delete-selected",
                            variant: "outlined",
                            color: "error",
                            disabled: false,
                            label: t('buttons.deleteSelected', { ns: 'common' }),
                            setSelectionOnClick: true, //
                            onClick: (rowSelection: any) => {
                                deleteSelectedRows(rowSelection)
                                // setSelectionOnClick is true => we must return value that will be set as rowSelection
                                return({}) // TODO: fix row selection data in TranslationTable => change unknown to unknown[] ? // now to reset set {}
                            },
                            displayBySelectionAmount: (amountSelected: number) => {
                                return (amountSelected > 0)
                            },
                            requiresConfirmation: true,
                            confirmationButtonLabel: t('buttons.confirm', { ns: 'common' }),
                        }
                    ]}
                />
            </Grid>
            {/*
                TODO: should it be refactored into separate generic-modal-component?
                 Also used in ExtraTableComponents' TableDataCell modal
            */}
            {(openAssignTagModal) &&
                <Modal
                    open={openAssignTagModal}
                    onClose={() => handleOnModalClose()}
                    disableAutoFocus={true}
                >
                    <Box
                        sx={componentStyles.mainContainer}
                    >
                        <Grid
                            item={true}
                            container={true}
                            direction={"column"}
                        >
                            <Grid
                                item={true}
                                container={true}
                                justifyContent={"flex-end"}
                                spacing={2}
                                sx={{
                                    marginBottom: globalTheme.spacing(2)
                                }}
                                xs={"auto"}
                            >
                                {/* Part of speech TITLE */}
                                <Grid
                                    container={true}
                                    item={true}
                                    alignContent={"center"}
                                    xs
                                >

                                    <Typography
                                        variant={"h4"}
                                    >
                                        {t('buttons.assignTag', { ns: 'common' })}
                                    </Typography>

                                    {(isLoadingTags) && <LinearIndeterminate/>}
                                </Grid>
                                <Grid
                                    item={true}
                                >
                                    <Button
                                        variant={"outlined"}
                                        color={"error"}
                                        onClick={() => handleOnModalClose()}
                                    >
                                        {t('buttons.cancel', { ns: 'common' })}
                                    </Button>
                                </Grid>
                                <Grid
                                    item={true}
                                >
                                    <Button
                                        variant={"outlined"}
                                        color={"success"}
                                        disabled={selectedTagsData.length < 1}
                                        onClick={() => {
                                            // selectedRows state is defined when opening the modal
                                            onRowSelectionApplyNewTags(selectedRowsForBulkTagAssign)
                                        }}
                                    >
                                        {t('buttons.apply', { ns: 'common' })}
                                    </Button>
                                </Grid>
                            </Grid>
                            <AutocompleteMultiple
                                type={'tag'}
                                values={selectedTagsData}
                                saveResults={(results: FilterItem[]) => {
                                    // AutocompleteMultiple returns FilterItem[] => we must convert it to TagData[]
                                    // filters might be additive or restrictive, depending on AutocompleteMultiple settings,
                                    // so we use this function to calculate how to extract it
                                    setSelectedTagsData(extractTagsArrayFromUnknownFormat(results))
                                }}
                                allowNewOptions={true}
                                disabled={false} // TODO: should depend on word-ownership?
                                limitTags={4}
                            />
                        </Grid>

                    </Box>
                </Modal>
            }
        </Grid>
    )
}
