import {Grid, Slide, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import globalTheme from "../theme/theme";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {FilterItem, getWordsSimplified} from "../features/words/wordSlice";
import LinearIndeterminate from "../components/Spinner";
import {DnDLanguageOrderSelector} from "../components/DnDLanguageOrderSelector";
import {Lang, NounCases, PartOfSpeech} from "../ts/enums";
import {TranslationsTable} from "../components/table/TranslationsTable";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {TableFilters} from "../components/TableFilters";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {AutocompleteMultiple} from "../components/AutocompleteMultiple";

export function Review(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)
    // Languages currently displayed as columns on the table
    const [allSelectedLanguages, setAllSelectedLanguages] = useState<string[]>((Object.values(Lang).filter((v) => isNaN(Number(v)))) as unknown as Array<keyof typeof Lang>)
    // Languages currently not displayed as columns on the table
    const [otherLanguages, setOtherLanguages] = useState<string[]>([])
    const [displayFilers, setDisplayFilers] = useState(true)

    const {wordsSimple, isLoading, isError, message} = useSelector((state: any) => state.words)
    // @ts-ignore
    // const { filtersURL } = useParams<RouterWordProps>()
    let [searchParams, setSearchParams]  = useSearchParams();

    useEffect(() => {
        if(isError){
            toast.error(`*Something went wrong: ${message}`)
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
                setCurrentTagFilters([{
                    type: 'tag',
                    id: "tag-"+((searchParams.getAll("tags")).length),
                    tagIds: searchParams.getAll("tags"),
                    filterValue: (searchParams.getAll("tags")).toString(),
                }])
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
            id: 'CaseGenderMaleDE',
            type: 'gender',
            filterValue: 'der',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            id: 'CaseGenderFemaleDE',
            type: 'gender',
            filterValue: 'die',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            id: 'CaseGenderNeutralDE',
            type: 'gender',
            filterValue: 'das',
            caseName: NounCases.genderDE,
            language: Lang.DE,
        },
        {
            id: 'CaseGenderMaleES',
            type: 'gender',
            filterValue: 'el',
            caseName: NounCases.genderES,
            language: Lang.ES,
        },
        {
            id: 'CaseGenderFemaleES',
            type: 'gender',
            filterValue: 'la',
            caseName: NounCases.genderES,
            language: Lang.ES,
        }
    ]
    const PoSFilters: FilterItem[] = [
        {
            id: 'PoSNoun',
            type: 'PoS',
            filterValue: 'Noun',
            partOfSpeech: PartOfSpeech.noun,
        },
        {
            id: 'PoSAdverb',
            type: 'PoS',
            filterValue: 'Adverb',
            partOfSpeech: PartOfSpeech.adverb,
        },
        {
            id: 'PoSAdjective',
            type: 'PoS',
            filterValue: 'Adjective',
            partOfSpeech: PartOfSpeech.adjective,
        },
    ]

    const [currentTagFilters, setCurrentTagFilters] = useState<FilterItem[]>([])
    const [currentGenderFilters, setCurrentGenderFilters] = useState<FilterItem[]>([])
    const [currentPoSFilters, setCurrentPoSFilters] = useState<FilterItem[]>([])

    // useEffect(() => {
    //     console.log("filters changed")
    //     // @ts-ignore
    //     const promise = dispatch(getWordsSimplified([
    //         ...currentPoSFilters,
    //         ...currentGenderFilters,
    //         ...currentTagFilters,
    //     ]))
    //     return () => {
    //         // `createAsyncThunk` attaches an `abort()` method to the promise
    //         promise.abort()
    //     }
    // }, [currentPoSFilters, currentGenderFilters, currentTagFilters])

    useEffect(() => {
        const timeout = setTimeout(() => {
        // @ts-ignore
        dispatch(getWordsSimplified([
            ...currentPoSFilters,
            ...currentGenderFilters,
            ...currentTagFilters,
            ]))
        }, 10)

        return () => clearTimeout(timeout)
    }, [currentPoSFilters, currentGenderFilters, currentTagFilters])

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            justifyContent={'center'}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
        >
            <Grid
                item={true}
                container={true}
                justifyContent={'center'}
            >
                <Grid
                    container={true}
                    justifyContent={'center'}
                    item={true}
                >
                    {(isLoading)
                        ?
                        <Grid
                            item={true}
                        >
                            <Typography
                                variant={'h4'}
                                sx={{
                                    textDecoration: 'underline'
                                }}
                            >
                                Fetching word data
                            </Typography>
                        </Grid>
                        :
                        <>
                            <Grid
                                item={true}
                                xs={12}
                            >
                                <Typography
                                    variant={'h4'}
                                    sx={{
                                        textDecoration: 'underline'
                                    }}
                                    align={"center"}
                                >
                                    {(wordsSimple.amount > 0)
                                        ? `You have saved ${wordsSimple.amount} translations`
                                        : "You haven't saved any words yet."
                                    }
                                </Typography>
                            </Grid>
                            <Grid
                                item={true}
                            >
                                {(wordsSimple.amount > 0) &&
                                    <Typography
                                        variant={'subtitle1'}
                                        align={"center"}
                                    >
                                        Review and edit them from here.
                                    </Typography>
                                }
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid>
            {(isLoading) && <LinearIndeterminate/>}
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
                }}
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
                            {(displayFilers) ?'Hide filters' :'Show filters'}
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
                                xs={10}
                            >
                                <AutocompleteMultiple
                                    values={currentTagFilters.map((tag: FilterItem) => tag.filterValue)}
                                    saveResults={(results: FilterItem[]) => {
                                        setCurrentTagFilters(results)
                                    }}
                                    matchAll={true}
                                    limitTags={3}
                                    allowNewOptions={false}
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
            >
                <TranslationsTable
                    sortedAndSelectedLanguages={allSelectedLanguages}
                    data={wordsSimple.words}
                    setAllSelectedItems={(languages: string[]) => changeLanguageOrderFromTable(languages)}
                />
            </Grid>
        </Grid>
    )
}
