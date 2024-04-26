import React, { useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import { useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { config } from "@/config";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const BooksEdit = () => {
    const translate = useTranslate();
    const { formProps, saveButtonProps, queryResult } = useForm();
    const booksData = queryResult?.data?.data;

    useDocumentTitle(`${translate("books.titles.edit")} | ${config.title}`)

    useEffect(() => {
        formProps?.form?.setFieldsValue({ updated_at: dayjs().tz('Asia/Tokyo') })
        console.log(formProps?.form)
    }, [formProps?.form])

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={translate("books.fields.id")}
                    name={["id"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input readOnly disabled />
                </Form.Item>
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
                    label={translate("books.fields.updated_at")}
                    name={["updated_at"]}
                    hidden
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    getValueProps={(value) => ({
                        value: dayjs().tz('Asia/Tokyo')
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
        </Edit>
    );
};
