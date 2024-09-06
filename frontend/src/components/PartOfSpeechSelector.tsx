import React, {useState} from "react";
import {Lang, PartOfSpeech} from "../ts/enums";
import {Button, Grid, Slide, Typography} from "@mui/material";
import {toast} from "react-toastify";
import globalTheme from "../theme/theme";
import Box from "@mui/material/Box";
import {motion} from "framer-motion";
import {childVariantsAnimation} from "../pages/management/RoutesWithAnimation";
import {getPoSKeyByLabel} from "./generalUseFunctions";
import {useTranslation} from "react-i18next";

interface partOfSpeechSelectorProps{
    setPartOfSpeech: (pos: PartOfSpeech) => void
}

export function PartOfSpeechSelector(props: partOfSpeechSelectorProps) {
    const { t } = useTranslation(['common', 'wordRelated'])
    const implementedForms = ["Noun", "Adjective", "Adverb", "Verb"]
    const containerRef = React.useRef(null)

    const componentStyles = {
        descriptionContainer: {
            marginTop: globalTheme.spacing(4),
            padding: globalTheme.spacing(2),
            borderStyle: "solid",
            borderWidth: "3px",
            borderRadius: '25px',
            borderColor: "rgb(0, 144, 206)",
        },
        exampleHighlight: {
            fontWeight: "bold",
            textDecoration: "underline",
            color: "rgb(0, 144, 206)",
            fontSize: "1.05rem"
        }
    }
    const getAllPartsOfSpeech = () => {
        const partsOfSpeech: string[] = (Object.values(PartOfSpeech).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        return(partsOfSpeech)
    }

    const [option, setOption] = useState<string | null>(null)
    const partsOfSpeech: string[] = getAllPartsOfSpeech()

    function handleMouseEnter(event: React.MouseEvent<HTMLLIElement> | null) {
        if(event === null){
            setOption(null)
        } else {
            setOption(event.currentTarget.textContent)
        }
    }

    // These should be more elaborate (yet still short and simple). Should also include examples. Maybe.
    function getDescription(option: any | null){
        let description: {info: string, examples: string[]} = {info: "none", examples: ["*mic*" , "*check*"]}
        if(option!){
            switch(option){
                case(t("partOfSpeech.noun", {ns: 'common'})): {
                    description = {
                        info: t("partOfSpeechSelector.description.noun.info", {ns: "wordRelated"}),
                        examples: t("partOfSpeechSelector.description.noun.examples", {ns: "wordRelated", returnObjects: true})
                    }
                    break
                }
                case(t("partOfSpeech.pronoun", {ns: 'common'})): {
                    description = {
                        info: t("partOfSpeechSelector.description.pronoun.info", {ns: "wordRelated"}),
                        examples: t("partOfSpeechSelector.description.pronoun.examples", {ns: "wordRelated", returnObjects: true})
                    }
                    break
                }
                case(t("partOfSpeech.verb", {ns: 'common'})): {
                    description = {
                        info: t("partOfSpeechSelector.description.verb.info", {ns: "wordRelated"}),
                        examples: t("partOfSpeechSelector.description.verb.examples", {ns: "wordRelated", returnObjects: true})
                    }
                    break
                }
                case(t("partOfSpeech.adjective", {ns: 'common'})): {
                    description = {
                        info: t("partOfSpeechSelector.description.adjective.info", {ns: "wordRelated"}),
                        examples: t("partOfSpeechSelector.description.adjective.examples", {ns: "wordRelated", returnObjects: true})
                    }
                    break
                }
                case(t("partOfSpeech.adverb", {ns: 'common'})): {
                    description = {
                        info: t("partOfSpeechSelector.description.adverb.info", {ns: "wordRelated"}),
                        examples: t("partOfSpeechSelector.description.adverb.examples", {ns: "wordRelated", returnObjects: true})
                    }
                    break
                }
                default: return "You'll know it when you see it!"
            }

            return (
                <Grid
                    container={true}
                    item={true}
                >
                    {/* PART OF SPEECH NAME*/}
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <Typography
                            sx={{
                                typography: {xs: 'h6', sm: "h5"},
                                textDecoration: "underline",
                            }}
                        >
                            {t(`partOfSpeech.${getPoSKeyByLabel(option as PartOfSpeech)}`, {ns: "common"})}
                        </Typography>
                    </Grid>
                    {/* DESCRIPTION */}
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <Typography
                            variant={"subtitle1"}
                            gutterBottom={false}
                        >
                            {description.info}
                        </Typography>
                    </Grid>
                    {/* EXAMPLES */}
                    <Grid
                        item={true}
                        sx={{ marginTop: globalTheme.spacing(1)}}
                    >
                        {(description.examples).map(((example: string, index: number) => {
                            // This way, we make it obvious what word (the highlight) we're exemplifying
                            const exampleParts: string[] = (example).split("*")
                            return(
                                < Typography
                                    variant={"subtitle2"}
                                    key={index}
                                >
                                    ✔ {exampleParts[0]}
                                    <Box
                                        component="span"
                                        fontWeight='fontWeightBold'
                                        sx={componentStyles.exampleHighlight}
                                    >
                                        {exampleParts[1]}
                                    </Box>
                                    {exampleParts[2]}
                                </Typography>
                            )
                        }))}
                    </Grid>
                    {/*TODO: maybe add a link to resources here?*/}
                </Grid>
            )
        } else {
            return null
        }
    }

    const handleOnClick = (part: PartOfSpeech) => {
        if(!(implementedForms).includes(part)){
            toast.error(t("partOfSpeechSelector.missingImplementationPoS", {ns: "wordRelated"}))
        } else {
            props.setPartOfSpeech((part as PartOfSpeech))
        }
    }

    return(
        <Grid
            container={true}
            justifyContent={"center"}
            rowSpacing={3}
        >
            {/* TITLE AND HINT */}
            <Grid
                item={true}
                container={true}
                justifyContent={"center"}
            >
                <Grid
                    item={true}
                    xs={12}
                >
                    <Typography
                        sx={{ typography: {xs: "h4", sm: "h3"}}}
                        align={"center"}
                    >
                        {t("partOfSpeechSelector.title", {ns: "wordRelated"})}
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    component={motion.div}
                    variants={childVariantsAnimation}
                    initial="initial"
                    animate="final"
                >
                    <Typography
                        sx={{ typography: {xs: "caption", sm: "subtitle2"}}}
                        align={"center"}
                    >
                        {t("partOfSpeechSelector.subtitle", {ns: "wordRelated"})}
                    </Typography>
                </Grid>
            </Grid>
            {/* BUTTONS */}
            <Grid
                item={true}
                container={true}
                sx={{
                    justifyContent: {xs: "space-around", sm: "center"}
                }}
                spacing={3}
                component={motion.div}
                variants={childVariantsAnimation}
                initial="initial"
                animate="final"
            >
                {(partsOfSpeech).map((part: string, index: number) => {
                    return(
                        <Grid
                            item={true}
                            key={index}
                        >
                            <Button
                                variant={"contained"}
                                color={(implementedForms).includes(part) ? "primary" : "secondary"}
                                onClick={() => handleOnClick(part as PartOfSpeech)}
                                onMouseEnter={(e: any) => handleMouseEnter(e)}
                                onMouseLeave={(e: any) => handleMouseEnter(null)}
                            >
                                {t(`partOfSpeech.${getPoSKeyByLabel(part as PartOfSpeech)}`, {ns: "common"})}
                            </Button>
                        </Grid>
                    )
                })}
            </Grid>
            {/* DESCRIPTIONS */}
            <Grid
                ref={containerRef}
                sx={{
                    overflow: 'hidden',
                }}
            >
                <Slide
                    direction="down"
                    in={(option !== null)}
                    container={containerRef.current}
                >
                    <Grid
                        item={true}
                        container={true}
                        alignItems={"center"}
                        justifyContent={"center"}
                        sx={componentStyles.descriptionContainer}
                    >
                        {getDescription(option)}
                    </Grid>
                </Slide>
            </Grid>
        </Grid>
    )
}