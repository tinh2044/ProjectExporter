import type { FormInstance } from "antd";
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  BorderStyle,
  FileChild,
  type IParagraphOptions,
  type IRunOptions,
  type ITableOptions,
  type ITableRowOptions,
  type ITableCellOptions,
  TableLayoutType,
  PageOrientation,
  SectionType,
} from "docx";
import {
  formatAdditionalEstimate,
  formatYearRangeFromPicker,
  formatNumberWithDots,
  numberToVietnameseMoney,
} from "@/utils/formatters";
// import type { AppendixRow } from "@/components/Form/AppendixModal";
import type { EstimateCostData, EstimateCostRow } from "@/types";

const CONSTANTS = {
  FONT: "Times New Roman",
  FONT_SIZE: 28,
  SPACING: {
    AFTER: 100,
    BEFORE: 200,
    NONE: 0,
  },
  INDENT: {
    FIRST_LINE: 540,
    NONE: 0,
  },
  MARGIN: {
    TOP: 1417,
    RIGHT: 754,
    BOTTOM: 1417,
    LEFT: 1700,
  },
} as const;

const baseTableOpts = {
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.NONE },
    insideVertical: { style: BorderStyle.NONE },
  },
};

const baseTableCellOpts = {
  verticalAlign: VerticalAlign.TOP,
};

const baseRunOpts: IRunOptions = {
  font: CONSTANTS.FONT,
  size: CONSTANTS.FONT_SIZE,
};

const baseParagraphOpts: IParagraphOptions = {
  spacing: {
    after: CONSTANTS.SPACING.AFTER,
    before: CONSTANTS.SPACING.BEFORE,
  },
  alignment: AlignmentType.CENTER,
  indent: { firstLine: CONSTANTS.INDENT.FIRST_LINE },
};

/**
 * Create table with custom options
 */
const createTable = (
  rows: TableRow[],
  options?: Partial<ITableOptions>
): Table => {
  return new Table({
    ...baseTableOpts,
    ...options,
    rows,
  });
};

/**
 * Create TableRow with custom options
 */
const createTableRow = (
  cells: TableCell[],
  options?: ITableRowOptions
): TableRow => {
  return new TableRow({
    ...options,
    children: cells,
  });
};

/**
 * Create TableCell with custom options
 */
const createTableCell = (
  children: FileChild[],
  options?: Partial<ITableCellOptions>
): TableCell => {
  return new TableCell({
    children,
    ...baseTableCellOpts,
    ...options,
  });
};
/**
 * Create TextRun with custom options
 */
const createText = (text: string, options?: Partial<IRunOptions>): TextRun => {
  return new TextRun({
    text,
    ...baseRunOpts,
    ...options,
  });
};

/**
 * Create TextRun in bold
 */
const textBold = (text: string, options?: Partial<IRunOptions>): TextRun => {
  return createText(text, { ...options, bold: true });
};

/**
 * Create TextRun in italics
 */
const textItalics = (text: string, options?: Partial<IRunOptions>): TextRun => {
  return createText(text, { ...options, italics: true });
};

/**
 * Create Paragraph with multiple input types
 */
const createParagraph = (
  content: string | TextRun | TextRun[],
  paragraphOpts?: Partial<IParagraphOptions>,
  runOpts?: Partial<IRunOptions>
): Paragraph => {
  let children: TextRun[];

  if (typeof content === "string") {
    children = [createText(content, runOpts)];
  } else if (Array.isArray(content)) {
    children = content;
  } else {
    children = [content];
  }

  return new Paragraph({
    children,
    ...baseParagraphOpts,
    ...paragraphOpts,
  });
};

/**
 * Create Paragraph with both sides aligned
 */
const paragraphJustify = (
  content: string | TextRun | TextRun[],
  paragraphOpts?: Partial<IParagraphOptions>,
  runOpts?: Partial<IRunOptions>
): Paragraph => {
  return createParagraph(
    content,
    { ...paragraphOpts, alignment: AlignmentType.JUSTIFIED },
    runOpts
  );
};

/**
 * Create Paragraph with left alignment
 */
const paragraphLeft = (
  content: string | TextRun | TextRun[],
  paragraphOpts?: Partial<IParagraphOptions>,
  runOpts?: Partial<IRunOptions>
): Paragraph => {
  return createParagraph(
    content,
    { ...paragraphOpts, alignment: AlignmentType.LEFT },
    runOpts
  );
};

/**
 * Create Paragraph with no indent
 */
const paragraphNoIndent = (
  content: string | TextRun | TextRun[],
  paragraphOpts?: Partial<IParagraphOptions>,
  runOpts?: Partial<IRunOptions>
): Paragraph => {
  return createParagraph(
    content,
    {
      ...paragraphOpts,
      indent: { firstLine: CONSTANTS.INDENT.NONE },
    },
    runOpts
  );
};

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
  appendix?: Table
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
        children: appendix
          ? [
              createParagraph(textBold("PHỤ LỤC - DỰ TOÁN CHI PHÍ MUA SẮM"), {
                pageBreakBefore: true,
              }),
              createParagraph(
                textItalics(
                  `(Kèm theo Tờ trình ngày     tháng    năm ${new Date().getFullYear()})`
                )
              ),
              appendix,
            ]
          : [],
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
      createText(form.getFieldValue("quyMo") || ""),
    ]),
  ];
};

/**
 * Create appendix table
 */
export const createAppendixTable = (estimateData: EstimateCostData): Table => {
  const appendixRows = estimateData.rows || [];
  // console.log(appendixRows)

  const WIDTHS = {
    STT: 1000,
    NOI_DUNG: 2400,
    DIEN_GIAI: 2400,
    GIA_TRI: 2100,
    GHI_CHU: 8700,
  };

  // Helper: Create cell with custom options
  const cell = (contents: string) => {
    return new TableCell({
      children: [
        ...contents.split("<br>").map(
          (content) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: content,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 0, before: 0 },
            })
        ),
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
    });
  };

  // Helper: Create bold cell
  const boldCell = (content: string) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: content,
              font: "Times New Roman",
              size: 26,
              bold: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 0, before: 0 },
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
    });
  };

  // Header row
  const headerRow = new TableRow({
    children: [
      boldCell("STT"),
      boldCell("Nội dung"),
      boldCell("Diễn giải"),
      boldCell("Giá trị tạm tính (đồng)"),
      boldCell("Ghi chú"),
    ],
  });

  // Data rows
  const dataRows = appendixRows.map(
    (row: EstimateCostRow, index) =>
      new TableRow({
        children: [
          cell(String(index + 1)),
          cell(row.costName),
          cell(row.formula || ""),
          cell(formatNumberWithDots(row.moneyBeforeTax)),
          cell(row.note || ""),
        ],
      })
  );

  // Create table
  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths: [
      WIDTHS.STT,
      WIDTHS.NOI_DUNG,
      WIDTHS.DIEN_GIAI,
      WIDTHS.GIA_TRI,
      WIDTHS.GHI_CHU,
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6 },
      bottom: { style: BorderStyle.SINGLE, size: 6 },
      left: { style: BorderStyle.SINGLE, size: 6 },
      right: { style: BorderStyle.SINGLE, size: 6 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 6 },
      insideVertical: { style: BorderStyle.SINGLE, size: 6 },
    },
  });
};

/**
 * Template 1
 */
export const createTemplate1 = (
  form: FormInstance,
  legalInfo: string[] = []
): Document => {
  const estimateData = form.getFieldValue("estimateCosts");
  console.log(estimateData);
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

  return createDocument(content, createAppendixTable(estimateData));
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

  return createDocument(content, createAppendixTable(estimateData));
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

    // VII. Kiến nghị
    paragraphLeft(textBold("VII. Kiến nghị")),
    paragraphJustify(
      `Trên cơ sở những nội dung phân tích nêu trên, kính trình ${nguoiNhan} xem xét, phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"./.`
    ),
    paragraphLeft("Kính trình Giám đốc xem xét, quyết định./."),

    // Footer
    documentFooter(["Nơi nhận:", "- Như trên;", "- Lưu VT."], "………"),
  ];

  return createDocument(content);
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
