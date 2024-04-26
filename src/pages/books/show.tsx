import React from "react";
import { useShow, useTranslate } from "@refinedev/core";
import {
    Show,
    NumberField,
    TagField,
    TextField,
    DateField,
} from "@refinedev/antd";
import { Typography } from "antd";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { config } from "@/config";

const { Title } = Typography;

export const BooksShow = () => {
    const translate = useTranslate();
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    useDocumentTitle(`${translate("books.titles.show")} | ${config.title}`)

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>{translate("books.fields.id")}</Title>
            <NumberField value={record?.id ?? ""} />
            <Title level={5}>{translate("books.fields.name")}</Title>
            <TextField value={record?.name} />
            <Title level={5}>{translate("books.fields.updated_at")}</Title>
            <DateField value={record?.updated_at} format="YYYY.MM.DD" />
            <Title level={5}>{translate("books.fields.created_at")}</Title>
            <DateField value={record?.created_at} format="YYYY.MM.DD" />
            <Title level={5}>{translate("books.fields.isbn")}</Title>
            <TextField value={record?.isbn ?? ""} />
        </Show>
    );
};
