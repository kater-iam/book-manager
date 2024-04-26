import { useList } from "@refinedev/core"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AutoComplete, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { IOptions } from "@/interfaces"
import { useDebounce } from 'use-debounce'

/**
 * 
 * @param string resource - テーブル名を指定
 * @param string searchTarget - 検索対象のカラムを指定
 * @returns 
 */
export const Search = <T extends { id: number, name: string }>({ resource, searchTarget }: { resource: string, searchTarget: string }) => {
    const [value, setValue] = useState<string>("")
    const [options, setOptions] = useState<IOptions[]>([])
    const [debounceValue] = useDebounce(value, 400)

    const { refetch } = useList<T>({
        resource: resource,
        filters: [{ field: searchTarget, operator: "contains", value: value }],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const postOptionGroup = data.data.map((item) =>
                    renderItem(item, resource),
                )
                if (postOptionGroup.length > 0) {
                    setOptions(postOptionGroup)
                }
            },
        },
    })

    useEffect(() => {
        refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValue])

    return (
        <AutoComplete
            style={{ width: "100%" }}
            filterOption={false}
            size="large"
            options={options}
            onSearch={(value) => {
                setValue(value)
            }}
        >
            <Input
                size="large"
                placeholder="検索する"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                suffix={<SearchOutlined />}
            />
        </AutoComplete>
    )
}

const renderItem = <T extends { id: number, name: string }>(item: T, resource: string) => {
    return {
        value: item.id.toString(),
        label: (
            <Link to={`/${resource}/show/${item.id}`}>
                {/* nameはテーブル構造に依存する */}
                <p>{item.name}</p>
            </Link>
        ),
    };
};