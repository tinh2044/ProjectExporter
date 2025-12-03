import { Select, Collapse, Row, Col } from "antd";
import {
  projectDocTypes,
  geographicLocationOptions,
  projectScopeOptions,
  equipmentRatioOptions,
  projectTypeOptions,
  projectSpecificityOptions,
  languageOptions,
} from "@/services/constants";
import type { BasicProjectInfo, EstimateCostData } from "@/types";

const { Panel } = Collapse;

type BasicInfoCollapseProps = {
  localData: EstimateCostData;
  setLocalData: React.Dispatch<React.SetStateAction<EstimateCostData>>;
};

export default function BasicInfoCollapse({
  localData: { basicInfo },
  setLocalData,
}: BasicInfoCollapseProps) {
  const updateField = (field: keyof BasicProjectInfo, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value } as BasicProjectInfo,
    }));
  };

  const onChangeDocType = (value: string) => {
    const mappedForm =
      value === "baoCaoKTKT"
        ? "baoCaoKTKT"
        : value === "keHoachThue"
        ? "baoCaoKTKT"
        : "duAnDauTu";

    setLocalData((prev) => {
      const nextAllowed =
        projectDocTypes.find((docType) => docType.value === value)
          ?.costReportOptions || ([] as string[]);
      const sanitizedRows = (prev.rows || []).map((r) => {
        if (!r.costType || nextAllowed.includes(r.costType)) return r;
        return {
          ...r,
          costType: "",
          moneyAfterTax: 0,
          moneyBeforeTax: 0,
          formula: "",
          note: "",
          kFactor: [],
        };
      });
      return {
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          projectDocType: value,
          projectForm: mappedForm,
          costReportOptions: nextAllowed,
        },
        rows: sanitizedRows,
      };
    });
  };

  return (
    <Collapse defaultActiveKey={["basic-info"]} size="small">
      <Panel header="Thông tin cơ bản của dự án" key="basic-info">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Xác định loại dự án:
              </label>
              <Select
                value={basicInfo.projectDocType}
                onChange={onChangeDocType}
                placeholder="Chọn loại dự án (KT-KT / Kế hoạch thuê / NCKT)"
                options={projectDocTypes}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Vị trí địa lý của dự án:
              </label>
              <Select
                value={basicInfo.geographicLocation}
                onChange={(value) => updateField("geographicLocation", value)}
                placeholder="Chọn vị trí địa lý"
                options={geographicLocationOptions}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Phạm vi triển khai dự án:
              </label>
              <Select
                value={basicInfo.projectScope}
                onChange={(value) => updateField("projectScope", value)}
                placeholder="Chọn phạm vi triển khai"
                options={projectScopeOptions}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
          </Col>

          <Col span={12}>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Tỷ trọng mua sắm thiết bị:
              </label>
              <Select
                value={basicInfo.equipmentRatio}
                onChange={(value) => updateField("equipmentRatio", value)}
                placeholder="Chọn tỷ trọng thiết bị"
                options={equipmentRatioOptions}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Loại hình dự án:
              </label>
              <Select
                value={basicInfo.projectTypeDetail}
                onChange={(value) => updateField("projectTypeDetail", value)}
                placeholder="Chọn loại hình dự án"
                options={projectTypeOptions}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Tính đặc thù của dự án:
              </label>
              <Select
                value={basicInfo.projectSpecificity}
                onChange={(value) => updateField("projectSpecificity", value)}
                placeholder="Chọn tính đặc thù"
                options={projectSpecificityOptions}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Ngôn ngữ hồ sơ dự án:
              </label>
              <Select
                value={basicInfo.language}
                onChange={(value) => updateField("language", value)}
                placeholder="Chọn ngôn ngữ hồ sơ"
                options={languageOptions}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  );
}
