import {createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'
import React, {useState} from "react";
import {PartOfSpeech} from "../ts/enums";

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

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
    const [data, setData] = useState<TableWordData[]>(() => [...defaultData])

    const newColumnHelper = createColumnHelper<TableWordData>()

    const columns = [
        newColumnHelper.accessor('partOfSpeech', {
            header: () => 'Part of Speech',
        }),
        newColumnHelper.group({
            header: 'English',
            columns: [
                newColumnHelper.accessor('singularEN', {
                    header: () => 'Singular',
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesEN', {
                    header: () => 'Cases',
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
                    header: () => 'Ainsus Nimetav',
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesEE', {
                    header: () => 'Cases',
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
                    header: () => 'Gender',
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('singularNominativDE', {
                    header: () => 'Singular Nominativ',
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesDE', {
                    header: () => 'Cases',
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
                    header: () => 'Género',
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('singularES', {
                    header: () => 'Singular Nominativ',
                    cell: (info) => info.getValue()
                }),
                newColumnHelper.accessor('registeredCasesDE', {
                    header: () => 'Cases',
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
        <div className="p-2">
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th colSpan={header.colSpan} key={header.id}>
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
                <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </tfoot>
            </table>
        </div>
    )

}