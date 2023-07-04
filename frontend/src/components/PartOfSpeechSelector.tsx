import React, {useState} from "react";
import {Lang, PartOfSpeech} from "../ts/enums";
import {Button, Grid, Typography} from "@mui/material";
import {toast} from "react-toastify";
import globalTheme from "../theme/theme";

interface partOfSpeechSelectorProps{
    setPartOfSpeech: (pos: PartOfSpeech) => void
}

export function PartOfSpeechSelector(props: partOfSpeechSelectorProps) {
    const componentStyles = {
        descriptionContainer: {
            marginTop: globalTheme.spacing(4),
            padding: globalTheme.spacing(2),
            borderStyle: "solid",
            borderWidth: "3px",
            borderRadius: '25px',
            borderColor: "rgb(0, 144, 206)",
        },
    }
    const getAllPartsOfSpeech = () => {
        const partsOfSpeech: string[] = (Object.values(PartOfSpeech).filter((v) => isNaN(Number(v))) as unknown as Array<keyof typeof Lang>)
        return(partsOfSpeech)
    }

    const [option, setOption] = useState<any | null>(null)
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
        let description: {info: string, examples: string[]} = {info: "none", examples: ["mic", "check"]}
        if(option!){
            switch(option){
                case PartOfSpeech.noun: {
                    description = {
                        info: "Nouns are stuff. Simple, right?",
                        examples: ["Boy, I sure like this *description*.", "stuff."]
                    }
                    break
                }
                case PartOfSpeech.pronoun: {
                    description = {
                        info: "It's like a noun, but it gets paid.",
                        examples: ["Can *someone* come up with real examples?"]
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
                    <Grid
                        item={true}
                        xs={12}
                    >
                        <Typography
                            variant={"subtitle1"}
                        >
                            {description.info}
                        </Typography>
                    </Grid>
                    <Grid
                        item={true}
                        sx={{ marginTop: globalTheme.spacing(1)}}
                    >
                        {(description.examples).map(((example: string, index: number) => {
                            return(
                                < Typography
                                    variant={"subtitle2"}
                                    key={index}
                                >
                                    ✔ {example}
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
        if(part !== "Noun"){ // TODO: make this depend on a list of implemented forms
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
                justifyContent={"center"}
                spacing={3}
            >
                {(partsOfSpeech).map((part: string, index: number) => {
                    return(
                        <Grid
                            item={true}
                            key={index}
                        >
                            <Button
                                variant={"contained"}
                                color={(part !== "Noun") ? "secondary" : "primary"} // TODO: make this depend on a list of implemented forms
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
            {(option!) &&
                <Grid
                    item={true}
                    container={true}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={componentStyles.descriptionContainer}
                >
                    {getDescription(option)}
                </Grid>
            }
        </Grid>
    )
}