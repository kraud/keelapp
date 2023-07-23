import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {TranslationForm} from "../components/TranslationForm";
import {createWord} from "../features/words/wordSlice";
import {WordData} from "../ts/interfaces";
import globalTheme from "../theme/theme";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";

export function AddWord() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    }, [user, navigate])

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            item={true}
            justifyContent={"center"}
            xs={12}
            md={10}
            lg={8}
            sx={{
                marginTop: globalTheme.spacing(4),
                marginBottom: globalTheme.spacing(4),
            }}
        >
            <TranslationForm
                onSave={(wordData: WordData) => {
                    //@ts-ignore
                    dispatch(createWord(wordData))
                }}
            />
        </Grid>
    )
}

export default AddWord