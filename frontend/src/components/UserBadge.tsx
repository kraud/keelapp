import globalTheme from "../theme/theme";
import {CircularProgress, Grid, TextField, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React, {useState} from "react";
import {UserBadgeData} from "../pages/Account";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import {DnDLanguageOrderSelector} from "./DnDLanguageOrderSelector";
import {Lang} from "../ts/enums";
import {useTranslation} from "react-i18next";

type EditingProps = {
    isEditing?: boolean // when true => user and username become TextFields
    returnFieldsData?: (fieldsData: UserBadgeData) => void
    isLoading?: boolean
}

type UserBadgeProps = {
    userData: UserBadgeData,
} & EditingProps

export const UserBadge = (props: UserBadgeProps) => {
    const { t } = useTranslation(['common'])
    const theme = useTheme()
    const lessThanMd = useMediaQuery(theme.breakpoints.down("md"))

    const calculateRemainingLanguages = () => {
        const allLanguages = (Object.values(Lang).filter((v) => isNaN(Number(v)))) as unknown as Array<keyof typeof Lang>
        const unselectedLanguages = allLanguages.filter((rawLanguage) => {
            return(
                !(props.userData.languages.includes(rawLanguage as Lang)) // if language is not included in selected list, we save it
            )
        })
        return(unselectedLanguages)
    }

    return(
        <Grid
            container={true}
            justifyContent={"flex-start"}
            item={true}
            xs={12}
            sx={{
                border: '2px solid #0072CE',
                borderRadius: '25px',
                padding: globalTheme.spacing(2),
            }}
        >
            <Grid
                container={true}
                item={true}
                alignItems={"center"}
                xs={9}
                rowSpacing={props.isEditing!! ?2 :undefined}
            >
                <Grid
                    item={true}
                    xs={props.isEditing!! ?10 :12}
                >
                    {(props.isEditing!!)
                        ?
                        <TextField
                            label={t('userData.name', { ns: 'common' })}
                            type={"text"}
                            fullWidth={true}
                            value={props.userData.name}
                            onChange={(value) => {
                                if(props.returnFieldsData !== undefined){
                                    props.returnFieldsData({
                                        ...props.userData,
                                        name: value.target.value,
                                    })
                                }
                            }}
                        />
                        :
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'h4',
                                    md: 'h2',
                                },
                                // textTransform: "capitalize"
                            }}
                        >
                            {props.userData.name}
                        </Typography>
                    }
                </Grid>
                <Grid
                    item={true}
                    xs={props.isEditing!! ?10 :12}
                >
                    {(props.isEditing!!)
                        ?
                        <TextField
                            label={t('userData.username', { ns: 'common' })}
                            type={"text"}
                            fullWidth={true}
                            value={props.userData.username}
                            onChange={(value) => {
                                if(props.returnFieldsData !== undefined){
                                    props.returnFieldsData({
                                        ...props.userData,
                                        username: value.target.value,
                                    })
                                }
                            }}
                        />
                        :
                        <Typography
                            sx={{
                                typography: {
                                    xs: 'h6',
                                    md: 'h4',
                                    textTransform: "capitalize"
                                },
                            }}
                        >
                            {(props.userData.username !== undefined)
                                ? props.userData.username
                                : "-username"
                            }
                        </Typography>
                    }
                </Grid>
                <Grid
                    item={true}
                    xs={12}
                >
                    <Typography
                        sx={{
                            typography: {
                                xs: 'body1',
                                md: 'h5',
                                textTransform: "all-lowercase"
                            },
                        }}
                    >
                        {props.userData.email}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container={true}
                item={true}
                xs={3}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Grid
                    item={true}
                >
                    <Avatar
                        alt="User photo"
                        sx={{
                            width: {
                                xs:'75px',
                                md:'125px',
                            },
                            height: {
                                xs:'75px',
                                md:'125px',
                            },
                        }}
                    />
                    {(props.isLoading) &&
                        <span
                            className={"completePercentageCircle"}
                            style={{
                                position: 'absolute',
                                top: 0,
                                width: (lessThanMd) ?'85px' :'200px',
                                height: (lessThanMd) ?'85px' :'200px',
                            }}
                        >
                            <CircularProgress
                                color={"secondary"}
                                sx={{
                                    zIndex: 100,
                                    marginTop: {
                                        xs:'25px',
                                        md:'16px',
                                    },
                                    marginLeft: {
                                        xs:'-5px',
                                        md:'-13px',
                                    },
                                    width: {
                                        xs:'85px !important',
                                        md:'150px !important',
                                    },
                                    height: {
                                        xs:'85px !important',
                                        md:'150px !important',
                                    },
                                }}
                            />
                        </span>
                    }
                </Grid>
            </Grid>
            <Grid
                item={true}
                container={true}
                justifyContent={"center"}
                xs={12}
            >
                <DnDLanguageOrderSelector
                    allSelectedItems={props.userData.languages as string[]}
                    setAllSelectedItems={(languages: string[]) => {
                        if(props.returnFieldsData !== undefined){
                            props.returnFieldsData({
                                ...props.userData,
                                languages: languages as Lang[],
                            })
                        }
                    }}
                    otherItems={!props.isEditing ?[] : calculateRemainingLanguages()}
                    setOtherItems={(languages: string[]) => null}
                    direction={"horizontal"}
                    singleContainer={!props.isEditing} // we display second container only when editing, to select more languages
                    disabled={!props.isEditing!!}
                    selectedItemsTitle={""}
                    noItemsSelectedMessage={t('userData.errors.notEnoughLanguages', { ns: 'common' })}
                    displayLeftActionButton={{
                        selectedItemLabel: (props.userData.nativeLanguage!!)
                            ? props.userData.nativeLanguage
                            : undefined,
                            // : Lang.ES,
                        onLeftActionButtonClick: (clickedItemLabel: string) => {
                            if (props.returnFieldsData !== undefined) {
                                props.returnFieldsData({
                                    ...props.userData,
                                    nativeLanguage: (props.userData.nativeLanguage === clickedItemLabel)
                                        ? undefined // if we click on the already selected option => we unselect it
                                        : clickedItemLabel as Lang,
                                })
                            }
                        }
                    }}
                    alwaysDoubleRow={true}
                    hideIndex={true}
                    displayItems={'both'}
                    flagSide={'left'}
                />
            </Grid>
        </Grid>
    )
}