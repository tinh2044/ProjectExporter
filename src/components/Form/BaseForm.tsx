import React from "react";
import { Card, Form, Button, type FormInstance, Collapse, Divider } from "antd";
import { useAppMessage } from "@/contexts/AppMessage/hook";
import { Packer, type Document as DocxDocument } from "docx";

type NamePath = string | number | (string | number)[];

type BaseFormProps = {
  form: FormInstance;
  title: React.ReactNode;
  requiredKeys: NamePath[];
  legalFieldKey?: string;
  legalList?: string[];
  outputFileName: string;
  submitText: string;
  submitIcon?: React.ReactNode;
  children: React.ReactNode;
  cardClassName?: string;
  useCollapse?: boolean;
  collapseDefaultActiveKey?: string[];
  createFormCallBack: (
    form: FormInstance,
    legalList?: string[],
  ) => DocxDocument;
};

export default function BaseForm(props: BaseFormProps) {
  const {
    form,
    title,
    requiredKeys,
    legalList,
    outputFileName,
    submitText,
    submitIcon,
    children,
    cardClassName,
    useCollapse = false,
    createFormCallBack,
    collapseDefaultActiveKey = ["1"],
  } = props;

  const messageApi = useAppMessage();
  const handleGenerate = async () => {
    try {
      await form.validateFields(requiredKeys as never);

      const doc = createFormCallBack(form, legalList || []);
      const blob = await Packer.toBlob(doc);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = outputFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      messageApi.error("Vui lòng nhập đầy đủ các trường có dấu *.");
    }
  };

  const collapseItems = [
    {
      key: "1",
      label: (
        <div className="flex flex-col items-start gap-2">
          <p className="text-3xl font-bold">{title}</p>
          <Divider size="large" />
        </div>
      ),
      children: (
        <>
          <Form form={form} layout="vertical" autoComplete="off">
            {children}
            <Button type="primary" onClick={handleGenerate}>
              {submitIcon}
              {submitText}
            </Button>
          </Form>
        </>
      ),
    },
  ];

  if (useCollapse) {
    return (
      <Card className={`${cardClassName} !w-[98%]`}>
        <Collapse
          items={collapseItems}
          defaultActiveKey={collapseDefaultActiveKey}
          ghost
        />
      </Card>
    );
  }

  return (
    <Card title={title} className={cardClassName}>
      <Form form={form} layout="vertical" autoComplete="off">
        {children}
        <Button type="primary" onClick={handleGenerate}>
          {submitIcon}
          {submitText}
        </Button>
      </Form>
    </Card>
  );
}
