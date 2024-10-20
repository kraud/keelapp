import {Grid} from "@mui/material";
import React, {useEffect} from "react";
import globalTheme from "../theme/theme";
import Button from "@mui/material/Button";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface LadoLogoProps {
    width: number, // in px
    variant: 'filled' | 'border',
    color: 'primary' | 'white',
    direction: 'horizontal' | 'vertical'
    type: 'icon' | 'logo',
    sxProps?: SxProps<Theme>,
}

export const LaduLogo = (props: LadoLogoProps) => {

    const logoURLs = {
        "logo": {
            "horizontal" : {
                "filled" : {
                    "primary" : '/LOGO-hor-blue-filled.png',
                    "white" : '/LOGO-hor-white-filledV2.png',
                },
                "border" : {
                    "primary" : '/', // TODO: MISSING
                    "white" : '/', // TODO: MISSING
                },
            },
            "vertical" : {
                "filled" : {
                    "primary" : '/LOGO-vert-blue-filled.png',
                    "white" : '/',  // TODO: MISSING
                },
                "border" : {
                    "primary" : '/LOGO-vert-blue-border.png',
                    "white" : '/', // TODO: MISSING
                },
            },
        },
        "icon": {
            "filled" : {
                "primary" : '/icon-filled-blue.png',
                "white" : '/', // TODO: MISSING
            },
            "border" : {
                "primary" : '/icon-border-blue.png', // TODO: MISSING
                "white" : '/', // TODO: MISSING
            },
        }
    }

    const relevantURL = (props.type === 'icon')
        ? logoURLs['icon'][props.variant][props.color]
        : logoURLs['logo'][props.direction][props.variant][props.color]

    useEffect(() => {
        console.log('logoURL:', relevantURL)
    })

    return(
        <Grid
            container={true}
            item={true}
            justifyContent={'center'}
            xs={'auto'}
            sx={{
                ...props.sxProps
            }}
        >
            <Grid
                item={true}
            >
                <Button
                    variant={'text'}
                    // size={'small'}
                    onClick={() => null}
                >
                    <img
                        // src={"/LOGO-hor-white-border.png"}
                        src={relevantURL}
                        alt="Logo"
                        style={{
                            maxWidth: (props.width) ?? '95px'
                        }}
                    />
                </Button>
            </Grid>
        </Grid>
    )
}