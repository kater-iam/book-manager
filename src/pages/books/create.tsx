import React, { useEffect, useRef } from "react";
import { Create, EditButton, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import { useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import { useScan } from "@/hooks/useScan";

export const BooksCreate = () => {
    const translate = useTranslate();
    const { formProps, saveButtonProps, queryResult } = useForm();
    const { setRef, isbnLoad } = useScan()
    const ref = useRef()

    useEffect(() => {
        if (!ref) return
        setRef(ref)
    }, [ref])

    return (
        <Create saveButtonProps={saveButtonProps}>
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
            <div ref={ref}>
                <EditButton onClick={() => {
                    isbnLoad()
                }}>カメラを起動</EditButton>
            </div>
        </Create>
    );
};
