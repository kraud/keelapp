import {
    ColumnSort,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getSortedRowModel,
    Row,
    useReactTable,
} from '@tanstack/react-table'
import React, {useEffect, useState} from "react";
import {Lang, PartOfSpeech} from "../../ts/enums";
import {Button, Grid, Slide, Switch, Typography} from "@mui/material";
import globalTheme from "../../theme/theme";
import {IndeterminateCheckbox, TableDataCell, TableHeaderCell} from "./ExtraTableComponents";
import {toast} from "react-toastify";
import FormControlLabel from "@mui/material/FormControlLabel";
import ReactDOM from 'react-dom/client';
import {DebouncedTextField} from "./DebouncedTextField";
import {useDispatch, useSelector} from "react-redux";
import {deleteWordById, getWordsSimplified} from "../../features/words/wordSlice";
import {Theme} from "@mui/material/styles";
import {SxProps} from "@mui/system";
import {getCurrentLangTranslated} from "../generalUseFunctions";
import {useNavigate} from "react-router-dom";

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
    const [data, setData] = useState<TableWordData[]>(() => [])
    const [globalFilter, setGlobalFilter] = useState("")
    const [rowSelection, setRowSelection] = React.useState({})
    const dispatch = useDispatch()
    const {isLoading, isError, message} = useSelector((state: any) => state.words)
    const navigate = useNavigate()

    useEffect(() => {
        setData(props.data)
    }, [props.data, isLoading])

    const newColumnHelper = createColumnHelper<TableWordData>()

    const [columns, setColumns] = useState<any[]>([])
    // As the order of selected languages changes, so should the order they are displayed on the table
    const createColumns = (selectedLanguagesList: string[]) => {
        const newlySortedColumns = selectedLanguagesList.map((language: string) => {
            let currentLanguageData: {
                accessor: string,
                language: Lang,
                wordGender?: string, // i.e. info.row.original.*genderDE*
                displayWordGender?: boolean,
                amount?: string,  // i.e. info.row.original.*registeredCasesDE*
                onlyDisplayAmountOnHover?: boolean,
                type: "number" | "text" | "other",
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
                        amount: 'registeredCasesEE',  // i.e. info.row.original.*registeredCasesDE*
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
                        amount: 'registeredCasesEN',  // i.e. info.row.original.*registeredCasesDE*
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
                        wordGender: 'genderES', // i.e. info.row.original.*genderDE*
                        displayWordGender: displayGender,
                        amount: 'registeredCasesES',  // i.e. info.row.original.*registeredCasesDE*
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
                {
                    id: 'select',
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
                        />
                    ),
                    // @ts-ignore
                    cell: ({ row }) => (
                        <TableDataCell
                            content={
                                <IndeterminateCheckbox
                                    {...{
                                        checked: row.getIsSelected(),
                                        disabled: !row.getCanSelect(),
                                        indeterminate: row.getIsSomeSelected(),
                                        onChange: row.getToggleSelectedHandler(),
                                    }}
                                />
                            }
                            type={"other"}
                            textAlign={"center"}
                            onlyForDisplay={true}
                        />
                    ),
                },
                newColumnHelper.accessor('partOfSpeech', {
                    header: () =>
                        <TableHeaderCell
                            content={"Type"}
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
                ...newlySortedColumns
            ]
        )
    }

    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [columnFiltersState, setColumnFiltersState] = useState<{ id: string, value: unknown }[]>([])

    const table = useReactTable(
        {
            data,
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
        setColumns(createColumns(props.sortedAndSelectedLanguages))
    },[props.sortedAndSelectedLanguages, displayGender])


    let columnBeingDragged: number

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
    }

    //@ts-ignore
    const onDrop = (e: DragEvent<HTMLElement>): void => {
        e.preventDefault()
        if(
            // TODO: this should be an array and we check if 'includes' column number
            (columnBeingDragged !== 0) && (columnBeingDragged !== 1)
        ){ // to avoid moving the "type" column.
            const newPosition = Number(e.currentTarget.dataset.columnIndex)
            if(
                // TODO: this should be an array and we check if 'includes' column number
                (newPosition !== 0) && (newPosition !== 1)
            ){ // to avoid moving INTO the type column
                const currentCols = table.getVisibleLeafColumns().map((c) => c.id)
                const colToBeMoved = currentCols.splice(columnBeingDragged, 1)
                currentCols.splice(newPosition, 0, colToBeMoved[0])
                props.setAllSelectedItems(currentCols) // this will change the order outside the table, on the DnD selector
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
    const [finishedDeleting, setFinishedDeleting] = useState(true)

    const deleteSelectedRows = () => {
        // rowSelection format:
        // { selectedRowIndex: true } // TODO: should we change it to saving the row info instead?
        Object.keys(rowSelection).forEach((selectionDataIndex: string) => {
            const rowData = data[parseInt(selectionDataIndex)]
            //@ts-ignore
            dispatch(deleteWordById(rowData.id)) // deletes whole word
            setFinishedDeleting(false)
        })
    }

    const goToDetailedView = () => {
        // rowSelection format:
        // { selectedRowIndex: true } // TODO: should we change it to saving the row info instead?
        navigate(`/word/${data[parseInt(Object.keys(rowSelection)[0])].id}`)
    }

    useEffect(() => {
        // isLoading switches back to false once the response from backend is set on redux
        // finishedDeleting will only be false while waiting for a response from backend
        if(!finishedDeleting && !isLoading){
            // closeModal
            toast.success(`Word was deleted successfully`, {
                toastId: "click-on-modal"
            })
            // we reverse to the original state, before sending data to update
            setFinishedDeleting(true)
            //@ts-ignore
            dispatch(getWordsSimplified()) // to update the list of words displayed on the table
            setRowSelection({})
        }
    }, [isLoading, finishedDeleting])

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
                justifyContent={"flex-end"}
                spacing={2}
            >
                {(Object.keys(rowSelection).length > 1) &&
                <Grid
                    item={true}
                    container={true}
                    alignContent={"center"}
                    xs={"auto"}
                >
                    <Grid
                        item={true}
                    >
                        <Button
                            variant={"outlined"}
                            onClick={() => null}
                            color={"secondary"}
                            disabled={true} // TODO: be be implemented soon, will redirect to a version of the Practice screen
                        >
                            Create exercises
                        </Button>
                    </Grid>
                </Grid>
                }
                {(Object.keys(rowSelection).length === 1) &&
                <Grid
                    item={true}
                    container={true}
                    alignContent={"center"}
                    xs={"auto"}
                >
                    <Grid
                        item={true}
                    >
                        <Button
                            variant={"outlined"}
                            onClick={() => goToDetailedView()}
                        >
                            Detailed View
                        </Button>
                    </Grid>
                </Grid>
                }
                {(Object.keys(rowSelection).length > 0) &&
                <Grid
                    item={true}
                    container={true}
                    alignContent={"center"}
                    xs={"auto"}
                >
                    <Grid
                        item={true}
                    >
                        <Button
                            variant={"outlined"}
                            color={"error"}
                            onClick={() => deleteSelectedRows()}
                        >
                            Delete selected
                        </Button>
                    </Grid>
                </Grid>
                }
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