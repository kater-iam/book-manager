import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Create, EditButton, useSelect, useForm, Edit } from "@refinedev/antd";
import { Form, Select, DatePicker, Input } from "antd";
import { useTranslate } from "@refinedev/core";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"
import { supabaseClient } from "@/utility/supabaseClient";

/**
 * 貸出 or 返却 の処理を行う
 */
export const LendingsCreate = () => {
    const translate = useTranslate();
    const { formProps, saveButtonProps, onFinish, setId, id } = useForm({
        action: "edit"
    });
    const appMode = useSelector((state: RootState) => state.appMode.appMode);
    const { selectProps: bookSelectProps } = useSelect({
        resource: "books",
        optionLabel: "name",
    })
    const [nfcId, setNfcId] = useState<string>("")
    const [isEditMode, setIsEditMode] = useState(false)

    useEffect(() => {
        window.receiveNfcId = receiveNfcId;
        return () => {
            delete window.receiveNfcId
        }
    }, [])

    function receiveNfcId(nfcId: string) {
        setNfcId(nfcId)
    }

    // デバッグ用
    const setDebugNfcId = async () => {
        const nfcId = 'E004015306A25FF9'
        setNfcId(nfcId)
    }



    useEffect(() => {
        const DynamicComponent = isEditMode ? Edit : Create;
    }, [isEditMode])

    useEffect(() => {
        (async () => {
            if (!nfcId) return
            const bookId = await getBookIdByNfcId(nfcId)


            const lending = await getLendingByBookId(bookId)
            console.log(lending)
            // レンタル済みの場合は登録日をセットする
            if (lending.created_at) {
                const dayjsCreatedAt = dayjs(lending.created_at);
                formProps?.form?.setFieldsValue({ created_at: dayjsCreatedAt })
                // レンタル済みなので返却日をセットする
                formProps?.form?.setFieldsValue({ returned_at: dayjs() })
                // setIsEditMode(true)
                setId(lending.id)
            }
            formProps?.form?.setFieldsValue({ nfc_id: nfcId })
            formProps?.form?.setFieldsValue({ book_id: bookId })
        })()
    }, [nfcId, formProps?.form])


    const getBookIdByNfcId = async (nfcId: string) => {
        const { data, error } = await supabaseClient.from('books').select('id').eq('nfc_id', nfcId)
        if (error) throw error
        return data[0].id
    }

    const getLendingByBookId = async (bookId: string) => {
        const { data, error } = await supabaseClient.from('lendings').select('id, book_id, created_at').eq('book_id', bookId).order('created_at', { ascending: false }).limit(1);
        if (error) throw error
        return data[0]
    }

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" onFinish={(values: any) => {
                // nfc_idはデバッグ用なので消す
                delete values.nfc_id
                onFinish(values)
            }}
                initialValues={{
                    created_at: dayjs(),
                }}
            >
                {appMode && (
                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                        <EditButton onClick={() => {
                            window.NFCReader.postMessage('');
                        }}>
                            タグ読み取り
                        </EditButton>
                    </div>
                )}

                {!appMode && (
                    <EditButton onClick={setDebugNfcId}>
                        nfc_idからbook_idを取得するボタン
                    </EditButton>
                )}

                <Form.Item
                    label={translate("lendings.fields.nfc_id")}
                    name={"nfc_id"}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label={translate("lendings.fields.book_id")}
                    name={"book_id"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...bookSelectProps} />
                </Form.Item>
                <Form.Item
                    label={translate("lendings.fields.created_at")}
                    name={"created_at"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label={translate("lendings.fields.returned_at")}
                    name={["returned_at"]}
                >
                    <DatePicker />
                </Form.Item>
            </Form>
        </Create>
    );
};
