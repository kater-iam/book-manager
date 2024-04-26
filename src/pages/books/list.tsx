import { BaseRecord, useTranslate } from "@refinedev/core";
import {
    useTable,
    List,
    EditButton,
    ShowButton,
    DateField,
    DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const BooksList = () => {
    const translate = useTranslate();
    const { tableProps } = useTable({
        syncWithLocation: true,
        sorters: {
            initial: [
                {
                    field: 'updated_at',
                    order: 'desc',
                }
            ]
        },        
    });

    return (
        <List>
            <Table {...tableProps} sticky={true} scroll={{ x: 600 }} rowKey="id">
                <Table.Column
                    dataIndex="name"
                    title={translate("books.fields.name")}
                />
                <Table.Column
                    dataIndex={["updated_at"]}
                    title={translate("books.fields.updated_at")}
                    render={(value: any) => <DateField value={value} format="YYYY.MM.DD" />}
                    width={120}
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title={translate("books.fields.created_at")}
                    render={(value: any) => <DateField value={value} format="YYYY.MM.DD" />}
                    width={120}
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
