import React, {useEffect} from "react";
import {Grid, Typography} from "@mui/material";
import ResponsiveAppBar from "../components/Header";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {TranslationForm} from "./TranslationForm";
import {createWord} from "../features/words/wordSlice";
import {WordData} from "../ts/interfaces";

export function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    }, [user, navigate])

    return(
        <>
            <ResponsiveAppBar/>
            <Grid
                container={true}
                spacing={1}
            >
                <Grid
                    item={true}
                    xs={12}
                >
                    <Typography
                        variant={"h4"}
                    >
                        Welcome {user?.name}
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    xs={6}
                >
                    <Typography
                        variant={"subtitle2"}
                    >
                        Ready to learn something today?
                    </Typography>
                </Grid>
                <TranslationForm
                    onSave={(wordData: WordData) => {
                        const completeData = {
                            ...wordData,
                            partOfSpeech: "Noun",
                        }
                        //@ts-ignore
                        dispatch(createWord(completeData))
                    }}
                />
            </Grid>
        </>
    )
}

export default Dashboard