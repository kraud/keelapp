import {createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'
import React, {useState} from "react";
import {PartOfSpeech} from "../../ts/enums";
import {Grid, Typography} from "@mui/material";
import globalTheme from "../../theme/theme";
import {TableHeaderCell} from "./ExtraTableComponents";

type TableWordData = {
    id: string,
    // creationDate?: string,
    // lastUpdate?: string,
    partOfSpeech: PartOfSpeech,

    singularNimetavEE?: string, // only required field for Estonian
    registeredCasesEE?: number // amount of cases with data for this language

    singularEN?: string, // only required field for English
    registeredCasesEN?: number

    genderDE?: string, // Only required fields for German
    singularNominativDE?: string,
    registeredCasesDE?: number

    genderES?: string, // Only required fields for German
    singularES?: string,
    registeredCasesES?: number
}

const defaultData: TableWordData[] = [
    {
        id: '123qwe',
        partOfSpeech: PartOfSpeech.noun,

        singularNimetavEE: 'Maja',
        registeredCasesEE: 6,

        singularEN: 'House',
        registeredCasesEN: 2,

        // genderDE: 'die',
        // singularNominativDE: 'Haus',
        // registeredCasesDE: 4,
        //
        // genderES: "la",
        // singularES: "casa",
        // registeredCasesES: 1,
    },
    {
        id: '124asd',
        partOfSpeech: PartOfSpeech.noun,

        genderDE: 'das',
        singularNominativDE: 'Bier',
        registeredCasesDE: 4,

        genderES: "la",
        singularES: "cerveza",
        registeredCasesES: 2,

        // singularNimetavEE: 'õlu',
        // registeredCasesEE: 4,
        //
        // singularEN: 'Cerveza',
        // registeredCasesEN: 2,
    },
    {
        id: '125zxc',
        partOfSpeech: PartOfSpeech.noun,

        singularEN: 'Point',
        registeredCasesEN: 1,

        genderES: "el",
        singularES: "punto",
        registeredCasesES: 1,

        genderDE: 'der',
        singularNominativDE: 'Punkt',
        registeredCasesDE: 4,
    },
]


export function TranslationsTable() {
    const componentStyles = {
        mainGridContainer: {
            padding: '0',

            "& table": {
                // fontSize: '0.8em',
                borderSpacing: '0',
                border: '1px solid black',
                fontFamily: 'Roboto',
                // fontFamily: 'Open Sans',

                "& tr": {
                    // height: '40px !important',
                    maxHeight: '40px',
                    minHeight: '40px',
                    // height: '45px',
                    borderBottom: '2px solid black',
                    '&:last-child': {
                        "& td": {
                            // borderBottom: '2px solid black',
                        },
                    },
                },

                "& th td": {
                    margin: '0',

                    "&:last-child": {
                        borderRight: '0',
                    },
                    "&:first-child": {
                        padding: '0',
                        margin: '0',
                        textAlign: 'center',
                    },
                },
                "& th": {
                    padding: '0.7em 0em 0.3em 0em', // 0 padding on the sides to allow full-width for component inside?
                    borderBottom: `1px solid black`,
                    borderRight: '1px solid black',

                    fontWeight: 'bold',
                    // fontSize: theme.typography.fontSize,
                    fontFamily: 'Roboto',

                    "& svg": {
                        marginBottom: '3px',
                    }
                },
                "& td": {
                    fontWeight: 'bold',
                    fontSize: globalTheme.typography.fontSize,
                    fontFamily: 'Roboto',
                    overflow: 'hidden',
                    flexWrap: 'nowrap',
                    textOverflow: 'ellipsis',
                    height: '40px',
                    maxHeight: '40px',
                    minHeight: '40px',
                    borderLeft: '1px solid #f1f1f1',

                    "&:last-child": {
                        borderRight: '1px solid #f1f1f1',
                    }
                },
            }
        },
    }
    const [data, setData] = useState<TableWordData[]>(() => [...defaultData])

    const newColumnHelper = createColumnHelper<TableWordData>()

    const columns = [
        newColumnHelper.accessor('partOfSpeech', {
            header: () => {
                return(
                    <TableHeaderCell
                        content={
                            <>
                                Part of <br/>
                                Speech
                            </>
                        }
                    />
                )
            },
        }),
        newColumnHelper.group({
            header: 'English',
            columns: [
                newColumnHelper.accessor('singularEN', {
                    header: () => <TableHeaderCell content={'Singular'}/>,
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesEN', {
                    header: () => <TableHeaderCell content={'Cases'}/>,
                    cell: (info) => {
                        if(info! && info.getValue()!){
                            return(`(${info.getValue()})`)
                        } else {
                            return("")
                        }
                    }
                })
            ]
        }),
        newColumnHelper.group({
            header: 'Eesti',
            columns: [
                newColumnHelper.accessor('singularNimetavEE', {
                    header: () => {
                        return(
                            <TableHeaderCell
                                content={
                                    <>
                                        Ainsus <br/>
                                        Nimetav
                                    </>
                                }
                            />
                        )
                    },
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesEE', {
                    header: () => <TableHeaderCell content={'Cases'}/>,
                    cell: (info) => {
                        if(info! && info.getValue()!){
                            return(`(${info.getValue()})`)
                        } else {
                            return("")
                        }
                    }
                })
            ]
        }),
        newColumnHelper.group({
            header: 'Deutsch',
            columns: [
                newColumnHelper.accessor('genderDE', {
                    header: () => <TableHeaderCell content={'Gender'}/>,
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('singularNominativDE', {
                    header: () => {
                        return(
                            <TableHeaderCell
                                content={
                                    <>
                                        Singular <br/>
                                        Nominativ
                                    </>
                                }
                            />
                        )
                    },
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesDE', {
                    header: () => <TableHeaderCell content={'Cases'}/>,
                    cell: (info) => {
                        if(info! && info.getValue()!){
                            return(`(${info.getValue()})`)
                        } else {
                            return("")
                        }
                    }
                })
            ]
        }),
        newColumnHelper.group({
            header: 'Español',
            columns: [
                newColumnHelper.accessor('genderES', {
                    header: () => <TableHeaderCell content={'Género'}/>,
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('singularES', {
                    header: () => <TableHeaderCell content={'Singular'}/>,
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesDE', {
                    header: () => <TableHeaderCell content={'Cases'}/>,
                    cell: (info) => {
                        if(info! && info.getValue()!){
                            return(`(${info.getValue()})`)
                        } else {
                            return("")
                        }
                    }
                })
            ]
        }),
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return(
        <Grid
            container={true}
            spacing={1}
            justifyContent={"flex-start"}
            style={{
                display: 'relative',
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                overflowY: 'hidden',
                maxWidth: 'min-content',
                scrollBehavior: 'smooth',
            }}
        >
            {/* TABLE COMPONENT */}
            <Grid
                item={true}
                sx={
                    componentStyles.mainGridContainer
                }
            >
                <table>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            style={{
                                // background: 'blue',
                            }}
                        >
                            {headerGroup.headers.map(header => (
                                <th
                                    colSpan={header.colSpan}
                                    key={header.id}
                                    style={{
                                        // border: '1px solid red',
                                        // margin: 0,
                                    }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                    {/*<tfoot>*/}
                    {/*{table.getFooterGroups().map(footerGroup => (*/}
                    {/*    <tr key={footerGroup.id}>*/}
                    {/*        {footerGroup.headers.map(header => (*/}
                    {/*            <th key={header.id}>*/}
                    {/*                {header.isPlaceholder*/}
                    {/*                    ? null*/}
                    {/*                    : flexRender(*/}
                    {/*                        header.column.columnDef.footer,*/}
                    {/*                        header.getContext()*/}
                    {/*                    )}*/}
                    {/*            </th>*/}
                    {/*        ))}*/}
                    {/*    </tr>*/}
                    {/*))}*/}
                    {/*</tfoot>*/}
                </table>
            </Grid>
        </Grid>
    )

}