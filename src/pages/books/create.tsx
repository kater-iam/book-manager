import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import { useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import Scanner from "@/components/scanner";
import { useEffect, useState } from "react";
import axios from "axios";

export const BooksCreate = () => {
    const translate = useTranslate();
    const { formProps, saveButtonProps, queryResult } = useForm();
    const [isbn, setIsbn] = useState<string>("")

    useEffect(() => {
        formProps?.form?.setFieldsValue({ updated_at: dayjs() })
        formProps?.form?.setFieldsValue({ created_at: dayjs() })
    }, [])

    useEffect(() => {
        if (!isbn) return
        formProps?.form?.setFieldsValue({ isbn })
        axios
            .get('https://api.openbd.jp/v1/get', {
                params: {
                    isbn: isbn
                }
            })
            .then(response => {
                const title = response.data[0].summary.title
                formProps?.form?.setFieldsValue({ name: title })
            })
    }, [isbn])

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Scanner onDetected={(result: any) => {
                setIsbn(result)
            }} />
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={translate("books.fields.name")}
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate("books.fields.updated_at")}
                    name={["updated_at"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label={translate("books.fields.created_at")}
                    name={["created_at"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label={translate("books.fields.isbn")}
                    name={["isbn"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Create>
    );
};
