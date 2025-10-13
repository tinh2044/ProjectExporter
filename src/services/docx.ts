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
  formatAdditionalstimate,
  formatNumberWithDots,
  formatYearRangeFromPicker,
  numberToVietnameseMoney,
} from "@/utils/formatters";

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
 * Tạo Table với options tùy chỉnh
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
 * Tạo TableRow với options tùy chỉnh
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
 * Tạo TableCell với options tùy chỉnh
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
 * Tạo TextRun với options tùy chỉnh
 */
const createText = (text: string, options?: Partial<IRunOptions>): TextRun => {
  return new TextRun({
    text,
    ...baseRunOpts,
    ...options,
  });
};

/**
 * Tạo TextRun in đậm
 */
const createTextBold = (
  text: string,
  options?: Partial<IRunOptions>
): TextRun => {
  return createText(text, { ...options, bold: true });
};

/**
 * Tạo TextRun in nghiêng
 */
const createTextItalics = (
  text: string,
  options?: Partial<IRunOptions>
): TextRun => {
  return createText(text, { ...options, italics: true });
};

/**
 * Tạo Paragraph với nhiều input types
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
 * Tạo Paragraph căn đều 2 bên
 */
const createParagraphJustify = (
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
 * Tạo Paragraph căn trái
 */
const createParagraphLeft = (
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
 * Tạo Paragraph không thụt lề
 */
const createParagraphNoIndent = (
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
 * Tạo header chuẩn cho tất cả document
 */
const createDocumentHeader = (): Table => {
  return createTable([
    createTableRow([
      createTableCell(
        [
          createParagraphNoIndent(
            "SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH",
            { spacing: { after: 0, before: 0 } }
          ),
          createParagraphNoIndent(createTextBold("PHÒNG..........."), {
            spacing: { after: 0, before: 0 },
          }),
          createParagraphNoIndent("Số:     /TTr-.......", {
            spacing: { after: 0, before: 0 },
          }),
        ],
        { width: { size: 40, type: WidthType.PERCENTAGE } }
      ),
      createTableCell(
        [
          createParagraphNoIndent(
            createTextBold("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"),
            { spacing: { after: 0, before: 0 } }
          ),
          createParagraphNoIndent(
            createTextBold("Độc lập - Tự do - Hạnh phúc"),
            { spacing: { after: 0, before: 0 } }
          ),
          createParagraphNoIndent(
            createTextItalics(
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
 * Tạo footer chuẩn với chữ ký
 */
const createDocumentFooter = (
  leftContent: string[],
  rightTitle: string = "………"
): Table => {
  return createTable([
    createTableRow([
      createTableCell(
        [
          createParagraphLeft(
            leftContent.map((text, idx) =>
              idx === 0
                ? createTextBold(text, { italics: true, break: 1 })
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
                createTextBold(idx === 0 ? rightTitle : "", { break: 1 })
              )
          ),
        ],
        { width: { size: 30, type: WidthType.PERCENTAGE } }
      ),
    ]),
  ]);
};

/**
 * Tạo Document với header và content
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
        children: [createDocumentHeader(), ...children],
      },
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              // Hoặc dùng string: orientation: "landscape"
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
              createParagraph(
                createTextBold("PHỤ LỤC - DỰ TOÁN CHI PHÍ MUA SẮM"),
                { pageBreakBefore: true }
              ),
              createParagraph(
                createTextItalics(
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
 * Tạo danh sách căn cứ pháp lý
 */
const createLegalBasis = (
  legalInfoIndices: number[],
  legalInfo: string[]
): Paragraph[] => {
  return legalInfoIndices
    .map((index) => legalInfo[index])
    .map((item) => createParagraphJustify(createTextItalics(item)));
};

/**
 * Tạo các section từ multiline text
 */
const createMultilineSections = (
  text: string,
  createFn: typeof createParagraphJustify
): Paragraph[] => {
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => createFn(line));
};

/**
 * Tạo phần thông tin dự án cơ bản
 */
const createProjectBasicInfo = (form: FormInstance): Paragraph[] => {
  return [
    createParagraphJustify([
      createText("- Tên dự án: "),
      createText(form.getFieldValue("tenDuAn") || ""),
    ]),
    createParagraphJustify([
      createText("- Tổng dự toán mua sắm: "),
      createTextBold(
        `${formatNumberWithDots(
          form.getFieldValue("tongHopDuToan") || ""
        )} đồng`
      ),
      createTextItalics(
        ` (${numberToVietnameseMoney(
          form.getFieldValue("tongHopDuToan") || ""
        )})`
      ),
    ]),
    createParagraphJustify([
      createText("- Chủ đầu tư: "),
      createText(form.getFieldValue("chuDauTu") || ""),
    ]),
    createParagraphLeft([
      createText("- Nguồn vốn: "),
      createText(form.getFieldValue("nguonKinhPhi") || ""),
    ]),
    createParagraphLeft([
      createText("- Thời gian thực hiện: "),
      createText(
        formatYearRangeFromPicker(form.getFieldValue("thoiGian")) || ""
      ),
    ]),
    createParagraphJustify([
      createText("- Địa điểm thực hiện: "),
      createText(form.getFieldValue("diaDiem") || ""),
    ]),
    createParagraphJustify([
      createText("- Quy mô thực hiện: "),
      createText(form.getFieldValue("quyMo") || ""),
    ]),
  ];
};

export const createAppendixTable = (form: FormInstance): Table => {
  const appendixRows = form.getFieldValue("appendixRows") || [];

  // Column widths in DXA units (1 inch = 1440 DXA)
  const WIDTHS = {
    STT: 1000,
    NOI_DUNG: 2400,
    DIEN_GIAI: 2000,
    GIA_TRI: 2100,
    GHI_CHU: 8700,
  };

  // Helper: Create cell
  const cell = (content: string) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: content,
              font: "Times New Roman",
              size: 28,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataRows = appendixRows.map(
    (row: any, index: number) =>
      new TableRow({
        children: [
          cell(String(row.stt || index + 1)),
          cell(row.noiDung || ""),
          cell(row.dienGiai || ""),
          cell(formatNumberWithDots(row.giaTriTamTinh || 0)),
          cell(row.ghiChu || ""),
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
 * Template 1: Tờ trình phê duyệt dự toán
 */
export const createTemplate1 = (
  form: FormInstance,
  legalInfo: string[] = []
): Document => {
  const content: FileChild[] = [
    // Title
    createParagraph(createTextBold("TỜ TRÌNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      createTextBold(
        `V/v đề nghị phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${
          form.getFieldValue("tenDuAn") || ""
        }"`
      )
    ),
    createParagraph(`Kính gửi: ${form.getFieldValue("nguoiNhan") || ""}`),
    createParagraph(""),

    // 1. Căn cứ lập dự toán
    createParagraphLeft(createTextBold("1. Căn cứ lập dự toán")),
    ...createLegalBasis(form.getFieldValue("thongTinPhapLiChuanBi"), legalInfo),
    createParagraphJustify(
      "Căn cứ vào nhu cầu thực tế của đơn vị.",
      {},
      { italics: true }
    ),

    // 2-4. Các phần khác
    createParagraphLeft(createTextBold("2. Mục tiêu đầu tư")),
    ...createMultilineSections(
      form.getFieldValue("mucTieu") || "",
      createParagraphJustify
    ),

    createParagraphLeft(createTextBold("3. Quy mô thực hiện")),
    ...createMultilineSections(
      form.getFieldValue("quyMo") || "",
      createParagraphLeft
    ),

    createParagraphLeft(createTextBold("4. Sự cần thiết đầu tư")),
    ...createMultilineSections(
      form.getFieldValue("suCanThiet") || "",
      createParagraphJustify
    ),

    // Thông tin tài chính
    createParagraphLeft([
      createTextBold("1. Nguồn kinh phí: "),
      createText(form.getFieldValue("nguonKinhPhi") || ""),
    ]),
    createParagraphLeft([
      createTextBold("2. Thời gian thực hiện: "),
      createText(
        formatYearRangeFromPicker(form.getFieldValue("thoiGian")) || ""
      ),
    ]),
    createParagraphJustify([
      createTextBold("3. Địa điểm thực hiện: "),
      createText(form.getFieldValue("diaDiem") || ""),
    ]),

    // Dự toán
    createParagraphLeft(createTextBold("4. Bảng tổng hợp dự toán")),
    createParagraphJustify([
      createText("Tổng dự toán dự án: "),
      createTextBold(
        `${formatNumberWithDots(
          form.getFieldValue("tongHopDuToan") || ""
        )} đồng`
      ),
      createTextItalics(
        ` ${numberToVietnameseMoney(form.getFieldValue("tongHopDuToan") || "")}`
      ),
      createText(
        ", trong đó dự toán giai đoạn chuẩn bị đầu tư cụ thể như sau:"
      ),
    ]),
    ...createMultilineSections(
      formatAdditionalstimate(
        form.getFieldValue("selectedItems") || [],
        form.getFieldValue("itemAmounts") || []
      ),
      createParagraphJustify
    ),
    createParagraph(
      createTextItalics("(Chi tiết dự toán theo Phụ lục đính kèm)")
    ),

    // Kiến nghị
    createParagraphLeft(createTextBold("5. Kiến nghị")),
    createParagraphJustify(
      `Trên cơ sở những nội dung phân tích nêu trên, kính đề nghị ${
        form.getFieldValue("nguoiNhan") || ""
      } xem xét, phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${
        form.getFieldValue("tenDuAn") || ""
      }"./.`
    ),

    // Footer
    createDocumentFooter(["Nơi nhận:", "- Như trên;", "- Lưu VT."], "………"),
  ];

  return createDocument(content, createAppendixTable(form));
};

/**
 * Template 2: Quyết định phê duyệt dự toán
 */
export const createTemplate2 = (
  form: FormInstance,
  legalInfo: string[] = []
): Document => {
  const nguoiNhan = form.getFieldValue("nguoiNhan") || "";
  const tenDuAn = form.getFieldValue("tenDuAn") || "";
  const currentYear = new Date().getFullYear();

  const content: FileChild[] = [
    // Header
    createParagraph(createTextBold("QUYẾT ĐỊNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      createTextBold(
        `Phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`
      )
    ),
    createParagraph(`Kính gửi: ${nguoiNhan.toUpperCase()}`),
    createParagraph(""),

    // Căn cứ pháp lý
    ...createLegalBasis(form.getFieldValue("thongTinPhapLiDuToan"), legalInfo),
    createParagraphJustify([
      createTextItalics("Xét "),
      createTextItalics(
        `Tờ trình số ……/TTr- …… ngày … tháng … năm ${currentYear}  `,
        { color: "FF0000" }
      ),
      createTextItalics(
        `của ……….. về phê dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`
      ),
    ]),
    createParagraph(""),

    // Quyết định
    createParagraph(createTextBold("QUYẾT ĐỊNH"), {
      spacing: { after: 800, before: 500 },
    }),

    // Điều 1
    createParagraphJustify([
      createTextBold("Điều 1. "),
      createText(
        `Phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}" với các nội dung chính sau:`
      ),
    ]),

    // Nội dung quyết định
    createParagraphJustify([
      createTextBold("1) Tên dự án: "),
      createText(tenDuAn),
    ]),
    createParagraphJustify([
      createTextBold("2) Chủ đầu tư: "),
      createText(form.getFieldValue("chuDauTu") || ""),
    ]),
    createParagraphJustify([
      createTextBold("3) Tổng dự toán mua sắm: "),
      createTextBold(
        `${formatNumberWithDots(
          form.getFieldValue("tongHopDuToan") || ""
        )} đồng`
      ),
      createTextItalics(
        ` (${numberToVietnameseMoney(
          form.getFieldValue("tongHopDuToan") || ""
        )})`
      ),
      createText(
        ", trong đó dự toán giai đoạn chuẩn bị đầu tư cụ thể như sau:"
      ),
    ]),
    ...createMultilineSections(
      formatAdditionalstimate(
        form.getFieldValue("selectedItems") || [],
        form.getFieldValue("itemAmounts") || []
      ),
      createParagraphJustify
    ),
    createParagraph(
      createTextItalics("(Chi tiết dự toán theo Phụ lục đính kèm)")
    ),

    createParagraphLeft([
      createTextBold("4) Nguồn vốn: "),
      createText(form.getFieldValue("nguonKinhPhi") || ""),
    ]),
    createParagraphLeft([
      createTextBold("5) Thời gian thực hiện: "),
      createText(
        formatYearRangeFromPicker(form.getFieldValue("thoiGian")) || ""
      ),
    ]),
    createParagraphJustify([
      createTextBold("6) Địa điểm thực hiện: "),
      createText(form.getFieldValue("diaDiem") || ""),
    ]),
    createParagraphJustify([
      createTextBold("7) Quy mô thực hiện: "),
      createText(form.getFieldValue("quyMo") || ""),
    ]),

    // Điều 2 & 3
    createParagraphJustify([
      createTextBold("Điều 2. "),
      createText(
        "Giao phòng ………… triển khai thực hiện theo đúng quy định hiện hành của nhà nước."
      ),
    ]),
    createParagraphJustify([
      createTextBold("Điều 3. "),
      createText(
        "Quyết định có hiệu lực kể từ ngày ký. Phòng ……… và các đơn vị có liên quan chịu trách nhiệm thực hiện Quyết định này./."
      ),
    ]),

    // Footer
    createDocumentFooter(
      ["Nơi nhận:", "- Như trên;", "- Lưu: VT."],
      "GIÁM ĐỐC"
    ),
  ];

  return createDocument(content);
};

/**
 * Template 4: Tờ trình phê duyệt kế hoạch lựa chọn nhà thầu
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
    createParagraph(createTextBold("TỜ TRÌNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      createTextBold(
        `Về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`
      )
    ),
    createParagraph(`Kính gửi: ${nguoiNhan}`),
    createParagraph(""),

    // Giới thiệu
    createParagraphJustify(
      `Phòng ………… kính trình Giám đốc xem xét, phê duyệt kế hoạch lựa chọn nhà thầu dự án "${tenDuAn}" trên cơ sở những nội dung dưới đây:`
    ),

    // I. Mô tả tóm tắt dự toán
    createParagraphLeft(createTextBold("I. Mô tả tóm tắt dự toán")),
    ...createProjectBasicInfo(form),

    // II. Căn cứ pháp lý
    createParagraphLeft(createTextBold("II. Căn cứ pháp lý")),
    ...createLegalBasis(
      form.getFieldValue("thongTinPhapLiChonNhaThau"),
      legalInfo
    ),
    createParagraphJustify([
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
    createParagraphLeft([
      createTextBold("III. Phần công việc đã thực hiện: "),
      createText(form.getFieldValue("congViecDaThucHien") || ""),
    ]),

    // IV. Phần công việc không áp dụng
    createParagraphLeft([
      createTextBold(
        "IV. Phần công việc không áp dụng được một trong các hình thức lựa chọn nhà thầu: "
      ),
      createText(form.getFieldValue("congViecKhongApDung") || ""),
    ]),

    // V. Phần công việc thuộc kế hoạch
    createParagraphLeft([
      createTextBold("V. Phần công việc thuộc kế hoạch lựa chọn nhà thầu: "),
      ...form
        .getFieldValue("congViecKeHoach")
        .split("\n")
        .map((item: string) => createText(item, { break: 1 })),
    ]),

    // VII. Kiến nghị
    createParagraphLeft(createTextBold("VII. Kiến nghị")),
    createParagraphJustify(
      `Trên cơ sở những nội dung phân tích nêu trên, kính trình ${nguoiNhan} xem xét, phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"./.`
    ),
    createParagraphLeft("Kính trình Giám đốc xem xét, quyết định./."),

    // Footer
    createDocumentFooter(["Nơi nhận:", "- Như trên;", "- Lưu VT."], "………"),
  ];

  return createDocument(content);
};

/**
 * Template 6: Quyết định phê duyệt kế hoạch lựa chọn nhà thầu
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
    createParagraph(createTextBold("QUYẾT ĐỊNH"), {
      spacing: { after: 100, before: 500 },
    }),
    createParagraph(
      createTextBold(
        `Về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}"`
      )
    ),
    createParagraph(createTextBold(`Kính gửi: ${nguoiNhan.toUpperCase()}`)),
    createParagraph(""),

    // Căn cứ pháp lý
    ...createLegalBasis(
      form.getFieldValue("pheDuyetPhapLiDuyetNhaThau"),
      legalInfo
    ),
    createParagraphJustify([
      createTextItalics("Căn cứ "),
      createTextItalics(
        `Quyết định số ………/QĐ- ..... ngày … tháng … năm ${currentYear}`,
        { color: "FF0000" }
      ),
      createTextItalics(
        ` của ${nguoiNhan} về phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}";`
      ),
    ]),
    createParagraphJustify([
      createTextItalics("Theo đề nghị của phòng ......... tại Tờ trình "),
      createTextItalics(`ngày     tháng    năm ${currentYear}`, {
        color: "FF0000",
        highlight: "yellow",
      }),
      createTextItalics(
        ` về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}";`
      ),
    ]),

    // Quyết định
    createParagraph(createTextBold("QUYẾT ĐỊNH"), {
      spacing: { after: 300, before: 500 },
    }),

    // Điều 1
    createParagraphJustify([
      createTextBold("Điều 1. "),
      createText(
        `Phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án "${tenDuAn}" với nội dung theo Phụ lục đính kèm.`
      ),
    ]),

    // Điều 2
    createParagraphJustify([
      createTextBold("Điều 2. "),
      createText(
        "Quyết định này có hiệu lực thi hành kể từ ngày ký. Phòng …….. và Trưởng các đơn vị có liên quan chịu trách nhiệm thực hiện Quyết định này./."
      ),
    ]),

    // Footer
    createDocumentFooter(
      ["Nơi nhận:", "- Như Điều 3;", "- Lưu: VT."],
      "GIÁM ĐỐC"
    ),
  ];

  return createDocument(content);
};
