import { Create, EditButton, ShowButton, useForm } from "@refinedev/antd"
import { Form, Input } from "antd"
import { useTranslate } from "@refinedev/core"
import dayjs from "dayjs"
import Scanner from "@/components/scanner"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

declare global {
    interface Window {
        receiveBarcode?: (barcode: string) => void
        receiveNfcId?: (tagId: string) => void
        BarcodeReader: { postMessage: (message: string) => void }
        NFCReader: { postMessage: (message: string) => void }
    }
}

export const BooksCreate = () => {
    const translate = useTranslate()
    const { formProps, saveButtonProps } = useForm();
    const [isbn, setIsbn] = useState<string>("")
    const [isShowScanner, setIsShowScanner] = useState<boolean>(false)
    const [nfcId, setNfcId] = useState<string>("")
    const appMode = useSelector((state: RootState) => state.appMode.appMode);

    function receiveBarcode(isbn: string) {
        setIsbn(isbn)
    }
    function receiveNfcId(nfcId: string) {
        setNfcId(nfcId)
    }

    useEffect(() => {
        window.receiveBarcode = receiveBarcode;
        window.receiveNfcId = receiveNfcId;
        return () => {
            delete window.receiveBarcode
            delete window.receiveNfcId
        }
    }, [])

    useEffect(() => {
        formProps?.form?.setFieldsValue({ updated_at: dayjs() })
        formProps?.form?.setFieldsValue({ created_at: dayjs() })
    }, [formProps?.form])

    useEffect(() => {
        if (!nfcId) return
        formProps?.form?.setFieldsValue({ nfc_id: nfcId })
    }, [nfcId, formProps?.form])

    useEffect(() => {
        if (!isbn) return
        formProps?.form?.setFieldsValue({ isbn })
        axios
            .get('https://api.openbd.jp/v1/get', { params: { isbn } })
            .then(response => {
                const title = response.data[0].summary.title
                formProps?.form?.setFieldsValue({ name: title })
            })
    }, [isbn, formProps?.form])

    return (
        <Create saveButtonProps={saveButtonProps}>
            {isShowScanner && <Scanner onDetected={(result: any) => setIsbn(result)} />}

            <Form {...formProps} layout="vertical">
                {appMode && (
                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                        <ShowButton onClick={() => {
                            window.BarcodeReader.postMessage('');
                            setIsShowScanner(!isShowScanner)
                        }}>
                            カメラ起動
                        </ShowButton>
                        <EditButton onClick={() => {
                            window.NFCReader.postMessage('');
                        }}>
                            タグ読み取り
                        </EditButton>
                    </div>
                )}

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
                <Form.Item
                    label={translate("books.fields.nfc_id")}
                    name={["nfc_id"]}
                    rules={[{ required: true, },]}
                >
                    <Input />
                </Form.Item>

            </Form>
        </Create >
    );
};
