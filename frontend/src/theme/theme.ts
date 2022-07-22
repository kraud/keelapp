import { createTheme } from "@mui/material"
import { orange, red } from "@mui/material/colors";

const globalTheme = createTheme({
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
    },
    typography: {
        /*newVariant: {
            fontSize: "6rem",
            color: orange[500]
        }*/
    },
})

declare module '@mui/material/styles' {
    interface TypographyVariants {
        newVariant: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        newVariant?: React.CSSProperties;
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

export default globalTheme