import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BaseRecord, useTranslate, useMany, useUpdate, useCreate } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DateField, CreateButton, DeleteButton, } from "@refinedev/antd";
import { Table, Space } from "antd";
import { supabaseClient } from "@/utility/supabaseClient";

export const LendingsList = () => {
    const translate = useTranslate();
    const { tableProps } = useTable({
        syncWithLocation: true,
        sorters: {
            initial: [
                {
                    field: 'id',
                    order: 'desc',
                }
            ]
        }
    })
    const { data: bookData, isLoading: bookIsLoading } = useMany({
        resource: "books",
        ids: tableProps?.dataSource?.map((item) => item?.book_id) ?? [],
        queryOptions: {
            enabled: !!tableProps?.dataSource,
        },
    });
    
    const [nfcId, setNfcId] = useState<string>("")
    const { mutate: update } = useUpdate()
    const { mutate: create } = useCreate()

    function receiveNfcId(nfcId: string) {
        setNfcId(nfcId)
    }

    useEffect(() => {
        window.receiveNfcId = receiveNfcId;
        return () => {
            delete window.receiveNfcId
        }
    }, [])

    useEffect(() => {
        (async () => {
            if (!nfcId) return
            const bookId = await getBookIdByNfcId(nfcId)
            const lending = await getLendingByBookId(bookId)

            // 返却日が含まれていない場合は返却とする
            if (lending && !lending.returned_at) {
                update({
                    resource: 'lendings',
                    id: lending.id,
                    values: {
                        returned_at: dayjs()
                    }
                })
            }

            // レコードが存在しない、または返却日が含まれている場合は新規作成
            if (!lending || lending.returned_at) {
                create({
                    resource: 'lendings',
                    values: {
                        book_id: bookId,
                        created_at: dayjs()
                    }
                })
            }

            setNfcId('')
        })()
    }, [nfcId, create, update])

    const getBookIdByNfcId = async (nfcId: string) => {
        const { data, error } = await supabaseClient.from('books').select('id').eq('nfc_id', nfcId)
        if (error) throw error
        return data[0].id
    }

    const getLendingByBookId = async (bookId: string) => {
        const { data, error } = await supabaseClient.from('lendings').select('id, book_id, created_at, returned_at').eq('book_id', bookId).order('created_at', { ascending: false }).limit(1);
        if (error) throw error
        return data[0]
    }

    return (
        <List headerButtons={() => {
            return (
                <CreateButton
                    onClick={() => {
                        const nfcId = "E004015306A25FF9"
                        setNfcId(nfcId)
                        // window.NFCReader.postMessage(nfcId)
                    }}
                >
                    借りる・返却する
                </CreateButton>
            )
        }}>
            <Table {...tableProps} sticky={true} scroll={{ x: 600 }} rowKey="id">
                <Table.Column
                    dataIndex={["book_id"]}
                    title={translate("lendings.fields.book_id")}
                    render={(value) =>
                        bookIsLoading ? (
                            <>Loading...</>
                        ) : (
                            bookData?.data?.find((item) => item.id === value)
                                ?.name
                        )
                    }
                />

                <Table.Column
                    dataIndex={["created_at"]}
                    title={translate("lendings.fields.created_at")}
                    render={(value: any) => <DateField value={value} format="YYYY.MM.DD" />}
                />
                <Table.Column
                    dataIndex={["returned_at"]}
                    title={translate("lendings.fields.returned_at")}
                    render={(value: any) => (value ? <DateField value={value} format="YYYY.MM.DD" /> : "-")}
                />
                <Table.Column
                    title={translate("table.actions")}
                    dataIndex="actions"
                    width={120}
                    fixed="right"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
