import {Button, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {TranslationItem} from "../ts/interfaces";
import {Lang, PartOfSpeech} from "../ts/enums";
import {WordFormSelector} from "./forms/WordFormSelector";
import globalTheme from "../theme/theme";
import Tooltip from "@mui/material/Tooltip";
import {getCurrentLangTranslated} from "./generalUseFunctions";
import {CountryFlag} from "./GeneralUseComponents";
import {useTranslation} from "react-i18next";

interface WordFormGenericProps {
    index: number, // needed to know on which item in completeWordData.translations list this form data is stored
    partOfSpeech?: PartOfSpeech,
    availableLanguages: Lang[], // list provided by parent component, so we know which languages can be displayed as options to choose from
    currentTranslationData: TranslationItem,
    amountOfFormsOnScreen: number,
    defaultDisabled?: boolean

    removeLanguageFromSelected: (
        index: number,
        willUpdateLanguage: boolean // true when selecting switching between languages - false when removing form from screen
    ) => void // when changing the language we inform parent component that previous one is now available
    updateFormData: (
        formData: TranslationItem,
        index: number
    ) => void
}


// this refers to all the data corresponding to a specific language
// Displays available language options, and once selected it displays the correct fields to input
// This form will only display buttons/textfields/selects for A SINGLE language+word combo
export function TranslationFormGeneric(props: WordFormGenericProps) {
    const { t } = useTranslation(['wordRelated'])
    const [currentLang, setCurrentLang] = useState<Lang | null>(null)
    const componentStyles = {
        translationForm: {
            marginTop: globalTheme.spacing(4),
            padding: globalTheme.spacing(2),
            borderStyle: "solid",
            borderWidth: "5px",
            // logic to display flags in borders
            background: `linear-gradient(#fff, #fff) padding-box, ${
                (currentLang === Lang.EE)
                    ? 'linear-gradient(180deg, rgb(0, 144, 206),  rgb(0, 144, 206), rgb(0, 0, 0), rgb(210, 210, 210), rgb(210, 210, 210))'
                    : (currentLang === Lang.ES)
                        ?
                        'linear-gradient(0deg, rgb(170, 21, 27), rgb(241, 191, 0),  rgb(241, 191, 0), rgb(170, 21, 27))'
                        : (currentLang === Lang.DE)
                            ?
                            'linear-gradient(0deg, rgb(255, 204, 0), rgb(255, 204, 0), rgb(221, 0, 0), rgb(221, 0, 0), rgb(0, 0, 0), rgb(0, 0, 0))'
                            : (currentLang === Lang.EN)
                                ?
                                "linear-gradient(#fff, #fff) padding-box,radial-gradient(circle at center, rgba(220,220,220,1) 0%, #d32f2f 12%, #d32f2f 15%, rgba(84,109,169,1) 30%, rgba(0,31,126,1) 10%, rgba(0,31,126,1) 70%, rgb(220 220 220) 88%, rgba(222,227,239,1) 91%,rgba(207,12,39,1) 100%) border-box"
                                : "rgb(0, 144, 206)"
            } border-box`,
            border: '5px solid transparent',
            borderRadius: '45px'
        },
        languageTitle: {
            textDecoration: 'underline'
        },
        removeButton: {
            borderRadius: '5px 5px 5px 22px'
        },
        lastLanguageButton: {
            borderRadius: '5px 5px 22px 5px'
        }
    }

    const { currentTranslationData } = props
    useEffect(() => {
        if(currentTranslationData.language!){
            setCurrentLang(currentTranslationData.language)
        } // if it's another empty Object, the language here should remain null
    }, [currentTranslationData])

    const languageButtonList = () => {
        return(
            <>
                {((currentLang !== null) && (props.availableLanguages.length > 0)) &&
                <Grid
                    item={true}
                    sx={{
                        alignSelf: 'self-end',
                    }}
                >
                    <Typography
                        variant={"subtitle2"}
                        sx={{
                            display: {xs: 'none', sm: 'initial'},
                        }}
                    >
                        {t('translationFormGeneric.switchLanguage', {ns: 'wordRelated'})}
                    </Typography>
                </Grid>}
                {props.availableLanguages.map((lang: Lang, index: number) => {
                    return(
                        <Grid
                            item={true}
                            key={index}
                        >
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                sx={{
                                    ...(currentLang !== null)
                                        ?
                                            {
                                                padding: '4px 10px 4px 10px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'normal',
                                                marginBottom: '0px',
                                            }
                                        : undefined,
                                    ...((index === (props.availableLanguages.length -1)) && (currentLang !== null))
                                        ? componentStyles.lastLanguageButton
                                        : undefined
                                }}
                                onClick={() => {
                                    // if we click on the button for the selected language nothing happens
                                    if(currentLang === lang){
                                        return
                                    }
                                    if(currentLang !== null){
                                        // inform parent that old lang is now available
                                        props.removeLanguageFromSelected(props.index, true)
                                    }
                                    setCurrentLang(lang)
                                }}
                            >
                                <CountryFlag
                                    country={lang}
                                    border={true}
                                    sxProps={{
                                        marginRight: '10px',
                                    }}
                                />
                                {t(`languages.${lang.toLowerCase()}`, {ns: 'common'})}
                            </Button>
                        </Grid>
                    )
                })}
            </>
        )
    }

    return(
        <Grid
            item={true}
            container={true}
            rowSpacing={1}
            alignItems={"center"}
            sx={componentStyles.translationForm}
        >
            {/* List of language buttons */}
            <Grid
                item={true}
                container={true}
                justifyContent={"center"}
                spacing={2}
            >
                {((currentLang == null) && !(currentTranslationData.language!!))
                    ?
                        languageButtonList()
                    : (currentLang !== null) &&
                        <Typography
                            variant={"h3"}
                            sx={componentStyles.languageTitle}
                        >
                            {getCurrentLangTranslated(currentLang)}
                        </Typography>
                }
            </Grid>
            {/* Language form */}
            <Grid
                item={true}
                container={true}
                justifyContent={(currentLang == null) && !(currentTranslationData.language!!) ?"center" :"flex-start"}
            >
                {((currentLang == null) && !(currentTranslationData.language!!))
                    ?
                    <Typography
                        variant={"subtitle2"}
                    >
                        {t('translationFormGeneric.selectLanguage', {ns: 'wordRelated'})}
                    </Typography>
                    : (currentLang !== null) &&
                        <WordFormSelector
                            currentLang={currentLang}
                            currentTranslationData={props.currentTranslationData}
                            partOfSpeech={props.partOfSpeech}
                            displayFieldsAsText={props.defaultDisabled}
                            updateFormData={(formData: TranslationItem) => {
                                props.updateFormData(
                                    {
                                        ...formData,
                                        // To avoid saving empty cases,
                                        cases: formData.cases.filter((nounCase) => (nounCase.word !== "")),
                                    },
                                    props.index
                                )
                            }}
                        />

                }
            </Grid>
            {/* Additional buttons */}
            {!(props.defaultDisabled!!) &&
                <Grid
                    item={true}
                    container={true}
                    justifyContent={"space-between"}
                    sx={{
                        marginTop: globalTheme.spacing(2)
                    }}
                >
                    <Grid
                        item={true}
                        container={true}
                        spacing={1}
                        justifyContent={"flex-start"}
                        alignItems={"flex-end"}
                        xs={"auto"} // so it grows to use only the necessary width to render the buttons
                    >
                        <Grid
                            item={true}
                        >
                            <Tooltip
                                title={(props.amountOfFormsOnScreen < 3) ? "You need at least 2 translations" : ""}
                            >
                                <span>
                                    <Button
                                        variant={"outlined"}
                                        color={"error"}
                                        disabled={(props.amountOfFormsOnScreen < 3)}
                                        onClick={() => {
                                            // this should run even if no language is selected
                                            // because there's an empty Object at this index holding its place
                                            props.removeLanguageFromSelected(props.index, false)
                                            setCurrentLang(null)
                                        }}
                                        sx={componentStyles.removeButton}
                                    >
                                    {t("buttons.remove", {ns: 'common'})}
                                    </Button>
                                </span>
                            </Tooltip>
                        </Grid>
                        {(currentLang !== null && (currentTranslationData.language!!)) &&
                            <Grid
                                item={true}
                            >
                                <Button
                                    variant={"outlined"}
                                    onClick={() => {
                                        props.removeLanguageFromSelected(props.index, true)
                                        setCurrentLang(null)
                                    }}
                                >
                                    {t("buttons.clear", {ns: 'common'})}
                                </Button>
                            </Grid>
                        }
                    </Grid>
                    <Grid
                        item={true}
                        container={true}
                        justifyContent={"flex-end"}
                        alignItems={"flex-end"}
                        xs // so it grows to take all the space left available on this row
                        spacing={1}
                    >
                        {(currentLang !== null && (currentTranslationData.language!!)) && languageButtonList()}
                    </Grid>
                </Grid>
            }
        </Grid>
    )
}