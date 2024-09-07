import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {WordForm} from "../components/WordForm";
import {createWord} from "../features/words/wordSlice";
import {WordData} from "../ts/interfaces";
import globalTheme from "../theme/theme";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {PartOfSpeech} from "../ts/enums";

// TODO: remove after merging with UI-Language branch. Copied from generalUseFunctions
export function getPoSKeyByLabel(partOfSpeechLabel: PartOfSpeech){
    const match = Object.keys(PartOfSpeech)[Object.values(PartOfSpeech).indexOf(partOfSpeechLabel)] as string
    return((match!!) ?match :"")
}

type AddWordParams = {
    partOfSpeech: string
}

export function AddWord() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state: any) => state.auth)
    let {currentlySelectedPoS} = useSelector((state: any) => state.words)
    const {partOfSpeech} = useParams<AddWordParams>()
    const [paramPoS, setParamPoS] = useState<PartOfSpeech | undefined>(undefined)

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    }, [user])

    useEffect(() => {
        if(partOfSpeech !== undefined){
            const partOfSpeechToForm = getPoSKeyByLabel(partOfSpeech as PartOfSpeech)
            setParamPoS(partOfSpeechToForm as PartOfSpeech)
        }
    }, [partOfSpeech])

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
            <WordForm
                title={
                    (currentlySelectedPoS !== undefined)
                        ? `Add a new ${currentlySelectedPoS.toLowerCase() }`
                        : 'Add a new word'
                }
                defaultSettings={(paramPoS!!) // TODO: add other params as we imple
                    ? ({partOfSpeech: paramPoS})
                    : undefined
                }
                subTitle={"All the required fields must be completed before saving"}
                onSave={(wordData: WordData) => {
                    //@ts-ignore
                    dispatch(createWord(wordData))
                }}
            />
        </Grid>
    )
}

export default AddWord