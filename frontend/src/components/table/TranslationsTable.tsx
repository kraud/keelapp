import {ColumnResizeMode, createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'
import React, {useEffect, useState} from "react";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {Grid} from "@mui/material";
import globalTheme from "../../theme/theme";
import {TableDataCell, TableHeaderCell} from "./ExtraTableComponents";

type TableWordData = {
    id: string,
    creationDate?: string,
    lastUpdate?: string,
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

interface TranslationsTableProps {
    sortedAndSelectedLanguages: string[]
    data: any
}

export function TranslationsTable(props: TranslationsTableProps) {
    const componentStyles = {
        mainGridContainer: {
            padding: '0',

            "& table": {
                // fontSize: '0.8em',
                // borderSpacing: '0',
                borderCollapse: 'separate',
                borderSpacing: '0px 20px',

                fontFamily: 'Roboto',

                // "& th td": {
                //     margin: '0',
                //
                //     "&:last-child": {
                //         borderRight: '0',
                //     },
                //     "&:first-child": {
                //         padding: '0',
                //         margin: '0',
                //         textAlign: 'center',
                //     },
                // },
                // THIS WORKS
                "& thead": {
                        "& tr": {
                    "& th": {
                        border: "none",
                        borderRadius: "25px",
                    }
                  },
                },
                "& tbody": {
                    "& tr": {
                        "& td": {
                            height: '60px',
                            minWidth: '250px',
                            color: '#5b5b5b',
                            borderTop: "1px solid transparent",
                            borderBottom: "1px solid transparent",
                            borderRight: "none",
                            borderLeft: "none",
                            backgroundImage: 'linear-gradient(180deg, rgba(2, 170, 176, 0.5) 21%, rgba(0, 205, 172, 0.5) 83%)',

                            "&:first-child": {
                                borderRight: "1px solid transparent",
                                borderLeft: "1px solid transparent",
                                borderRadius: '25px 0px 0px 25px',
                            },
                            "&:last-child": {
                                borderLeft: "none",
                                borderRight: "1px solid transparent",
                                borderRadius: '0px 25px 25px 0px',
                            },
                        },
                    }
                },
                "& th": {
                    padding: '0.7em 0em 0.7em 0em', // 0 padding on the sides to allow full-width for component inside?
                    borderBottom: `1px solid black`,
                    borderRight: '1px solid black',
                    "&:last-child": {
                        borderRight: 'none',
                    },
                    "& svg": {
                        marginBottom: '3px',
                    }
                },
                "& td": {
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
    const [data, setData] = useState<TableWordData[]>(() => [])

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const newColumnHelper = createColumnHelper<TableWordData>()

    const [columns, setColumns] = useState<any[]>([])
    // As the order of selected languages changes, so should the order they are displayed on the table
    const createColumns = (selectedLanguagesList: string[]) => {
        const newlySortedColumns = selectedLanguagesList.map((language: string) => {
            switch (language){
                case Lang.DE: {
                    return(
                        newColumnHelper.accessor('singularNominativDE',{
                            header: () => <TableHeaderCell content={'Deutsch'}/>,
                            cell: (info) => {return(
                                (info.getValue() !== undefined)
                                    ?
                                    <TableDataCell
                                        content={`${info.row.original.genderDE} ${info.getValue()} (${info.row.original.registeredCasesDE})`}
                                        type={"text"}
                                    />
                                    :
                                    ""
                            )}
                        })
                    )
                }
                case Lang.EE: {
                    return(
                        newColumnHelper.accessor('singularNimetavEE',{
                            header: () => <TableHeaderCell content={'Eesti'}/>,
                            cell: (info) => {return(
                                (info.getValue() !== undefined)
                                    ?
                                    <TableDataCell
                                        content={`${info.getValue()} (${info.row.original.registeredCasesEE})`}
                                        type={"text"}
                                    />
                                    :
                                    ""
                            )}
                        })
                    )
                }
                case Lang.EN: {
                    return(
                        newColumnHelper.accessor('singularEN',{
                            header: () => <TableHeaderCell content={'English'}/>,
                            cell: (info) => {return(
                                (info.getValue() !== undefined)
                                    ?
                                    <TableDataCell
                                        content={`${info.getValue()} (${info.row.original.registeredCasesEN})`}
                                        type={"text"}
                                    />
                                    :
                                    ""
                            )}
                        })
                    )
                }
                case Lang.ES: {
                    return(
                        newColumnHelper.accessor('singularES',{
                            header: () => <TableHeaderCell content={'Español'}/>,
                            cell: (info) => {return(
                                (info.getValue() !== undefined)
                                    ?
                                    <TableDataCell
                                        content={`${info.row.original.genderES} ${info.getValue()} (${info.row.original.registeredCasesES})`}
                                        type={"text"}
                                    />
                                    :
                                    ""
                            )}
                        })
                    )
                }
            }
        })
        return (
            [
                newColumnHelper.accessor('partOfSpeech', {
                    header: () => <TableHeaderCell content={"Type"}/>,
                    cell: (info) => {return(
                        (info.getValue() !== undefined)
                            ?
                            <TableDataCell
                                content={info.getValue()}
                                type={"text"}
                                textAlign={"center"}
                            />
                            :
                            ""
                    )}
                }),
                ...newlySortedColumns
            ]
        )
    }

    useEffect(() => {
        setColumns(createColumns(props.sortedAndSelectedLanguages))
    },[props.sortedAndSelectedLanguages])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return(
        <Grid
            container={true}
            item={true}
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
                        >
                            {headerGroup.headers.map(header => (
                                <th
                                    colSpan={header.colSpan}
                                    key={header.id}
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
                    {table.getRowModel().rows.map((row, index) => (
                        <tr
                            key={row.id}
                            style={{
                                backgroundImage: (index%2 === 1)
                                    ? 'linear-gradient(180deg, rgba(0, 205, 172, 0.5) 61%, rgba(2, 170, 176, 0.5) 85%)'
                                    : 'default'
                            }}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Grid>
        </Grid>
    )

}