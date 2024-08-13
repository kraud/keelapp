import React, {useState} from "react";
import {Lang, PartOfSpeech} from "../ts/enums";
import {Button, Grid, Slide, Typography} from "@mui/material";
import {toast} from "react-toastify";
import globalTheme from "../theme/theme";
import Box from "@mui/material/Box";
import {motion} from "framer-motion";
import {childVariantsAnimation} from "../pages/management/RoutesWithAnimation";

interface partOfSpeechSelectorProps{
    setPartOfSpeech: (pos: PartOfSpeech) => void
}

export function PartOfSpeechSelector(props: partOfSpeechSelectorProps) {
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
                case PartOfSpeech.noun: {
                    description = {
                        info: "Nouns are essential words in language that give names to people, places, things, or ideas. They help us identify and talk about the world around us.",
                        examples: [
                                "*Pizza* is a popular Italian dish.",
                                "A *dog* is a loyal pet.",
                                "A *city* is a large urban area with buildings, roads, and a bustling population."
                        ]
                    }
                    break
                }
                case PartOfSpeech.pronoun: {
                    description = {
                        info: "Pronouns are words that replace specific nouns to make our sentences less repetitive. They help us refer to people, places, things, or ideas without constantly repeating the same noun.",
                        examples: [
                            "*She* is reading a book.",
                            "*We* are going to the park.",
                        ]
                    }
                    break
                }
                case PartOfSpeech.verb: {
                    description = {
                        info: "Verbs are action words that describe what someone or something does. They express actions, states, or occurrences. Verbs bring life and movement to our sentences.",
                        examples: [
                            "I *eat* pizza on weekends because it's my favorite food.",
                            "The cat *jumps* onto the table to explore its surroundings."
                        ]
                    }
                    break
                }
                case PartOfSpeech.adjective: {
                    description = {
                        info: "Adjectives are words that describe or modify nouns, giving us more information about them. They help us express characteristics, qualities, or attributes of the things we talk about.",
                        examples: [
                            "The weather is *sunny* today, with clear skies and plenty of sunshine.",
                            "She has a *friendly* personality and always greets everyone with a smile."
                        ]
                    }
                    break
                }
                case PartOfSpeech.adverb: {
                    description = {
                        info: " Adverbs are words that are used to provide more information about verbs, adjectives and other adverbs used in a sentence. There are five main types of adverbs namely, adverbs of manner, adverbs of degree, adverbs of frequency, adverbs of time and adverbs of place.",
                        examples: [
                            "Did you come *here* to buy an umbrella? (Adverb of place)",
                            "I did not go to school *yesterday* as I was sick. (Adverb of time)",
                            "Savio reads the newspaper *everyday*. (Adverb of frequency)",
                            "Can you please come *quickly*? (Adverb of manner)",
                            "Tony was so sleepy that he could *hardly* keep his eyes open during the meeting. (Adverb of degree)"
                        ]
                    }
                    break
                }
                default: return "You'll know it when you see it."
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
                            {option}
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
            toast.error("This part of speech is not implemented yet, we're sorry!")
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
                        What kind of word is it?
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
                        Not sure what's what? Hover over the buttons and read the descriptions.
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
                                {part}
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