import React from "react";
import { Card, Form, Button, type FormInstance, message, Collapse } from "antd";
// import {ArrowDownOutlined, RightCircleOutlined} from "@ant-design/icons";
import {
  buildDocxData,
  applyLegalIndicesToText,
  applyYearRange,
  applyMoneyFields,
  type PlainData,
} from "@/utils/formatters";
import { generateDocxFromTemplateUrl } from "@/services/docx";

type NamePath = string | number | (string | number)[];

type BaseFormProps = {
  form: FormInstance;
  title: React.ReactNode;
  requiredKeys: NamePath[];
  legalFieldKey?: string;
  legalList?: string[];
  templateRelativeUrl: string;
  outputFileName: string;
  submitText: string;
  submitIcon?: React.ReactNode;
  beforeBuild?: (raw: PlainData) => void;
  additionalTransforms?: Array<(d: PlainData) => void>;
  children: React.ReactNode;
  cardClassName?: string;
  useCollapse?: boolean;
  collapseDefaultActiveKey?: string[];
};

export default function BaseForm(props: BaseFormProps) {
  const {
    form,
    title,
    requiredKeys,
    legalFieldKey,
    legalList,
    templateRelativeUrl,
    outputFileName,
    submitText,
    submitIcon,
    beforeBuild,
    additionalTransforms,
    children,
    cardClassName,
    useCollapse = false,
    collapseDefaultActiveKey = ['1'],
  } = props;

  const [messageApi, contextHolder] = message.useMessage();

  const handleGenerate = async () => {
    try {
      await form.validateFields(requiredKeys as never);

      const raw = form.getFieldsValue();
      if (beforeBuild) beforeBuild(raw);

      const transforms: Array<(d: PlainData) => void> = [];
      if (legalFieldKey && legalList) {
        transforms.push(applyLegalIndicesToText(legalFieldKey, legalList));
      }
      transforms.push(applyYearRange("thoiGian"));
      transforms.push(applyMoneyFields([{ numberField: "tongHopDuToan", wordsField: "duToanStr" }]));
      if (additionalTransforms) transforms.push(...additionalTransforms);

      const data = buildDocxData(raw, transforms);
      const templateUrl = new URL(templateRelativeUrl, import.meta.url).href;
      await generateDocxFromTemplateUrl(templateUrl, data, outputFileName);
    } catch {
      messageApi.error("Vui lòng nhập đầy đủ các trường có dấu *.");
    }
  };

  const collapseItems = [
    {
      key: '1',
      label: title,
      children: (
        <>
          {contextHolder}
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
          // expandIcon={({ isActive }) => (
           
          //     <RightCircleOutlined className={`${isActive ? "rotate-90" : "rotate-0"} translate-0.5 text-1xl`} />
          // )}
        />
      </Card>
    );
  }

  return (
    <Card title={title} className={cardClassName}>
      {contextHolder}
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


