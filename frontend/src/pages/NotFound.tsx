import React from "react";
import {SpinningText} from "../components/SpinningText";
import {Divider, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import {routeVariantsAnimation} from "./management/RoutesWithAnimation";
import {motion} from "framer-motion";
import globalTheme from "../theme/theme";
import Typography from "@mui/material/Typography";
import {getIconByEnvironment} from "../components/GeneralUseComponents";
import {Lang} from "../ts/enums";


export function NotFound() {
    const lessThanSm = useMediaQuery(globalTheme.breakpoints.down("sm"))
    const smallToMid = useMediaQuery(globalTheme.breakpoints.between("sm", "md"))
    const navigate = useNavigate()

    const onClick = () => {
        navigate('/dashboard')
    }

    return(
        <Grid
            component={motion.div} // to implement animations with Framer Motion
            variants={routeVariantsAnimation}
            initial="initial"
            animate="final"
            container={true}
            spacing={1}
            sx={{
                marginTop: globalTheme.spacing(4),
            }}
        >
            <Grid
                container={true}
                justifyContent={"center"}
                item={true}
            >
                <Grid
                    item={true}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'h3',
                                sm: 'h2',
                                md: 'h1',
                            },
                        }}
                    >
                        404: not found
                    </Typography>
                </Grid>
                <Grid
                    item={true}
                    xs={8}
                >
                    <Divider
                        orientation="horizontal"
                        flexItem={true}
                        sx={{
                            "&::before, &::after": {
                                borderColor: "black",
                            },
                        }}
                    >
                        {getIconByEnvironment({})}
                    </Divider>
                </Grid>
            </Grid>
            <Grid
                container={true}
                justifyContent={"center"}
            >
                <Grid
                    item={true}
                >
                    <SpinningText
                        translations={[
                            {language: Lang.EN, label: "Nothing to see here..."},
                            {language: Lang.ES, label: "Nada que ver por aquí..."},
                            {language: Lang.DE, label: "Es gibt hier nichts zu sehen..."},
                            {language: Lang.EE, label: "Siin pole midagi näha..."},
                        ]}
                        variant={
                            (smallToMid)
                                ? 'h6'
                                : (lessThanSm)
                                    ? 'subtitle1'
                                    :'h4' // lg and up
                        }
                        color={"primary"}
                    />
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                    sx={{
                        marginTop: globalTheme.spacing(2),
                    }}
                >

                    <Typography
                        variant={"body2"}
                        onClick={() => {
                            onClick()
                        }}
                        color={'primary'}
                        textAlign={"center"}
                        sx={{
                            cursor: "pointer"
                        }}
                        fontWeight={"bold"}
                    >
                        (click here and go to Dashboard)
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NotFound