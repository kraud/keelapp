import {Lang, PartOfSpeech} from "../../../ts/enums";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {createColumnHelper, Row} from "@tanstack/react-table";
import {IndeterminateCheckbox, TableDataCell, TableHeaderCell} from "../ExtraTableComponents";
import {getCurrentLangTranslated, stringAvatar} from "../../generalUseFunctions";
import React from "react";
import Avatar from "@mui/material/Avatar";
import GroupIcon from '@mui/icons-material/Group';
import {UserData} from "../../../ts/interfaces";
import globalTheme from "../../../theme/theme";
import {Grid} from "@mui/material";

export type TableWordData = {
    id: string,
    user: string,
    creationDate?: string,
    lastUpdate?: string,
    partOfSpeech: PartOfSpeech,
    tags: string[],

    singularNimetavEE?: string, // only required field for Estonian
    registeredCasesEE?: number // amount of cases with data for this language

    singularEN?: string, // only required field for English
    registeredCasesEN?: number

    genderDE?: string, // Only required fields for German
    singularNominativDE?: string,
    registeredCasesDE?: number

    genderES?: string, // Only required fields for Spanish
    singularES?: string,
    registeredCasesES?: number
}

// As the order of selected languages changes, so should the order they are displayed on the table
export const createColumnsReviewTable = (selectedLanguagesList: string[], displayGender: boolean, user: UserData) => {
    const newColumnHelper = createColumnHelper<TableWordData>()

    const newlySortedColumns = selectedLanguagesList.map((language: string) => {
        let currentLanguageData: {
            accessor: string,
            language: Lang,
            wordGender?: string, // i.e. info.row.original.*genderDE*
            displayWordGender?: boolean,
            amount?: string,  // i.e. info.row.original.*registeredCasesDE*
            onlyDisplayAmountOnHover?: boolean,
            type: "array" | "text" | "other",
            sxProps?: SxProps<Theme>,
            enableColumnFilter?: boolean,
            sortingFn?: (prev: Row<TableWordData>, curr: Row<TableWordData>, columnId: string) => void
        }

        switch (language){
            case Lang.DE: {
                currentLanguageData = {
                    accessor: 'dataDE',
                    language: Lang.DE,
                    wordGender: 'genderDE', // i.e. info.row.original.*genderDE*
                    displayWordGender: displayGender,
                    amount: 'registeredCasesDE',  // i.e. info.row.original.*registeredCasesDE*
                    onlyDisplayAmountOnHover: true,
                    type: "text",
                    sxProps: {
                        width: '200px',
                    },
                    enableColumnFilter: false,
                }
                break
            }
            case Lang.EE: {
                currentLanguageData = {
                    accessor: 'dataEE',
                    language: Lang.EE,
                    amount: 'registeredCasesEE',  // i.e. info.row.original.*registeredCasesEE*
                    onlyDisplayAmountOnHover: true,
                    type: "text",
                    sxProps: {
                        width: '200px',
                    },
                    enableColumnFilter: false,
                }
                break
            }

            case Lang.EN: {
                currentLanguageData = {
                    accessor: 'dataEN',
                    language: Lang.EN,
                    amount: 'registeredCasesEN',  // i.e. info.row.original.*registeredCasesEN*
                    onlyDisplayAmountOnHover: true,
                    type: "text",
                    sxProps: {
                        width: '200px',
                    },
                    enableColumnFilter: false,
                }
                break
            }

            case Lang.ES: {
                currentLanguageData = {
                    accessor: 'dataES',
                    language: Lang.ES,
                    wordGender: 'genderES', // i.e. info.row.original.*genderES*
                    displayWordGender: displayGender,
                    amount: 'registeredCasesES',  // i.e. info.row.original.*registeredCasesES*
                    onlyDisplayAmountOnHover: true,
                    type: "text",
                    sxProps: {
                        width: '200px',
                    },
                    enableColumnFilter: false,
                }
                break
            }

            default: {
                currentLanguageData = {
                    accessor: 'missing-data',
                    language: Lang.EN,
                    type: "other",
                }
            }
        }

        return(
            //@ts-ignore
            newColumnHelper.accessor(currentLanguageData.accessor,{
                header: (info) =>
                    <TableHeaderCell
                        content={getCurrentLangTranslated(currentLanguageData.language)}
                        column={info.column}
                        sxProps={{
                            background: 'white',
                            zIndex: 1000,
                            position: 'relative',
                        }}

                    />,
                cell: (info) => {return(
                    <TableDataCell
                        language={currentLanguageData.language}
                        partOfSpeech={info.row.original.partOfSpeech}
                        wordId={info.row.original.id}
                        content={info.getValue()}
                        wordGender={(currentLanguageData.wordGender !== undefined)
                            //@ts-ignore
                            ? info.row.original[currentLanguageData.wordGender]
                            : undefined
                        }
                        displayWordGender={currentLanguageData.displayWordGender!}
                        //@ts-ignore
                        amount={(currentLanguageData.amount !== undefined) ?info.row.original[currentLanguageData.amount] :undefined}
                        onlyDisplayAmountOnHover={currentLanguageData.onlyDisplayAmountOnHover!}
                        type={currentLanguageData.type}
                        sxProps={currentLanguageData.sxProps}
                    />
                )},
                enableColumnFilter: currentLanguageData.enableColumnFilter!,
            })
        )
    })
    return (
        [
            // {
            //     id: 'select',
            newColumnHelper.accessor('user', {
                // @ts-ignore
                header: ({ table }) => (
                    <TableDataCell
                        content={
                            <IndeterminateCheckbox
                                {...{
                                    checked: table.getIsAllRowsSelected(),
                                    indeterminate: table.getIsSomeRowsSelected(),
                                    onChange: table.getToggleAllRowsSelectedHandler(),
                                }}
                            />
                        }
                        type={"other"}
                        textAlign={"center"}
                        onlyForDisplay={true}
                        sxProps={{
                            paddingLeft: globalTheme.spacing(  6),
                            paddingRight: globalTheme.spacing(  2),
                        }}
                    />
                ),
                // @ts-ignore
                cell: ({ row, getValue }) => (
                    <TableDataCell
                        content={
                            <Grid
                                container={true}
                            >
                                <Grid
                                    item={true}
                                    xs
                                    sx={{
                                        alignContent: 'center'
                                    }}
                                >
                                    {(getValue() === user._id)
                                        // TODO: create avatar wrapper to include a tooltip with username?
                                        ? <Avatar
                                            alt="User photo"
                                            src={(user) ? "" : "/"}
                                            {...stringAvatar((user!!) ?user.name :"-")}
                                            sx={{
                                                width: '30px',
                                                height: '30px',
                                                fontSize: '1.1rem'
                                            }}
                                        />
                                        :
                                        <GroupIcon/>
                                    }
                                </Grid>
                                <Grid
                                    item={true}
                                    xs
                                >
                                    <IndeterminateCheckbox
                                        {...{
                                            checked: row.getIsSelected(),
                                            disabled: !row.getCanSelect(),
                                            indeterminate: row.getIsSomeSelected(),
                                            onChange: row.getToggleSelectedHandler(),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        }
                        type={"other"}
                        textAlign={"center"}
                        onlyForDisplay={true}
                        sxProps={{
                            paddingLeft: globalTheme.spacing(1),
                            paddingRight: globalTheme.spacing(2),
                        }}
                    />
                ),
                enableColumnFilter: false,
                enableSorting: false,
            }),
            newColumnHelper.accessor('partOfSpeech', {
                header: ({column}) =>
                    <TableHeaderCell
                        content={"Type"}
                        column={column}
                        sxProps={{
                            cursor: 'default',
                            background: 'white',
                            zIndex: 1000,
                            position: 'relative',
                        }}
                    />,
                cell: (info) => {return(
                    (info.getValue() !== undefined)
                        ?
                        <TableDataCell
                            content={info.getValue()}
                            type={"text"}
                            textAlign={"center"}
                            onlyForDisplay={true}
                        />
                        :
                        ""
                )},
                enableColumnFilter: false,
            }),
            ...newlySortedColumns,
            newColumnHelper.accessor('tags', {
                header: () =>
                    <TableHeaderCell
                        content={"Tags"}
                        sxProps={{
                            cursor: 'default',
                            background: 'white',
                            zIndex: 1000,
                            position: 'relative',
                        }}
                    />,
                cell: (info) => {
                    return(
                        (info.getValue() !== undefined)
                            ?
                            <TableDataCell
                                content={info.getValue()}
                                wordId={info.row.original.id}
                                type={"array"}
                                textAlign={"center"}
                                onlyForDisplay={false}
                                sxProps={{
                                    minWidth: "50px"
                                }}
                                onlyDisplayAmountOnHover={true}
                            />
                            :
                            ""
                    )
                },
                enableColumnFilter: false,
                enableSorting: false,
            }),
        ]
    )
}
