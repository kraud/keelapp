import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import globalTheme from "../theme/theme";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getWords} from "../features/words/wordSlice";
import LinearIndeterminate from "../components/Spinner";
import {WordData} from "../ts/interfaces";
import {DnDLanguageOrderSelector} from "../components/DnDLanguageOrderSelector";
import {Lang} from "../ts/enums";

export function Review(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)
    const [allLanguages, setAllLanguages] = useState<string[]>((Object.values(Lang).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>))

    const {words, isLoading, isError, message} = useSelector((state: any) => state.words)

    useEffect(() => {
        if(isError){
            toast.error(`Something went wrong: ${message}`)
        }
        if(!user){
            navigate('/login')
        }
        //@ts-ignore
        dispatch(getWords())

        //on unmount
        return() => {

        }
    }, [user, navigate, isError, message, dispatch])

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
                    {(words.length >0)
                        ? `You have saved ${words.length} translations`
                        : "You haven't saved any words yet."
                    }

                </Typography>
            </Grid>
            {(words.length >0)  &&
                <>
                    <Grid
                        container={true}
                        item={true}
                    >
                        <Typography
                            variant={'subtitle1'}
                        >
                            You can review and edit them from here.
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
                    <DnDLanguageOrderSelector
                        allItems={allLanguages}
                        setAllItems={(languages: string[]) => setAllLanguages(languages)}
                        direction={"horizontal"}
                    />
                    {/* WORD LIST*/}
                    <Grid
                        container={true}
                        item={true}
                        sx={{
                            marginTop: globalTheme.spacing(2)
                        }}
                    >
                        {
                            (words.map((word: WordData, index: number) => {
                                return(
                                    <Grid
                                        key={index}
                                        item={true}
                                        container={true}
                                    >
                                        <Typography
                                            variant={"subtitle2"}
                                        >
                                            ✔ {word.translations[0].cases[0].word}
                                        </Typography>
                                    </Grid>
                                )
                            }))
                        }
                    </Grid>
                </>
            }
        </Grid>
    )
}