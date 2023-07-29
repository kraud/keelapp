import {Grid, Typography} from "@mui/material";
import {motion, MotionValue, useSpring, useTransform} from "framer-motion";
import React, {useEffect, useRef, useState} from "react";

interface SpinningTextProps {
    translations: string[]
}

export function SpinningText(props: SpinningTextProps) {
    let [value, setValue] = useState(0)
    let animatedValue = useSpring(value)

    let intervalID = useRef(null); //using useRef hook to maintain state changes across rerenders.
    useEffect(() => {

        if (value < 10) {
            // @ts-ignore
            intervalID.current = setInterval(() => {
                setValue((value) => value + 1);

            }, 150)
        }

        // @ts-ignore
        return () => clearInterval(intervalID.current); //clear previous interval when unmounting.
    }, [value]);

    useEffect(() => {
        animatedValue.set(value)
    }, [animatedValue, value])


    return(
        <Grid
            item={true}
            xs
            sx={{
                // width: '300px',
                height: '26px',
                // border: '3px solid blue',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {props.translations.map((translation, index) => {
                return(
                    <TextItem
                        key={index}
                        mv={animatedValue}
                        index={index}
                        text={translation}
                        wrapLength={props.translations.length}
                    />
                )
            })}
        </Grid>
    )
}

interface TextItemProps {
    mv: MotionValue,
    index: number,
    text: string
    wrapLength: number
}

function TextItem(props: TextItemProps){
    let y = useTransform(props.mv, (latest) => {
        let height = 27
        let placeValue = latest % props.wrapLength
        let offset = (props.wrapLength + props.index - placeValue) % props.wrapLength

        let memo = offset * height

        if (offset > 2) {
            memo -= props.wrapLength * height
        }

        return memo;
    })

    return (
        <Grid
            component={motion.div}
            // @ts-ignore
            style={{ y }}
            sx={{
                // border: '1px solid grey',
                position: 'absolute',
            }}
        >
            <Typography
                variant={"h6"}
            >
                {/*Ready to learn something today?*/}
                {props.text}
            </Typography>
        </Grid>
    )

}