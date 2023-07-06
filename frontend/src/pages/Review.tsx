import {Grid, Typography} from "@mui/material";
import React, {useEffect} from "react";
import globalTheme from "../theme/theme";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getWords} from "../features/words/wordSlice";
import LinearIndeterminate from "../components/Spinner";
import {WordData} from "../ts/interfaces";

export function Review(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)

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
                    You have saved {words.length} translations
                </Typography>
            </Grid>
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
            {/* WORD LIST*/}
            <Grid
                container={true}
                item={true}
            >
                {
                    (words.map((word: WordData) => {
                        return(
                            <Grid
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
        </Grid>
    )
}