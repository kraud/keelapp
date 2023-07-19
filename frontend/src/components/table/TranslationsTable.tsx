import {createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'
import React, {useEffect, useState} from "react";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {Button, Grid, Switch} from "@mui/material";
import globalTheme from "../../theme/theme";
import {TableDataCell, TableHeaderCell} from "./ExtraTableComponents";
import {toast} from "react-toastify";
import FormControlLabel from "@mui/material/FormControlLabel";
import ReactDOM from 'react-dom/client';

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
    setAllSelectedItems: (items: string[]) => void
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
                    }
                  },
                },
                "& tbody": {
                    "& tr": {
                        "& td": {
                            height: '60px',
                            minWidth: '250px',
                            // color: '#5b5b5b',
                            color: 'black',
                            borderTop: "1px solid transparent",
                            borderBottom: "1px solid transparent",
                            borderRight: "2px solid #f1f1f1",
                            // borderRight: "none",
                            borderLeft: "none",
                            // backgroundImage: 'linear-gradient(180deg, rgba(2, 170, 176, 0.5) 21%, rgba(0, 205, 172, 0.5) 83%)',
                            backgroundImage: 'linear-gradient(180deg, #4481eb 10%, #04befe 90%)',

                            "&:first-of-type": { // "first-child caused a warning
                                borderRight: "2px solid #f1f1f1",
                                // borderRight: "1px solid transparent",
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
                                        content={info.getValue()}
                                        wordGender={info.row.original.genderDE}
                                        displayWordGender={displayGender}
                                        amount={info.row.original.registeredCasesDE}
                                        onlyDisplayAmountOnHover={true}
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
                                        content={info.getValue()}
                                        amount={info.row.original.registeredCasesEE}
                                        onlyDisplayAmountOnHover={true}
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
                                        content={info.getValue()}
                                        amount={info.row.original.registeredCasesEN}
                                        onlyDisplayAmountOnHover={true}
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
                                        content={info.getValue()}
                                        wordGender={info.row.original.genderES}
                                        displayWordGender={displayGender}
                                        amount={info.row.original.registeredCasesES}
                                        onlyDisplayAmountOnHover={true}
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
                    header: () => <TableHeaderCell content={"Type"} sxProps={{cursor: 'default'}}/>,
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
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const [displayGender, setDisplayGender] = useState(true)

    useEffect(() => {
        // this is necessary in order to override a possible new column order,
        // set by moving the columns manually before (check onDrop function)
        table.resetColumnOrder()
        setColumns(createColumns(props.sortedAndSelectedLanguages))
    },[props.sortedAndSelectedLanguages, displayGender])


    let columnBeingDragged: number;

    //@ts-ignore
    const onDragStart = (e: DragEvent<HTMLElement>): void => {

        let image: JSX.Element = (<>
            <Button
                variant={"outlined"}
            >
                DROP ME
            </Button>
        </>)

        let ghost = document.createElement('div')
        ghost.id = "ghost-ID"
        ghost.style.transform = "translate(-10000px, -10000px)"
        ghost.style.position = "absolute"
        document.body.appendChild(ghost)
        e.dataTransfer.setDragImage(ghost, 50, 30)
        //@ts-ignore
        const root = ReactDOM.createRoot(ghost)
        root.render(image)

        columnBeingDragged = Number(e.currentTarget.dataset.columnIndex);
    };

    //@ts-ignore
    const onDrop = (e: DragEvent<HTMLElement>): void => {
        e.preventDefault()
        if(columnBeingDragged !== 0){ // to avoid moving the "type" column.
            const newPosition = Number(e.currentTarget.dataset.columnIndex)
            if(newPosition !== 0){ // to avoid moving INTO the type column
                const currentCols = table.getVisibleLeafColumns().map((c) => c.id)
                const colToBeMoved = currentCols.splice(columnBeingDragged, 1)
                currentCols.splice(newPosition, 0, colToBeMoved[0])
                props.setAllSelectedItems(currentCols)
                table.setColumnOrder(currentCols) // <------------------------here you save the column ordering state
            }
            else {
                toast.error("The Type column can't be moved.")
            }
        } else {
            toast.error("The Type column can't be moved.")
        }
        // clean-up for the element used as an image for the column DnD
        const element = document.getElementById("ghost-ID")
        if(element !== null){
            element.remove()
        }
    }

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
            <Grid
                container={true}
                item={true}
            >
                <FormControlLabel
                    value={displayGender}
                    control={<Switch checked={displayGender} color="primary" />}
                    label="Display gender"
                    labelPlacement="start"
                    onChange={() => setDisplayGender(!displayGender)}
                />
            </Grid>
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
                            {headerGroup.headers.map((header, index) => (
                                <th
                                    colSpan={header.colSpan}
                                    key={header.id}
                                    // start props for column drag&drop reordering
                                    draggable={
                                        !table.getState().columnSizingInfo.isResizingColumn
                                        &&
                                        // TODO: tie this to a table prop
                                        index !== 0 // to avoid moving the "type" column
                                    }
                                    data-column-index={header.index}
                                    onDragStart={(e) => {
                                        // e.preventDefault()
                                        onDragStart(e)
                                    }}
                                    onDragOver={(e): void => {
                                        e.preventDefault()
                                    }}
                                    onDrop={onDrop}
                                    // end props for drag&drop
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