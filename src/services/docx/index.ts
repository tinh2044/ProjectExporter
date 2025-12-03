import { Document, PageOrientation, Paragraph, SectionType, WidthType, type FileChild, type Table } from "docx";
import { createParagraph, createText, paragraphJustify, paragraphLeft, paragraphNoIndent, textBold, textItalics } from "./builders";
import type { FormInstance } from "antd";
import { createAppendixTable, createContractorPlanAppendixTable, createContractorSelectionTable, createPlanImplementationAppendixTable, createTable, createTableCell, createTableRow } from "./table";
import { CONSTANTS } from "./constanst";
import { formatAdditionalEstimate, formatNumberWithDots, formatYearRangeFromPicker, numberToVietnameseMoney } from "@/utils/formatters";
import type { EstimateCostData } from "@/types";

/**
 * Create header standard for all documents
 */
const documentHeader = (): Table => {
  return createTable([
    createTableRow([
      createTableCell(
        [
          paragraphNoIndent("SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH", {
            spacing: { after: 0, before: 0 },
          }),
          paragraphNoIndent(textBold("PHÒNG..........."), {
            spacing: { after: 0, before: 0 },
          }),
          paragraphNoIndent("Số:     /TTr-.......", {
            spacing: { after: 0, before: 0 },
          }),
        ],
        { width: { size: 40, type: WidthType.PERCENTAGE } }
      ),
      createTableCell(
        [
          paragraphNoIndent(textBold("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"), {
            spacing: { after: 0, before: 0 },
          }),
          paragraphNoIndent(textBold("Độc lập - Tự do - Hạnh phúc"), {
            spacing: { after: 0, before: 0 },
          }),
          paragraphNoIndent(
            textItalics(
              `TP. Hồ Chí Minh, ngày     tháng     năm ${new Date().getFullYear()}`
            ),
            { spacing: { after: 0, before: 0 } }
          ),
        ],
        { width: { size: 60, type: WidthType.PERCENTAGE } }
      ),
    ]),
  ]);
};

/**
 * Create footer standard with signature
 */
const documentFooter = (
  leftContent: string[],
  rightTitle: string = "………"
): Table => {
  return createTable([
    createTableRow([
      createTableCell(
        [
          paragraphLeft(
            leftContent.map((text, idx) =>
              idx === 0
                ? textBold(text, { italics: true, break: 1 })
                : createText(text, { break: 1 })
            )
          ),
        ],
        { width: { size: 70, type: WidthType.PERCENTAGE } }
      ),
      createTableCell(
        [
          createParagraph(
            Array(6)
              .fill(null)
              .map((_, idx) =>
                textBold(idx === 0 ? rightTitle : "", { break: 1 })
              )
          ),
        ],
        { width: { size: 30, type: WidthType.PERCENTAGE } }
      ),
    ]),
  ]);
};

/**
 * Create Document with header and content
 */
export const createDocument = (
  children: FileChild[],
  appendix?: FileChild[]
): Document => {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT, // Explicit set
            },
            margin: {
              top: CONSTANTS.MARGIN.TOP,
              right: CONSTANTS.MARGIN.RIGHT,
              bottom: CONSTANTS.MARGIN.BOTTOM,
              left: CONSTANTS.MARGIN.LEFT,
            },
          },
          type: SectionType.NEXT_PAGE,
        },
        children: [documentHeader(), ...children],
      },
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              // Or use string: orientation: "landscape"
              // width: 16838, // A4 landscape width
              // height: 11906, // A4 landscape height
            },
            margin: {
              top: CONSTANTS.MARGIN.TOP,
              right: CONSTANTS.MARGIN.RIGHT,
              bottom: CONSTANTS.MARGIN.BOTTOM,
              left: CONSTANTS.MARGIN.LEFT,
            },
          },
        },
        children: appendix ? appendix : [],
      },
    ],
  });
};

/**
 * Create legal basis list
 */
const createLegalBasis = (
  legalInfoIndices: number[],
  legalInfo: string[]
): Paragraph[] => {
  return legalInfoIndices
    .map((index) => legalInfo[index])
    .map((item) => paragraphJustify(textItalics(item)));
};

/**
 * Create sections from multiline text
 */
const createMultilineSections = (
  text: string,
  createFn: typeof paragraphJustify
): Paragraph[] => {
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => createFn(line));
};

/**
 * Create basic project information
 */
const createProjectBasicInfo = (form: FormInstance): Paragraph[] => {
  return [
    paragraphJustify([
      createText("- Tên dự án: "),
      createText(form.getFieldValue("tenDuAn") || ""),
    ]),
    paragraphJustify([
      createText("- Tổng dự toán mua sắm: "),
      textBold(
        `${formatNumberWithDots(
          form.getFieldValue("tongHopDuToan") || ""
        )} đồng`
      ),
      textItalics(
        ` (${numberToVietnameseMoney(
          form.getFieldValue("tongHopDuToan") || ""
        )})`
      ),
    ]),
    paragraphJustify([
      createText("- Chủ đầu tư: "),
      createText(form.getFieldValue("chuDauTu") || ""),
    ]),
    paragraphLeft([
      createText("- Nguồn vốn: "),
      createText(form.getFieldValue("nguonKinhPhi") || ""),
    ]),
    paragraphLeft([
      createText("- Thời gian thực hiện: "),
      createText(
        formatYearRangeFromPicker(form.getFieldValue("thoiGian")) || ""
      ),
    ]),
    paragraphJustify([
      createText("- Địa điểm thực hiện: "),
      createText(form.getFieldValue("diaDiem") || ""),
    ]),
    paragraphJustify([
      createText("- Quy mô thực hiện: "),
      createText(form.getFieldValue("tenDuAn") || ""),
    ]),
  ];
};

/**
 * Template 1
 */
export const createTemplate1 = (
  form: FormInstance,
  legalInfo: string[] = []
): Document => {
  const estimateData = form.getFieldValue("estimateCosts");
  // console.log(estimateData);
  const content: FileChild[] = [
    // Title
    createParagraph(textBold("TỜ TRÌNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      textBold(
        `V/v đề nghị phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${
          form.getFieldValue("tenDuAn") || ""
        }"`
      )
    ),
    createParagraph(`Kính gửi: ${form.getFieldValue("nguoiNhan") || ""}`),
    createParagraph(""),

    // 1. Căn cứ lập dự toán
    paragraphLeft(textBold("1. Căn cứ lập dự toán")),
    ...createLegalBasis(form.getFieldValue("thongTinPhapLiChuanBi"), legalInfo),
    paragraphJustify(
      "Căn cứ vào nhu cầu thực tế của đơn vị.",
      {},
      { italics: true }
    ),

    // 2-4. Các phần khác
    paragraphLeft(textBold("2. Mục tiêu đầu tư")),
    ...createMultilineSections(
      form.getFieldValue("mucTieu") || "",
      paragraphJustify
    ),

    paragraphLeft(textBold("3. Quy mô thực hiện")),
    ...createMultilineSections(
      form.getFieldValue("quyMo") || "",
      paragraphLeft
    ),

    paragraphLeft(textBold("4. Sự cần thiết đầu tư")),
    ...createMultilineSections(
      form.getFieldValue("suCanThiet") || "",
      paragraphJustify
    ),

    // Thông tin tài chính
    paragraphLeft([
      textBold("1. Nguồn kinh phí: "),
      createText(form.getFieldValue("nguonKinhPhi") || ""),
    ]),
    paragraphLeft([
      textBold("2. Thời gian thực hiện: "),
      createText(
        formatYearRangeFromPicker(form.getFieldValue("thoiGian")) || ""
      ),
    ]),
    paragraphJustify([
      textBold("3. Địa điểm thực hiện: "),
      createText(form.getFieldValue("diaDiem") || ""),
    ]),

    // Dự toán
    paragraphLeft(textBold("4. Bảng tổng hợp dự toán")),
    paragraphJustify([
      createText("Tổng dự toán dự án: "),
      textBold(
        `${formatNumberWithDots(
          form.getFieldValue("tongHopDuToan") || ""
        )} đồng`
      ),
      textItalics(
        `(${numberToVietnameseMoney(
          form.getFieldValue("tongHopDuToan") || ""
        )})`
      ),
      createText(
        ", trong đó dự toán giai đoạn chuẩn bị đầu tư cụ thể như sau:"
      ),
    ]),
    ...createMultilineSections(
      formatAdditionalEstimate(estimateData.rows || []),
      paragraphJustify
    ),
    createParagraph(textItalics("(Chi tiết dự toán theo Phụ lục đính kèm)")),

    // Kiến nghị
    paragraphLeft(textBold("5. Kiến nghị")),
    paragraphJustify(
      `Trên cơ sở những nội dung phân tích nêu trên, kính đề nghị ${
        form.getFieldValue("nguoiNhan") || ""
      } xem xét, phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${
        form.getFieldValue("tenDuAn") || ""
      }"./.`
    ),

    // Footer
    documentFooter(["Nơi nhận:", "- Như trên;", "- Lưu VT."], "………"),
  ];

  return createDocument(content, [
    createParagraph(textBold("PHỤ LỤC - DỰ TOÁN CHI PHÍ MUA SẮM"), {
      pageBreakBefore: true,
    }),
    createParagraph(
      textItalics(
        `(Kèm theo Tờ trình ngày     tháng    năm ${new Date().getFullYear()})`
      )
    ),
    createAppendixTable(estimateData),
  ]);
};

/**
 * Template 2
 */
export const createTemplate2 = (
  form: FormInstance,
  legalInfo: string[] = []
): Document => {
  const nguoiNhan = form.getFieldValue("nguoiNhan") || "";
  const tenDuAn = form.getFieldValue("tenDuAn") || "";
  const currentYear = new Date().getFullYear();
  const estimateData = form.getFieldValue("estimateCosts");
  console.log(estimateData);
  const content: FileChild[] = [
    // Header
    createParagraph(textBold("QUYẾT ĐỊNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      textBold(`Phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`)
    ),
    createParagraph(`Kính gửi: ${nguoiNhan.toUpperCase()}`),
    createParagraph(""),

    // Căn cứ pháp lý
    ...createLegalBasis(form.getFieldValue("thongTinPhapLiDuToan"), legalInfo),
    paragraphJustify([
      textItalics("Xét "),
      textItalics(
        `Tờ trình số ……/TTr- …… ngày … tháng … năm ${currentYear}  `,
        { color: "FF0000" }
      ),
      textItalics(
        `của ……….. về phê dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`
      ),
    ]),
    createParagraph(""),

    // Quyết định
    createParagraph(textBold("QUYẾT ĐỊNH"), {
      spacing: { after: 800, before: 500 },
    }),

    // Điều 1
    paragraphJustify([
      textBold("Điều 1. "),
      createText(
        `Phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}" với các nội dung chính sau:`
      ),
    ]),

    // Nội dung quyết định
    paragraphJustify([textBold("1) Tên dự án: "), createText(tenDuAn)]),
    paragraphJustify([
      textBold("2) Chủ đầu tư: "),
      createText(form.getFieldValue("chuDauTu") || ""),
    ]),
    paragraphJustify([
      textBold("3) Tổng dự toán mua sắm: "),
      textBold(
        `${formatNumberWithDots(
          form.getFieldValue("tongHopDuToan") || ""
        )} đồng`
      ),
      textItalics(
        ` (${numberToVietnameseMoney(
          form.getFieldValue("tongHopDuToan") || ""
        )})`
      ),
      createText(
        ", trong đó dự toán giai đoạn chuẩn bị đầu tư cụ thể như sau:"
      ),
    ]),
    ...createMultilineSections(
      formatAdditionalEstimate(estimateData.rows || []),
      paragraphJustify
    ),
    createParagraph(textItalics("(Chi tiết dự toán theo Phụ lục đính kèm)")),

    paragraphLeft([
      textBold("4) Nguồn vốn: "),
      createText(form.getFieldValue("nguonKinhPhi") || ""),
    ]),
    paragraphLeft([
      textBold("5) Thời gian thực hiện: "),
      createText(
        formatYearRangeFromPicker(form.getFieldValue("thoiGian")) || ""
      ),
    ]),
    paragraphJustify([
      textBold("6) Địa điểm thực hiện: "),
      createText(form.getFieldValue("diaDiem") || ""),
    ]),
    paragraphJustify([
      textBold("7) Quy mô thực hiện: "),
      createText(form.getFieldValue("quyMo") || ""),
    ]),

    // Điều 2 & 3
    paragraphJustify([
      textBold("Điều 2. "),
      createText(
        "Giao phòng ………… triển khai thực hiện theo đúng quy định hiện hành của nhà nước."
      ),
    ]),
    paragraphJustify([
      textBold("Điều 3. "),
      createText(
        "Quyết định có hiệu lực kể từ ngày ký. Phòng ……… và các đơn vị có liên quan chịu trách nhiệm thực hiện Quyết định này./."
      ),
    ]),

    // Footer
    documentFooter(["Nơi nhận:", "- Như trên;", "- Lưu: VT."], "GIÁM ĐỐC"),
  ];

  return createDocument(content, [createAppendixTable(estimateData)]);
};

/**
 * Template 4
 */
export const createTemplate4 = (
  form: FormInstance,
  legalInfo: string[] = []
): Document => {
  const nguoiNhan = form.getFieldValue("nguoiNhan") || "";
  const tenDuAn = form.getFieldValue("tenDuAn") || "";
  const currentYear = new Date().getFullYear();

  const estimateCosts: EstimateCostData = form.getFieldValue("estimateCosts");
  const totalCosts = estimateCosts.rows.reduce(
    (acc, row) => acc + row.moneyAfterTax,
    0
  );

  const workValues = form.getFieldValue("workValues");
  workValues[2] = workValues == 0 ? totalCosts : workValues[2];

  const content: FileChild[] = [
    // Header
    createParagraph(textBold("TỜ TRÌNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      textBold(
        `Về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`
      )
    ),
    createParagraph(`Kính gửi: ${nguoiNhan}`),
    createParagraph(""),
    // Giới thiệu
    paragraphJustify(
      `Phòng ………… kính trình Giám đốc xem xét, phê duyệt kế hoạch lựa chọn nhà thầu dự án "${tenDuAn}" trên cơ sở những nội dung dưới đây:`
    ),
    // I. Mô tả tóm tắt dự toán
    paragraphLeft(textBold("I. Mô tả tóm tắt dự toán")),
    ...createProjectBasicInfo(form),
    // II. Căn cứ pháp lý
    paragraphLeft(textBold("II. Căn cứ pháp lý")),
    ...createLegalBasis(
      form.getFieldValue("thongTinPhapLiChonNhaThau"),
      legalInfo
    ),
    paragraphJustify([
      createText("Căn cứ "),
      createText(
        `Quyết định số ………/QĐ- ..... ngày … tháng … năm ${currentYear}`,
        { color: "FF0000", highlight: "yellow" }
      ),
      createText(
        ` của ${nguoiNhan} về phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}".`
      ),
    ]),
    // III. Phần công việc đã thực hiện
    paragraphLeft([
      textBold("III. Phần công việc đã thực hiện: "),
      createText(form.getFieldValue("congViecDaThucHien") || ""),
    ]),
    // IV. Phần công việc không áp dụng
    paragraphLeft([
      textBold(
        "IV. Phần công việc không áp dụng được một trong các hình thức lựa chọn nhà thầu: "
      ),
      createText(form.getFieldValue("congViecKhongApDung") || ""),
    ]),
    // V. Phần công việc thuộc kế hoạch
    paragraphLeft([
      textBold("V. Phần công việc thuộc kế hoạch lựa chọn nhà thầu: "),
      ...form
        .getFieldValue("congViecKeHoach")
        .split("\n")
        .map((item: string) => createText(item, { break: 1 })),
    ]),
    // VI.	Tổng giá trị các phần công việc
    paragraphLeft([textBold("VI.	Tổng giá trị các phần công việc: ")]),
    createContractorSelectionTable(...workValues),
    // VII. Kiến nghị
    paragraphLeft(textBold("VII. Kiến nghị")),
    paragraphJustify(
      `Trên cơ sở những nội dung phân tích nêu trên, kính trình ${nguoiNhan} xem xét, phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"./.`
    ),
    paragraphLeft("Kính trình Giám đốc xem xét, quyết định./."),

    // Footer
    documentFooter(["Nơi nhận:", "- Như trên;", "- Lưu VT."], "………"),
  ];

  return createDocument(content, [
    createParagraph(textBold("Phụ lục I"), {
      pageBreakBefore: true,
    }),
    createParagraph(textBold(" KẾ HOẠCH LỰA CHỌN NHÀ THẦU")),
    createParagraph(
      textItalics(
        `(Kèm theo Tờ trình ngày     tháng    năm ${new Date().getFullYear()})`,
        { color: "FF0000" }
      )
    ),
    createContractorPlanAppendixTable(
      estimateCosts,
      form.getFieldValue("chuDauTu") || "",
      form.getFieldValue("nguonKinhPhi") || ""
    ),
    createParagraph(textBold("Phụ lục II"), {
      pageBreakBefore: true,
    }),
    createParagraph(textBold("GIẢI TRÌNH NỘI DUNG KẾ HOẠCH LỰA CHỌN NHÀ THẦU")),
    createParagraph(
      textItalics(
        `(Kèm theo Tờ trình ngày     tháng    năm ${new Date().getFullYear()})`,
        { color: "FF0000" }
      )
    ),
    createPlanImplementationAppendixTable(estimateCosts, form),
  ]);
};
/**
 * Template 6
 */
export const createTemplate6 = (
  form: FormInstance,
  legalInfo: string[] = []
): Document => {
  const nguoiNhan = form.getFieldValue("nguoiNhan") || "";
  const tenDuAn = form.getFieldValue("tenDuAn") || "";
  const currentYear = new Date().getFullYear();

  const content: FileChild[] = [
    // Header
    createParagraph(textBold("QUYẾT ĐỊNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      textBold(
        `Về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`
      )
    ),
    createParagraph(textBold(`Kính gửi: ${nguoiNhan.toUpperCase()}`)),
    createParagraph(""),

    // Căn cứ pháp lý
    ...createLegalBasis(
      form.getFieldValue("pheDuyetPhapLiDuyetNhaThau"),
      legalInfo
    ),
    paragraphJustify([
      textItalics("Căn cứ "),
      textItalics(
        `Quyết định số ………/QĐ- ..... ngày … tháng … năm ${currentYear}`,
        { color: "FF0000" }
      ),
      textItalics(
        ` của ${nguoiNhan} về phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}";`
      ),
    ]),
    paragraphJustify([
      textItalics("Theo đề nghị của phòng ......... tại Tờ trình "),
      textItalics(`ngày     tháng    năm ${currentYear}`, {
        color: "FF0000",
        highlight: "yellow",
      }),
      textItalics(
        ` về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}";`
      ),
    ]),

    // Quyết định
    createParagraph(textBold("QUYẾT ĐỊNH"), {
      spacing: { after: 300, before: 500 },
    }),

    // Điều 1
    paragraphJustify([
      textBold("Điều 1. "),
      createText(
        `Phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}" với nội dung theo Phụ lục đính kèm.`
      ),
    ]),

    // Điều 2
    paragraphJustify([
      textBold("Điều 2. "),
      createText(
        "Quyết định này có hiệu lực thi hành kể từ ngày ký. Phòng …….. và Trưởng các đơn vị có liên quan chịu trách nhiệm thực hiện Quyết định này./."
      ),
    ]),

    // Footer
    documentFooter(["Nơi nhận:", "- Như Điều 3;", "- Lưu: VT."], "GIÁM ĐỐC"),
  ];

  return createDocument(content);
};
