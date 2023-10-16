import {
    ColumnSort,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React, {useEffect, useState} from "react";
import {Button, Grid, Slide, Switch, Typography} from "@mui/material";
import globalTheme from "../../theme/theme";
import {toast} from "react-toastify";
import FormControlLabel from "@mui/material/FormControlLabel";
import ReactDOM from 'react-dom/client';
import {DebouncedTextField} from "./DebouncedTextField";
import {useSelector} from "react-redux";
import {PropsButtonData} from "../../ts/interfaces";
import {createColumnsReviewTable, TableWordData} from "./columns/ReviewTableColumns";

interface TranslationsTableProps {
    sortedAndSelectedLanguages: string[]
    rowData: any
    calculateColumns: (displayGender: boolean) => unknown[]
    setOrderColumns: (items: string[]) => void

    displayGlobalSearch?: boolean
    partsOfSpeech?: string[]
    customButtonList?: PropsButtonData[]
}

export function TranslationsTable(props: TranslationsTableProps) {
    const componentStyles = {
        mainGridContainer: {
            padding: '0',
            overflowY: 'hidden',

            "& table": {
                borderCollapse: 'collapse',
                fontFamily: 'Roboto',

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
                            padding: 0,
                            "&:nth-of-type(even)": {
                                "& .tdContainer": {
                                    background: '#c7c7c7',
                                },
                            },
                            "&:first-of-type": { // "first-child caused a warning
                                "& .tdContainer": {
                                    borderLeft: "2px solid black",
                                    borderRadius: '25px 0px 0px 25px',
                                },
                            },
                            "&:last-child": {
                                "& .tdContainer": {
                                    borderRight: "2px solid black",
                                    borderRadius: '0px 25px 25px 0px',
                                },
                            },
                            "& .tdContainer": {
                                height: '40px',
                                minWidth: 'max-content',
                                color: 'black',
                                borderTop: "2px solid black",
                                borderBottom: "2px solid black",
                                "& .completePercentageCircle": {
                                    "& svg": {
                                        height: '30px',
                                        width: '30px',
                                    },
                                },
                                "& .smallerIconCompletePercentage": {
                                    "& svg": {
                                        height: '25px',
                                        width: '25px',
                                    },
                                },
                            },
                        },
                    }
                },
                "& th": {
                    padding: `${globalTheme.spacing(1)} 0 ${globalTheme.spacing(1)} 0`, // 0 padding on the sides to allow full-width for component inside?
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
                },
            }
        },
    }
    const [rowData, setRowData] = useState<TableWordData[]>(() => [])
    const [globalFilter, setGlobalFilter] = useState("")
    const [rowSelection, setRowSelection] = React.useState({})
    const {isLoading, isError, message} = useSelector((state: any) => state.words)

    useEffect(() => {
        setRowData(props.rowData)
    }, [props.rowData, isLoading])


    const [columns, setColumns] = useState<any[]>([])
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [columnFiltersState, setColumnFiltersState] = useState<{ id: string, value: unknown }[]>([])

    const table = useReactTable(
        {
            data: rowData,
            columns,
            state: {
                globalFilter: globalFilter,
                columnFilters: columnFiltersState,
                sorting: sorting,
                rowSelection: rowSelection,
            },
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            onGlobalFilterChange: setGlobalFilter,
            onSortingChange: setSorting,
            getSortedRowModel: getSortedRowModel(),
            onColumnFiltersChange: setColumnFiltersState,
            enableRowSelection: true, //enable row selection for all rows
            onRowSelectionChange: setRowSelection,
        },
    )

    const [displayGender, setDisplayGender] = useState(true)

    useEffect(() => {
        // this is necessary in order to override a possible new column order,
        // set by moving the columns manually before (check onDrop function)
        table.resetColumnOrder()
        setColumns(props.calculateColumns(displayGender))
        // setColumns(createColumnsReviewTable(props.sortedAndSelectedLanguages, displayGender))
    },[props.sortedAndSelectedLanguages, displayGender])


    let columnBeingDragged: number

    //@ts-ignore
    const onDragStart = (e: DragEvent<HTMLElement>): void => {
        // TODO: replace dragging image?
        // let image: JSX.Element = (<>
        //     <Button
        //         variant={"outlined"}
        //     >
        //         DROP ME
        //     </Button>
        // </>)
        //
        // let ghost = document.createElement('div')
        // ghost.id = "ghost-ID"
        // ghost.style.transform = "translate(-10000px, -10000px)"
        // ghost.style.position = "absolute"
        // document.body.appendChild(ghost)
        // e.dataTransfer.setDragImage(ghost, 50, 30)
        // //@ts-ignore
        // const root = ReactDOM.createRoot(ghost)
        // root.render(image)

        columnBeingDragged = Number(e.currentTarget.dataset.columnIndex);
    }

    //@ts-ignore
    const onDrop = (e: DragEvent<HTMLElement>): void => {
        const lastColumnIndex = ((props.sortedAndSelectedLanguages).length + 2)
        e.preventDefault()
        if(
            // TODO: this should be an array and we check if 'includes' column number
            (columnBeingDragged !== 0) &&
            (columnBeingDragged !== 1) &&
            // this refers to the last column ("tags"). We only do +1, because index for columnBeingDragged starts at 0
            (columnBeingDragged !== lastColumnIndex)
        ){ // to avoid moving the "checkbox-select" or "type" column.
            const newPosition = Number(e.currentTarget.dataset.columnIndex)
            if(
                // TODO: this should be an array and we check if 'includes' column number
                (newPosition !== 0) &&
                (newPosition !== 1) &&
                (newPosition !== lastColumnIndex)
            ){ // to avoid moving INTO the select/type/tag column
                const currentCols = table.getVisibleLeafColumns().map((c) => c.id)
                // TODO: do something with the last column here?
                const colToBeMoved = currentCols.splice(columnBeingDragged, 1)
                currentCols.splice(newPosition, 0, colToBeMoved[0])
                props.setOrderColumns(currentCols) // this will change the order outside the table, on the DnD selector
                // TODO: more testing on edge cases for column order? Next line might be redundant
                // table.setColumnOrder(currentCols) // this will change the internal column order
            }
            else {
                toast.error("Columns can't be placed there.")
            }
        } else {
            toast.error("This column can't be moved.")
        }
        // clean-up for the element used as an image for the column DnD
        const element = document.getElementById("ghost-ID")
        if(element !== null){
            element.remove()
        }
    }

    useEffect(() => {
        if(isError){
            toast.error(`Something went wrong: ${message}`, {
                toastId: "click-on-modal"
            })
        }
    }, [isError, message])

    return(
        <Grid
            container={true}
            item={true}
            spacing={1}
            xs={12}
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
                direction={{
                    xs: "row",
                    lg: "row-reverse",
                }}
                justifyContent={"flex-end"}
                spacing={2}
            >
                {(props.customButtonList !== undefined) &&
                    (props.customButtonList).map((button: PropsButtonData, index: number) => {
                        if (
                            (button.isVisible !== false) &&
                            (
                                (button.displayBySelectionAmount === undefined)
                                ||
                                (button.displayBySelectionAmount(Object.keys(rowSelection).length))
                            )
                        ) {
                            return(
                                <Grid
                                    key={index}
                                    item={true}
                                    container={true}
                                    alignContent={"center"}
                                    xs={"auto"}
                                >
                                    <Button
                                        variant={(!! button.variant) ?button.variant :"contained"}
                                        color={(!! button.color) ?button.color :"primary"}
                                        //
                                        disabled={(button.calculateDisabled !== undefined)
                                            ? button.calculateDisabled(rowSelection)
                                            : (button.disabled !== undefined)
                                                ? button.disabled
                                                : false
                                        }
                                        fullWidth={true}
                                        onClick={() => {
                                            if(button.setSelectionOnClick!!){
                                                // if setSelectionOnClick is true then:
                                                // after performing onClick function, return value must be set as selectedRows
                                                // @ts-ignore
                                                setRowSelection(button.onClick!(rowSelection))
                                            } else {
                                                // if setSelectionOnClick is undefined => we simply perform onClick function
                                                button.onClick!(rowSelection)
                                            }
                                        }}
                                    >
                                        {button.label}
                                    </Button>
                                </Grid>
                            )
                        }
                    })
                }
                {((props.partsOfSpeech !== undefined) && (props.partsOfSpeech.includes("Noun"))) &&
                    <Grid
                        item={true}
                        container={true}
                        alignContent={"center"}
                        xs={"auto"}
                    >
                        <Grid
                            item={true}
                        >
                            <FormControlLabel
                                value={displayGender}
                                control={<Switch checked={displayGender} color="primary" />}
                                label={"Display gender"}
                                labelPlacement={"start"}
                                onChange={() => setDisplayGender(!displayGender)}
                                sx={{
                                    marginLeft: 0,
                                }}
                            />
                        </Grid>
                    </Grid>
                }
                {/* TODO: add toggle by prop, to display/hide global search?*/}
                {(props.displayGlobalSearch!!) &&
                    <Grid
                        item={true}
                    >
                        <DebouncedTextField
                            value={globalFilter}
                            onChange={(e: any) => setGlobalFilter(e)}
                            debounce={750}
                            placeholder={"Search all columns..."}
                        />
                    </Grid>
                }
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
                                    onClick={header.column.getToggleSortingHandler()}
                                    colSpan={header.colSpan}
                                    key={header.id}
                                    // start props for column drag&drop reordering
                                    draggable={
                                        !table.getState().columnSizingInfo.isResizingColumn
                                        &&
                                        // TODO: tie this to a table prop
                                        index !== 0 // to avoid moving the "select" column
                                        &&
                                        index !== 1 // to avoid moving the "type" column
                                        &&
                                        index !== (((props.sortedAndSelectedLanguages).length + 2)) // idem tags
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
                                    {header.column.getCanFilter()
                                        ?
                                        //@ts-ignore
                                        (header.column.columnDef.meta!)
                                            //@ts-ignore
                                            ? header.column.columnDef.meta.filterComponent()
                                            : null

                                        : null
                                    }
                                    {/* Testing filter - delete later */}
                                    {header.column.getCanFilter() ? (
                                        <DebouncedTextField
                                            value={(header.column.getFilterValue() ?? '') as string}
                                            onChange={value => header.column.setFilterValue(value)}
                                        />
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <Slide
                        in={(table.getRowModel().rows.length > 0)}
                        direction="down"
                        mountOnEnter
                        unmountOnExit
                        timeout={650}
                    >
                        <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr
                                key={row.id}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        <div
                                            className={"tdContainer"}
                                            style={{
                                                marginTop: '5px',
                                                marginBottom: '5px',
                                                boxShadow: row.getIsSelected()
                                                    ? 'inset 0 0 0 1000px rgba(0,114,206,.25)'
                                                    : undefined,
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </Slide>
                </table>
                {(table.getRowModel().rows.length === 0) &&
                    <Grid
                        container={true}
                        justifyContent={"center"}
                        sx={{
                            border: '2px solid black',
                            borderRadius: '25px',
                            background: '#e1e1e1',
                            padding: globalTheme.spacing(2),
                            marginTop: globalTheme.spacing(1),
                        }}
                    >
                        <Grid
                            item={true}
                        >
                            <Typography
                                variant={'h3'}
                                color={'primary'}
                            >
                                {(isLoading)
                                    ? 'Loading...'
                                    : 'No data to display'
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Grid>
    )

}