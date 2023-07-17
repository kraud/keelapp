import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import globalTheme from "../theme/theme";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getWordsSimplified} from "../features/words/wordSlice";
import LinearIndeterminate from "../components/Spinner";
import {DnDLanguageOrderSelector} from "../components/DnDLanguageOrderSelector";
import {Lang} from "../ts/enums";
import {TranslationsTable} from "../components/table/TranslationsTable";

export function Review(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)
    // Languages currently displayed as columns on the table
    const [allSelectedLanguages, setAllSelectedLanguages] = useState<string[]>((Object.values(Lang).filter((v) => isNaN(Number(v)))) as unknown as Array<keyof typeof Lang>)
    // Languages currently not displayed as columns on the table
    const [otherLanguages, setOtherLanguages] = useState<string[]>([])

    const {wordsSimple, isLoading, isError, message} = useSelector((state: any) => state.words)

    useEffect(() => {
        if(isError){
            toast.error(`Something went wrong: ${message}`)
        }
        if(!user){
            navigate('/login')
        }
        //@ts-ignore
        dispatch(getWordsSimplified())

        //on unmount
        return() => {

        }
    }, [user, navigate, isError, message, dispatch])

    // allows column dragging from table to work with DnDLanguageSelector
    const changeLanguageOrderFromTable = (newList: string[]) => {
        const updatedOrderList =
            (newList.slice(1)). // we start at 1, since 0 it's always the "type" column
                map((language: string) => {
                    // @ts-ignore
                    return(Lang[language.slice(-2)]) // we need the LAST 2 letters, to identify the language
                })
        setAllSelectedLanguages(updatedOrderList)
    }

    return(
        <Grid
            container={true}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
        >
            {(isLoading) && <LinearIndeterminate/>}
            <Grid
                container={true}
                item={true}
            >
                <Typography
                    variant={'h4'}
                    sx={{
                        textDecoration: 'underline'
                    }}
                >
                    {(isLoading)
                        ? "Fetching word data"
                        : (wordsSimple.amount >0)
                            ? `You have saved ${wordsSimple.amount} translations`
                            : "You haven't saved any words yet."
                    }

                </Typography>
            </Grid>
            {(wordsSimple.amount >0)  &&
                <>
                    <Grid
                        container={true}
                        item={true}
                    >
                        <Typography
                            variant={'subtitle1'}
                        >
                            Review and edit them from here.
                        </Typography>
                    </Grid>
                    <Grid
                        container={true}
                        item={true}
                        sx={{
                            marginTop: globalTheme.spacing(4)
                        }}
                    >
                        <Typography
                            variant={'h6'}
                            sx={{
                                textDecoration: 'underline'
                            }}
                        >
                            Sort list by:
                        </Typography>
                    </Grid>
                    {/*
                        TODO: refactor later into single table component with DnD language selector included
                            & add frame, pagination, filters, toggles for extra data, etc.
                  */}
                    <DnDLanguageOrderSelector
                        allSelectedItems={allSelectedLanguages}
                        setAllSelectedItems={(languages: string[]) => setAllSelectedLanguages(languages)}
                        otherItems={otherLanguages}
                        setOtherItems={(languages: string[]) => setOtherLanguages(languages)}
                        direction={"horizontal"}
                    />
                    {/* TABLE */}
                    <TranslationsTable
                        sortedAndSelectedLanguages={allSelectedLanguages}
                        data={wordsSimple.words}
                        setAllSelectedItems={(languages: string[]) => changeLanguageOrderFromTable(languages)}
                    />
                </>
            }
        </Grid>
    )
}