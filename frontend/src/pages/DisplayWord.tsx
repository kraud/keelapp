import React, {useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";
import {motion} from "framer-motion";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import globalTheme from "../theme/theme";
import {WordForm} from "../components/WordForm";
import {WordData} from "../ts/interfaces";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getWordById, updateWordById} from "../features/words/wordSlice";
import {toast} from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {AppDispatch} from "../app/store";
import {useTranslation} from "react-i18next";
import {getPoSKeyByLabel} from "../components/generalUseFunctions";
import {PartOfSpeech} from "../ts/enums";

interface RouterWordProps{
    wordId: string
}
interface DisplayWordProps {
    defaultDisabled?: boolean
}

export function DisplayWord(props: DisplayWordProps){
    // --------------- THIRD-PARTY HOOKS ---------------
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation(['common', 'wordRelated'])
    // @ts-ignore
    const { wordId } = useParams<RouterWordProps>()

    // --------------- REDUX STATE ---------------
    const {word, currentlySelectedPoS, isLoading, isError, message} = useSelector((state: any) => state.words)
    const {user} = useSelector((state: any) => state.auth)

    // --------------- LOCAL STATE ---------------
    const [finishedUpdating, setFinishedUpdating] = useState(true)

    // --------------- USE-EFFECTS ---------------
    useEffect(() => {
        if(wordId!!) {
            dispatch(getWordById(wordId))
        }
    },[])

    useEffect(() => {
        if(isError){
            toast.error(t('displayWord.toastError', { error: message, ns: 'wordRelated' }), {
                toastId: "click-on-modal"
            })
        }
    }, [isError, message])

    useEffect(() => {
        // isLoading switches back to false once the response from backend is set on redux
        // finishedUpdating will only be false while waiting for a response from backend
        if(!finishedUpdating && !isLoading){
            toast.success(t('displayWord.toastUpdateSuccess', { ns: 'wordRelated' }), {
                toastId: "click-on-modal"
            })
            // we reverse to the original state, before sending data to update
            setFinishedUpdating(true)
        }
    }, [isLoading, finishedUpdating])

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
            <Grid
                item={true}
                xs
                sx={{
                    paddingBottom: globalTheme.spacing(4)
                }}
            >
                <Button
                    variant={"contained"}
                    color={"secondary"}
                    onClick={() => {
                        navigate(-1)
                    }}
                    fullWidth={true}
                    startIcon={<ArrowBackIcon />}
                >
                    {t('buttons.return', { ns: 'common' })}
                </Button>
            </Grid>
            <WordForm
                title={
                    (currentlySelectedPoS !== undefined)
                        ? t('displayWord.titlePos', { currentPoS: t(`partOfSpeech.${getPoSKeyByLabel(currentlySelectedPoS as PartOfSpeech)}`, {ns: "common"}), ns: 'wordRelated' })
                        : t('displayWord.titleSimple', { ns: 'wordRelated' })
            }
                subTitle={t('displayWord.subtitle', { ns: 'wordRelated' })}
                onSave={(wordData: WordData) => {
                    const updatedWordData = {
                        id: wordId,
                        clue: wordData.clue,
                        tags: wordData.tags,
                        partOfSpeech: wordData.partOfSpeech,
                        translations: wordData.translations,
                    }
                    //@ts-ignore
                    dispatch(updateWordById(updatedWordData))
                    setFinishedUpdating(false)
                }}
                initialState={word}
                defaultDisabled={props.defaultDisabled}
                disableEditing={word.user !== user._id}
            />
        </Grid>
    )
}