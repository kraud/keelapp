import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TranslateIcon from '@mui/icons-material/Translate';

const primaryDark = '#1D394F';
const primaryDeep = '#587A95';
const primaryPale = '#F6F8F8';
const primaryLight = '#E0E7EB';

const BaseSwitch = styled(Switch)({
    width: 45,
    height: 22,
    padding: 0,
    display: 'flex',
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(23px)',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: primaryPale
            }
        }
    },
    '& .MuiSwitch-thumb': {
        width: 18,
        height: 18,
        borderRadius: '25px',
        backgroundColor: primaryDark
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        borderRadius: '25px',
        border: `1px solid ${primaryLight}`,
        backgroundColor: primaryPale,
        boxSizing: 'border-box'
    }
});

const convertSvg = (svg: React.ReactElement) => {
    const markup = renderToStaticMarkup(svg);
    const encoded = encodeURIComponent(markup);
    const dataUri = `url('data:image/svg+xml;utf8,${encoded}')`;
    console.log('dataUri', dataUri)
    return dataUri;
}

export const SwitchWithIcons = styled(BaseSwitch)({
    // track
    '& .MuiSwitch-track': {
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
            top: 11
        },
        '&:before': {
            backgroundImage: convertSvg(<LocalOfferIcon color={"primary"} />),
            left: 3
        },
        '&:after': {
            backgroundImage: convertSvg(<TranslateIcon color={"primary"} />),
            right: 3
        }
    },
    // thumb
    '& .MuiSwitch-thumb:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: convertSvg(<LocalOfferIcon color={"primary"} />)
    },
    '& .MuiSwitch-switchBase': {
        '&.Mui-checked': {
            '& .MuiSwitch-thumb:before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: convertSvg(<TranslateIcon color={"primary"} />)
            }
        }
    }
})

//
// export default function StyledSwitch(props: StyledSwitchProps) {
//     return (
//         <Stack padding="4px" spacing="8px" bgcolor="gray">
//             <div>
//                 Base
//                 <BaseSwitch />
//             </div>
//             <div>
//                 SwitchWithIcons
//                 <SwitchWithIcons />
//             </div>
//         </Stack>
//     );
// }
