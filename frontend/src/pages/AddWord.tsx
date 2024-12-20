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
import {AppDispatch} from "../app/store";
import {useTranslation} from "react-i18next";
import {PartOfSpeech} from "../ts/enums";
import {getPoSKeyByLabel} from "../components/generalUseFunctions";

type AddWordParams = {
    partOfSpeech: string
}

export function AddWord() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation(['common', 'wordRelated'])
    const {user} = useSelector((state: any) => state.auth)
    const {currentlySelectedPoS} = useSelector((state: any) => state.words)
    const partOfSpeechKey = getPoSKeyByLabel(currentlySelectedPoS)
    const translatedPoSLabel = t(`partOfSpeech.${partOfSpeechKey}`, {ns: "common"})
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
                        ? t('addWordPage.title', {ns: 'wordRelated', currentPoS: translatedPoSLabel.toLowerCase()})
                        : t('addWordPage.titleDefault', {ns: 'wordRelated'})
                }
                defaultSettings={(paramPoS!!) // TODO: add other params as we imple
                    ? ({partOfSpeech: paramPoS})
                    : undefined
                }
                subTitle={t('addWordPage.subtitle', {ns: 'wordRelated'})}
                onSave={(wordData: WordData) => {
                    dispatch(createWord(wordData))
                }}
            />
        </Grid>
    )
}

export default AddWord