import {Grid, Typography} from "@mui/material";
import {motion, MotionValue, useSpring, useTransform} from "framer-motion";
import React, {useEffect, useRef, useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import {LanguageAndLabel} from "../ts/interfaces";
import {useSelector} from "react-redux";
import {Lang} from "../ts/enums";

interface SpinningTextProps {
    translations: LanguageAndLabel[] //  First item will be the translation displayed on the tooltip
    variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2"
    // TODO: until we can find a solution for no-width divs when position is absolute - we use a calculated value or this optional prop
    width?: number, // amount in pixels required to display the longest text inside props.translations - overrides the auto-calculated max
    sxProps?: any,
    color?: "primary" | "secondary",
    direction?: "up" | "down",
    justifyContent?: 'center' | 'flex-start' | 'flex-end'
    fastDisplay?: boolean,
    speedFunction?: (x: number) => number
}

// NB! This is intended to be used for titles or short phrases.
// Component width is calculated on an approximation of average letter width, so it can be inaccurate at times.
// Can be corrected with the optional "width" prop, if needed.
export function SpinningText(props: SpinningTextProps) {
    const {user} = useSelector((state: any) => state.auth)
    const [value, setValue] = useState(0)
    const reelSpins = 10
    let animatedValue = useSpring(value, { stiffness: 66, damping: 4 })

    // we only display translations for languages that the user has selected (always at least 2)
    const matchingLanguagesItems = ((user!!) && (user?.languages!!) && (user.languages.length > 1)) // check in case of new user with no languages yet selected
        ? props.translations.filter((languageItem: LanguageAndLabel) => {
            return(user.languages.includes(languageItem.language))
        })
        : props.translations.filter((languageItem: LanguageAndLabel) => {
            // TODO: Should be 'user.uiLanguage' instead of 'Lang.EN'? What would happen with new users with browser languages NOT included in our supported-languages list?
            return(Lang.EN === (languageItem.language))
        })

    const spinnerComponentAnimation = {
        initial: {
            opacity: 0,
            y: `${(props.direction === "down") ?"-" :"+"}80px`, // by default, it goes up.
        },
        final: {
            opacity: 1,
            y: "0px",
            transition: {
                duration: (props.fastDisplay!) ? 0.15 :0.45,
                delay: (props.fastDisplay!) ? 0.25 :0.65,
            },
        }
    }

    // Function to calculate the speed of a slot machine reel slowing down
    function calculateReelSpeed(x: number) {
        return 1 - (1 - 0.01) * Math.pow(x / 40, 2)
    }

    // We iterate through an increasing number to trigger the reel rolling animation
    let intervalID = useRef(null) //using useRef hook to maintain state changes across re-renders
    useEffect(() => {
        let speedFactor = 1
        if(props.speedFunction !== undefined){
            speedFactor = (props.speedFunction(value))
        } else {
            speedFactor = calculateReelSpeed(value)
        }

        if (value < reelSpins) {
            // @ts-ignore
            intervalID.current = setInterval(() => {
                setValue((value) => value + 1)
            }, (125*(speedFactor)))
        }
        // @ts-ignore
        return () => clearInterval(intervalID.current) //clear previous interval when unmounting.
    }, [value])

    useEffect(() => {
        animatedValue.set(value)
    }, [animatedValue, value])

    // We need to shuffle the array of options, so we don't display the same one every time
    const [shuffledArray, setShuffledArray] = useState<string[]>([])
    useEffect(() => {
        setShuffledArray(
            matchingLanguagesItems
            .map((translationItem) => {
                return ({translationItem: translationItem, sort: Math.random()})
            })
            .sort((a, b) => {
                return (a.sort - b.sort)
            })
            .map((sortedItem ) => {
                return(
                    sortedItem.translationItem.label
                )
            })
        )
    },[])

    const calculateMaxWidth = () => {
        let longestString: number = 10
        let fontSize = getVariantData(props.variant, "width") as number
        (matchingLanguagesItems).forEach((translation: LanguageAndLabel) => {
            if(translation.label?.length > longestString){
                longestString = translation.label.length
            }
        })
        // multiply string length by size of font to determine the width
        return(`${(longestString * fontSize)+20}px`) // +20 for extra margin
    }

    const stringDisplayed = shuffledArray[reelSpins%matchingLanguagesItems.length]
    const uiLanguageString = (user !== undefined)
        ? Lang.EN // no language selected => ENGLISH
        : matchingLanguagesItems[matchingLanguagesItems.findIndex((item: LanguageAndLabel) => {
            return(item.language === user.uiLanguage)
        })
    ]?.label

    return(
        <Tooltip
            // to avoid displaying the tooltip when the displayed translation is in the UI-language
            title={(stringDisplayed !== uiLanguageString)
                ? uiLanguageString
                : ""
            }
        >
            <Grid
                container={true}
                item={true}
                justifyContent={(props.justifyContent !== undefined) ? props.justifyContent :'center'}
                sx={{
                    width: (props.width !== undefined) ?props.width :calculateMaxWidth(),
                    height: `${getVariantData(props.variant, "height")}px`,
                    overflow: 'hidden',
                    position: 'relative',
                }}
                component={motion.div}
                variants={spinnerComponentAnimation}
                initial="initial"
                animate="final"
            >
                {shuffledArray.map((translation, index) => {
                    return(
                        <TextItem
                            key={`${index}-${translation}`}
                            mv={animatedValue}
                            index={index}
                            text={translation}
                            wrapLength={matchingLanguagesItems.length}
                            variant={props.variant}
                            sxProps={props.sxProps}
                            color={props.color}
                            direction={props.direction}
                        />
                    )
                })}
            </Grid>
        </Tooltip>
    )
}

interface TextItemProps {
    mv: MotionValue,
    index: number,
    text: string,
    wrapLength: number,
    variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2",
    sxProps: any,
    color?: "primary" | "secondary",
    direction?: "up" | "down"
}

function TextItem(props: TextItemProps){
    let y = useTransform(props.mv, (latest) => {
        let height = getVariantData(props.variant, "height")
        let placeValue = latest % props.wrapLength
        let offset = (props.wrapLength + props.index - placeValue) % props.wrapLength

        let memo = (props.direction === "down") ?((offset * height)+4) :((offset * height)-4) // -4 to account for upside-down question marks and g-y-etc.

        if (offset > (props.wrapLength/2)) {
            memo -= props.wrapLength * height
        }

        return((props.direction === "down") ?(-memo) :(memo)) // by default, it spins upwards
    })

    return (
        <Grid
            item={true}
            component={motion.div}
            // @ts-ignore
            style={{ y }}
            sx={{
                position: 'absolute',
                width: 'max-content',
            }}
        >
            <Typography
                variant={(props.variant !== undefined) ? props.variant :'h3'}
                color={props.color}
                sx={props.sxProps}
            >
                {props.text}
            </Typography>
        </Grid>
    )

}

const getVariantData = (variant: string, type: "width"|"height") => {
    switch(type){
        case "width": {
            switch(variant){
                case "h1": {
                    return(42)
                }
                case "h2": {
                    return(26)
                }
                case "h3": {
                    return(22)
                }
                case "h4": {
                    return(16)
                }
                case "h5": {
                    return(11)
                }
                case "h6": {
                    return(10)
                }
                case "subtitle1": {
                    return(8)
                }
                case "subtitle2": {
                    return(7)
                }
                case "body1": {
                    return(8)
                }
                case "body2": {
                    return(7)
                }
                default: {
                    return(20) // between h4 and h3
                }
            }
        }
        case "height": {
            switch(variant){
                case "h1": {
                    return(115)
                }
                case "h2": {
                    return(72)
                }
                case "h3": {
                    return(58)
                }
                case "h4": {
                    return(41)
                }
                case "h5": {
                    return(29)
                }
                case "h6": {
                    return(24)
                }
                case "subtitle1": {
                    return(19)
                }
                case "subtitle2": {
                    return(17)
                }
                case "body1": {
                    return(19)
                }
                case "body2": {
                    return(17)
                }
                default: {
                    return(41)
                }
            }
        }
        default: return(30)
    }

}