import * as React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TranslateIcon from '@mui/icons-material/Translate';

const tagSVG = "m 21.41 11.58 l -9 -9 C 12.05 2.22 11.55 2 11 2 H 4 c -1.1 0 -2 0.9 -2 2 v 7 c 0 0.55 0.22 1.05 0.59 1.42 l 9 9 c 0.36 0.36 0.86 0.58 1.41 0.58 c 0.55 0 1.05 -0.22 1.41 -0.59 l 7 -7 c 0.37 -0.36 0.59 -0.86 0.59 -1.41 c 0 -0.55 -0.23 -1.06 -0.59 -1.42 Z M 5.5 7 C 4.67 7 4 6.33 4 5.5 S 4.67 4 5.5 4 S 7 4.67 7 5.5 S 6.33 7 5.5 7 Z"
const wordSVG = "m 12.87 15.07 l -2.54 -2.51 l 0.03 -0.03 c 1.74 -1.94 2.98 -4.17 3.71 -6.53 H 17 V 4 h -7 V 2 H 8 v 2 H 1 v 1.99 h 11.17 C 11.5 7.92 10.44 9.75 9 11.35 C 8.07 10.32 7.3 9.19 6.69 8 h -2 c 0.73 1.63 1.73 3.17 2.98 4.56 l -5.09 5.02 L 4 19 l 5 -5 l 3.11 3.11 l 0.76 -2.04 Z M 18.5 10 h -2 L 12 22 h 2 l 1.12 -3 h 4.75 L 21 22 h 2 l -4.5 -12 Z m -2.62 7 l 1.62 -4.33 L 19.12 17 h -3.24 Z"

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 22 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="m 12.87 15.07 l -2.54 -2.51 l 0.03 -0.03 c 1.74 -1.94 2.98 -4.17 3.71 -6.53 H 17 V 4 h -7 V 2 H 8 v 2 H 1 v 1.99 h 11.17 C 11.5 7.92 10.44 9.75 9 11.35 C 8.07 10.32 7.3 9.19 6.69 8 h -2 c 0.73 1.63 1.73 3.17 2.98 4.56 l -5.09 5.02 L 4 19 l 5 -5 l 3.11 3.11 l 0.76 -2.04 Z M 18.5 10 h -2 L 12 22 h 2 l 1.12 -3 h 4.75 L 21 22 h 2 l -4.5 -12 Z m -2.62 7 l 1.62 -4.33 L 19.12 17 h -3.24 Z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 22 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="m 21.41 11.58 l -9 -9 C 12.05 2.22 11.55 2 11 2 H 4 c -1.1 0 -2 0.9 -2 2 v 7 c 0 0.55 0.22 1.05 0.59 1.42 l 9 9 c 0.36 0.36 0.86 0.58 1.41 0.58 c 0.55 0 1.05 -0.22 1.41 -0.59 l 7 -7 c 0.37 -0.36 0.59 -0.86 0.59 -1.41 c 0 -0.55 -0.23 -1.06 -0.59 -1.42 Z M 5.5 7 C 4.67 7 4 6.33 4 5.5 S 4.67 4 5.5 4 S 7 4.67 7 5.5 S 6.33 7 5.5 7 Z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

