import {createTheme, PaletteColor, PaletteColorOptions} from "@mui/material"
import {grey, orange, pink, red} from "@mui/material/colors";
import {white} from "colors";

let globalTheme = createTheme({})

const { palette } = createTheme();
globalTheme = createTheme(globalTheme, {
    palette: {
        /*primary: {
            main: "#ccc",
        },
        secondary: {
            main: orange[300],
        },*/
        /*customColor: {
            main: orange[400],
            dark: orange[800],
            light: orange[100],
        }*/
        allWhite: palette.augmentColor({ color: {
                main: 'rgba(255,255,255,1)',
                dark: 'rgba(255,255,255,1)',
                light: 'rgba(255,255,255,1)',
            } }),
    },
    typography: {
        /*newVariant: {
            fontSize: "6rem",
            color: orange[500]
        }*/
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                maxWidthLg: {
                    [globalTheme.breakpoints.up('lg')]: {
                        maxWidth: "100%"
                    },
                }
            }
        }
    }
})

declare module '@mui/material/styles' {
    interface TypographyVariants {
        newVariant: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        newVariant?: React.CSSProperties;
    }
    interface Palette {
        allWhite: string;
    }
    interface PaletteOptions {
        allWhite: string;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        newVariant: true;
    }
}

declare module "@mui/material/styles/createPalette" {
    interface PaletteOptions {
        customColor?: PaletteColorOptions;
    }
    interface Palette {
        customColor: PaletteColor;
    }
}

declare module "@mui/material" {
    interface ButtonPropsColorOverrides {
        customColor: any;
    }
}
declare module "@mui/material/Radio" {
    interface ButtonPropsColorOverrides {
        allWhite: true;
    }
}

export default globalTheme