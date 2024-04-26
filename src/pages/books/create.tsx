import { Create, ShowButton, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import Scanner from "@/components/scanner";
import { useEffect, useState } from "react";
import axios from "axios";

export const BooksCreate = () => {
    const translate = useTranslate();
    const { formProps, saveButtonProps } = useForm();
    const [isbn, setIsbn] = useState<string>("")
    const [isShowScanner, setIsShowScanner] = useState<boolean>(false)

    useEffect(() => {
        formProps?.form?.setFieldsValue({ updated_at: dayjs() })
        formProps?.form?.setFieldsValue({ created_at: dayjs() })
    }, [formProps?.form])

    useEffect(() => {
        if (!isbn) return
        if (!isBookIsbn(isbn)) return
        setIsShowScanner(false)

        formProps?.form?.setFieldsValue({ isbn })
        axios
            .get('https://api.openbd.jp/v1/get', { params: { isbn } })
            .then(response => {
                const title = response.data[0].summary.title
                formProps?.form?.setFieldsValue({ name: title })
            })
    }, [isbn, formProps?.form])

    const isBookIsbn = (isbn: string): boolean => {
        // 本のisbnは9と4から始まるらしい
        if (isbn.startsWith("9") || isbn.startsWith("4")) {
            return true
        }
        return false
    }

    return (
        <Create saveButtonProps={saveButtonProps}>
            {isShowScanner && <Scanner onDetected={(result: any) => setIsbn(result)} />}

            <ShowButton
                onClick={() => setIsShowScanner(!isShowScanner)}
                style={{ margin: '0 auto 20px auto', display: 'block' }}
            >
                カメラを起動
            </ShowButton>

            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={translate("books.fields.name")}
                    name={["name"]}
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={translate("books.fields.isbn")}
                    name={["isbn"]}
                    rules={[{ required: true, },]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Create >
    );
};
