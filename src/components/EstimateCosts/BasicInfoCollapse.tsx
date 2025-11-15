import { Select, Collapse, Row, Col } from "antd";
import {
  // projectCategoryOptions,
  // projectForms,
  projectDocTypes,
  // projectCategoryOptions,
  geographicLocationOptions,
  projectScopeOptions,
  equipmentRatioOptions,
  projectTypeOptions,
  projectSpecificityOptions,
  // projectPhaseOptions,
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
    // Map docType to projectForm where applicable
    // baoCaoKTKT -> baoCaoKTKT, keHoachThue -> baoCaoKTKT (dùng form KT-KT), nghienCuuKhaThi -> duAnDauTu
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
          {/* Dòng trên cùng: Xác định loại dự án */}
          {/* <Col span={24}>
            
          </Col> */}

          {/* Cột 1 */}
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
            {/* Loại dự án */}
            {/* <div>
              <label className="block font-medium text-gray-700 mb-2">
                Loại dự án:
              </label>
              <Select
                value={basicInfo.projectType}
                onChange={(value) => updateField("projectType", value)}
                placeholder="Chọn loại dự án"
                options={projectCategoryOptions.map(
                  ({ value, label }: { value: string; label: string }) => ({
                    value,
                    label,
                  })
                )}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div> */}

            {/* <div>
              <label className="block font-medium text-gray-700 mb-2">
                Hình thức dự án:
              </label>
              <Select
                value={basicInfo.projectForm}
                onChange={(value) => updateField("projectForm", value)}
                placeholder="Chọn hình thức dự án"
                options={projectForms.map(
                  (form: { value: string; label: string }) => ({
                    value: form.value,
                    label: form.label,
                  })
                )}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div> */}

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Vị trí địa lý của dự án:
              </label>
              {/* <p className="text-xs text-gray-500 mb-2">
                  Ảnh hưởng đến chi phí di chuyển và điều kiện làm việc, dẫn đến điều chỉnh k
                </p> */}
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

            {/* Phạm vi triển khai dự án */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Phạm vi triển khai dự án:
              </label>
              {/* <p className="text-xs text-gray-500 mb-2">
                  Xác định mức độ lan tỏa địa lý, ảnh hưởng đến k (tăng nếu rộng lớn)
                </p> */}
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

          {/* Cột 2 */}
          <Col span={12}>
            {/* Tỷ trọng mua sắm thiết bị */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Tỷ trọng mua sắm thiết bị:
              </label>
              {/* <p className="text-xs text-gray-500 mb-2">
                  Xác định tỷ lệ thiết bị đơn giản trong tổng chi phí, ảnh hưởng đến k
                </p> */}
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

            {/* Loại hình dự án */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Loại hình dự án:
              </label>
              {/* <p className="text-xs text-gray-500 mb-2">
                  Xác định tính chất dự án để áp dụng k (tăng nếu phức tạp, giảm nếu sử dụng mẫu sẵn)
                </p> */}
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

            {/* Tính đặc thù của dự án */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Tính đặc thù của dự án:
              </label>
              {/* <p className="text-xs text-gray-500 mb-2">
                  Xác định nếu dự án có yếu tố bất thường, dẫn đến không dùng k mà lập dự toán
                </p> */}
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

            {/* Loại tài liệu hoặc giai đoạn dự án */}
            {/* <div>
              <label className="block font-medium text-gray-700 mb-2">
                Loại tài liệu hoặc giai đoạn dự án:
              </label>
              <p className="text-xs text-gray-500 mb-2">
                  Xác định giai đoạn để áp dụng k riêng (ví dụ: cho báo cáo kinh tế - kỹ thuật)
                </p>
              <Select
                value={basicInfo.projectPhase}
                onChange={(value) => updateField("projectPhase", value)}
                placeholder="Chọn giai đoạn dự án"
                options={projectPhaseOptions}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div> */}

            {/* Ngôn ngữ hồ sơ dự án */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Ngôn ngữ hồ sơ dự án:
              </label>
              {/* <p className="text-xs text-gray-500 mb-2">
                  Ảnh hưởng đến chi phí tư vấn (bổ sung chi phí nếu bằng tiếng nước ngoài)
                </p> */}
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
