import type { FormInstance } from "antd";
import {
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
  type IRunOptions,
  type ITableOptions,
  type ITableRowOptions,
  type ITableCellOptions,
  TableLayoutType,
} from "docx";
import {
  formatNumberWithDots,
} from "@/utils/formatters";
import type { EstimateCostData, EstimateCostRow } from "@/types";
import { baseTableCellOpts, baseTableOpts, CONSTANTS } from "./constanst";
import { createParagraph, textItalics } from "./builders";


interface CellCreatorOptions {
  bold?: boolean;
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  rowSpan?: number;
  columnSpan?: number;
  splitBr?: boolean; // Có split content theo <br> hay không (chỉ áp dụng với string)
  fontSize?: number; // Default: 24
  margins?: { top: number; bottom: number; left: number; right: number };
  spacing?: { after: number; before: number };
}

const createTableCellUnified = (
  content: string | Paragraph | Paragraph[],
  options: CellCreatorOptions = {}
): TableCell => {
  const {
    bold = false,
    alignment = AlignmentType.LEFT,
    rowSpan,
    columnSpan,
    splitBr = false,
    fontSize = 24,
    margins = { top: 80, bottom: 80, left: 100, right: 100 },
    spacing = { after: 50, before: 50 },
  } = options;

  // Xử lý content dựa trên type
  let children: FileChild[] = [];

  if (typeof content === "string") {
    // String: split theo <br> nếu cần, sau đó tạo Paragraph
    const textParts = splitBr ? content.split("<br>") : [content];
    children = textParts.map(
      (text) =>
        new Paragraph({
          children: [
            new TextRun({
              text: text || "",
              font: CONSTANTS.FONT,
              size: fontSize,
              bold,
            }),
          ],
          alignment,
          spacing,
        })
    );
  } else if (Array.isArray(content)) {
    // Paragraph[]: 
    children = content;
  } else {
    // Paragraph:
    children = [content];
  }

  return new TableCell({
    children,
    verticalAlign: VerticalAlign.CENTER,
    margins,
    rowSpan,
    columnSpan,
  });
};

/**
 * Create table with custom options
 */
export const createTable = (
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
export const createTableRow = (
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
export const createTableCell = (
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
 * Create Plan Implementation Appendix Table
 */
export const createPlanImplementationAppendixTable = (
  estimateData: EstimateCostData,
  form: FormInstance
): Table => {
  const rows = estimateData.rows || [];
  const lengthRows = rows.length;
  const WIDTHS = {
    STT: 800,
    NOI_DUNG: 2000,
    DE_XUAT: 1800,
    CAN_CU: 2000,
    TRICH_DAN: 4000,
  };

  const cell = (
    content: string | Paragraph | Paragraph[],
    options?: {
      bold?: boolean;
      alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
      rowSpan?: number;
      columnSpan?: number;
    }
  ): TableCell => {
    return createTableCellUnified(content, {
      bold: options?.bold,
      alignment: options?.alignment || AlignmentType.LEFT,
      rowSpan: options?.rowSpan,
      columnSpan: options?.columnSpan,
      fontSize: 24,
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      spacing: { after: 50, before: 50 },
    });
  };

    const createCellItalics = (text: string, options?: Partial<IRunOptions>): TextRun => {
    return textItalics(text, { size: 24, ...options });
  };

  const createCellParagraph = (
    content: string | TextRun | TextRun[],
    runOpts?: Partial<IRunOptions>
  ): Paragraph => {
    return createParagraph(
      content,
      {
        ...{ spacing: { after: 20, before: 20 }, indent: { firstLine: 0 } },
        alignment: AlignmentType.JUSTIFIED,
      },
      { ...runOpts, size: 24 }
    );
  };

  // Header row
  const headerStyle = { bold: true, alignment: AlignmentType.CENTER };
  const headerRow = new TableRow({
    children: [
      cell("STT", headerStyle),
      cell("Nội dung", headerStyle),
      cell("Đề xuất", headerStyle),
      cell("Căn cứ pháp lý áp dụng", headerStyle),
      cell("Trích dẫn nội dung căn cứ pháp lý", headerStyle),
    ],
  });

  // Main data row
  const mainRow = new TableRow({
    children: [
      cell("1", { alignment: AlignmentType.CENTER }),
      cell("Cơ số phân chia các gói thầu", {
        bold: true,
      }),
      cell(`0${lengthRows} gói thầu`),
      cell(
        "Mẫu số 02A. Mẫu tờ trình kế hoạch lựa chọn nhà thầu kèm theo Thông tư số 79/2025/TT-BTC ngày 04 tháng 8 năm 2025",
      ),
      cell([
        createCellParagraph(
          createCellItalics(
            "Việc phân chia dự án, dự toán mua sắm thành các gói thầu phát sinh từ một hoặc nhiều nguyên tắc sau:"
          )
        ),
        createCellParagraph(
          createCellItalics(
            "+ Đảm bảo tính động bộ về mặt kỹ thuật và công nghệ của dự án, dự toán mua sắm, không được chia công việc của dự án, dự toán mua sắm thành các gói thầu quá nhỏ, làm mất sự thống nhất, động bộ về kỹ thuật và công nghệ;"
          )
        ),
        createCellParagraph(
          createCellItalics(
            "+ Đảm bảo tiến độ thực hiện dự án, dự toán mua sắm;"
          )
        ),
        createCellParagraph(
          createCellItalics(
            `+ Đảm bảo quy mô hợp lý (phù hợp với điều kiện của dự án, dự toán mua sắm năng lực của nhà thầu hiện tại và phù hợp với sự phát triển của thị trường trong nước...).`
          )
        ),
      ]),
    ],
  });

  const subRows = rows.map(
    (row, index) =>
      new TableRow({
        children: [
          cell(`1.${index + 1}`, { alignment: AlignmentType.CENTER }),
          cell(row.costName, {
            alignment: AlignmentType.LEFT,
          }),
          ...(index === 0
            ? [
                cell("Hàng hóa Tư vấn", {
                  alignment: AlignmentType.LEFT,
                  rowSpan: lengthRows,
                }),
                cell("Khoản 4 Điều 4 Luật Đấu thầu năm 2023", {
                  alignment: AlignmentType.LEFT,
                  rowSpan: lengthRows,
                }),
                cell(
                  createCellParagraph(
                    createCellItalics(
                      `4. Dịch vụ tư vấn là một hoặc một số hoạt động dịch vụ bao gồm: lập, đánh giá báo cáo quy hoạch, tổng sơ đồ phát triển, kiến trúc; khảo sát, lập báo cáo nghiên cứu tiền khả thi, báo cáo đề xuất chủ trương đầu tư, hồ sơ đề nghị chấp thuận chủ trương đầu tư, báo cáo nghiên cứu khả thi, báo cáo kinh tế - kỹ thuật, báo cáo đánh giá tác động môi trường; khảo sát, lập thiết kế, dự toán; tư vấn đấu thầu; tư vấn thẩm tra, thẩm định; tư vấn giám sát; tư vấn quản lý dự án; tư vấn thu xếp tài chính; kiểm toán và các dịch vụ tư vấn khác`
                    )
                  ),
                  { rowSpan: lengthRows }
                ),
              ]
            : []),
        ],
      })
  );

  // Main row 2 - Giá gói thầu
  const mainRow2 = new TableRow({
    children: [
      cell("2", { alignment: AlignmentType.CENTER }),
      cell("Giá gói thầu", {bold: true }),
      cell(""),
      cell(""),
      cell(""),
    ],
  });

  const subRows2 = rows.map(
    (row, index) =>
      new TableRow({
        children: [
          cell(`2.${index + 1}`, { alignment: AlignmentType.CENTER }),
          cell(`${row.costName}`, {
          }),
          cell(formatNumberWithDots(row.moneyAfterTax), {
          }),
          ...(index === 0
            ? [
                cell("Điểm a khoản 2 Điều 18 Nghị định số 214/2025/NĐ-CP", {
                  rowSpan: 2,
                }),
                cell(
                  [
                    createCellParagraph(
                      createCellItalics("2. Căn cứ xác định giá gói thầu: ")
                    ),
                    createCellParagraph(
                      createCellItalics(
                        "Giá gói thầu được lập căn cứ theo một trong các thông tin sau:"
                      )
                    ),
                    createCellParagraph(
                      createCellItalics(
                        "a) Dự toán gói thầu được duyệt (nếu có) trong trường hợp pháp luật quản lý ngành, lĩnh vực có quy định về việc lập dự toán hoặc có hướng dẫn về định mức, đơn giá. Trường hợp chưa đủ điều kiện lập dự toán, giá gói thầu được xác định trên cơ sở một hoặc một số thông tin sau: giá trung bình theo thống kê của các dự án, gói thầu đã thực hiện trong khoảng thời gian xác định; tổng mức đầu tư hoặc ước tính tổng mức đầu tư theo suất vốn đầu tư, dự kiến giá trị dự toán mua sắm; định mức lương chuyên gia và số ngày công; các thông tin liên quan khác;"
                      )
                    ),
                    createCellParagraph([
                      createCellItalics(
                        `Quyết định số ………/QĐ-  ..... ngày … tháng … năm ${new Date().getFullYear()} của ${form.getFieldValue(
                          "chuDauTu"
                        )} về phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án “${form.getFieldValue(
                          "tenDuAn"
                        )}”)`,
                        {highlight: "yellow" }
                      ),
                    ]),
                  ],

                  { rowSpan: 2 }
                ),
              ]
            : []),
        ],
      })
  );

  const mainRow3 = new TableRow({
    children: [
      cell("3", { alignment: AlignmentType.CENTER }),
      cell("Nguồn vốn", { bold: true }),
      cell(form.getFieldValue("nguonKinhPhi")),
      cell(
        "Công văn số 490/UBND-VX ngày 24 tháng 7 năm 2025 của Ủy ban nhân dân Thành phố về điều chỉnh chủ trương thực hiện các hoạt động ứng dụng công nghệ thông tin sử dụng kinh phí chi thường xuyên năm 2025",
      ),
      cell(""),
    ],
  });

  const mainRow4 = new TableRow({
    children: [
      cell("4", { alignment: AlignmentType.CENTER }),
      cell("Hình thức lựa chọn nhà thầu", {
        bold: true,
      }),
      cell(""),
      cell(""),
    ],
  });

  const subRows4 = rows.map(
    (row, index) =>
      new TableRow({
        children: [
          cell(`4.${index + 1}`, { alignment: AlignmentType.CENTER }),
          cell(`Tư vấn_${row.costName}`),
          ...(index === 0
            ? [
                cell("Chỉ định thầu rút gọn", {
                  rowSpan: lengthRows,
                }),
              ]
            : []),
          cell(""),
          cell("")
        ],
      })
  );

  const mainRow5 = new TableRow({
    children: [
      cell("5", { alignment: AlignmentType.CENTER }),
      cell("Phương thức lựa chọn nhà thầu", {
        bold: true,
      }),
      cell(""),
      cell(""),
      cell(""),
    ],
  });

  const subRows5 = new TableRow({
    children: [
      cell("5.1", { alignment: AlignmentType.CENTER }),
      cell(
        [
          ...rows.map((row, i) =>
            createCellParagraph(
              `Tư vấn_${row.costName}${i == lengthRows - 1 ? "." : ";"}`,
            )
          ),
        ],
        {bold: true }
      ),
      cell(""),
      cell(
        "Mẫu số 02A. Mẫu tờ trình kế hoạch lựa chọn nhà thầu kèm theo Thông tư số 79/2025/TT-BTC ngày 04 tháng 8 năm 2025"
      ),
      cell([
        createCellParagraph(
          "(7) Phương thức lựa chọn nhà thầu thực hiện theo quy định tại Mục 2 Chương II Luật Đấu thầu (được sửa đổi, bổ sung tại khoản 18, 19 Điều 1 Luật Đấu thầu số 90/2025/QH15). Trong đó, phương thức một giai đoạn hai túi hồ sơ được áp dụng đối với: Đấu thầu rộng rãi, đấu thầu hạn chế đối với gói thầu cung cấp dịch vụ tư vấn; Đấu thầu rộng rãi đối với gói thầu hỗn hợp tổ chức đấu thầu quốc tế quy định tại điểm b khoản 1 Điều 11 Luật Đấu thầu, đấu thầu hạn chế đối với gói thầu quy định tại khoản 1 Điều 22 của Luật Đấu thầu (được sửa đổi, bổ sung theo quy định tại khoản 13 Điều 1 Luật số 90/2025/QH15); Đấu thầu rộng rãi, đấu thầu hạn chế đối với gói thầu mua thuốc, vật tư y tế, thiết bị y tế; đấu thầu rộng rãi gói thầu có yêu cầu sử dụng công nghệ hoặc sản phẩm thuộc Danh mục công nghệ cao được ưu tiên đầu tư phát triển, Danh mục sản phẩm công nghệ cao được khuyến khích phát triển, Danh mục công nghệ chiến lược và sản phẩm công nghệ chiến lược theo quy định của pháp luật về khoa học, công nghệ và đổi mới sáng tạo, pháp luật về công nghệ cao theo quy định tại khoản 1a Điều 31 Luật Đấu thầu (được sửa đổi, bổ sung theo quy định tại điểm b khoản 19 Điều 1 Luật số 90/2025/QH15).",
          { italics: true }
        ),
        createCellParagraph(
          createCellItalics(
            "Đối với gói thầu áp dụng hình thức chỉ định thầu theo quy trình rút gọn, tự thực hiện, tham gia thực hiện của cộng đồng, đàm phán giá, chào giá trực tuyến theo quy trình rút gọn, mua sắm trực tuyến, lựa chọn nhà thầu trong trường hợp đặc biệt thì không ghi nội dung này.",
          )
        ),
      ]),
    ],
  });

  const mainRow6 = new TableRow({
    children: [
      cell("6", { alignment: AlignmentType.CENTER }),
      cell("Thời gian tổ chức lựa chọn nhà thầu", {
        bold: true,
      }),
      cell(""),
      cell(""),
      cell(""),
    ],
  });

  const subRows6 = [
    new TableRow({
      children: [
        cell("6.1", { alignment: AlignmentType.CENTER, rowSpan: 2 }),
        cell(
          [
            ...rows.map((row, i) =>
              createCellParagraph(
                `Tư vấn_${row.costName}${i == lengthRows - 1 ? "." : ";"}`,
              )
            ),
          ],
          { bold: true, rowSpan: 2 }
        ),
        cell("15 ngày", { rowSpan: 2 }),
        cell(
          "Điều 1 Khoản 27 của Luật số 90/2025/QH15 (Sửa đổi, bổ sung Điều 45 của Luật Đấu thầu năm 2023)"
        ),
        cell([
          createCellParagraph(
            [
              createCellItalics(
                "2. Đối với các công việc khác ngoài quy định tại khoản 1 Điều này, ",
              ),

              createCellItalics(
                "chủ đầu tư có trách nhiệm quyết định thời gian thực hiện trên cơ sở bảo đảm tiến độ của dự án, gói thầu.",
                { bold: true }
              ),
            ],
          ),
        ]),
      ],
    }),
    new TableRow({
      children: [
        cell(
          createCellParagraph(
            "Vận dụng Khoản 1 Điều 80 Nghị định số 214/2025/NĐ-CP",
            { color: "FF0000" }
          )
        ),
        cell(
          createCellParagraph(
            "Đối với gói thầu thuộc trường hợp quy định tại khoản 1 Điều 78 của Nghị định này, căn cứ quy mô, tính chất của gói thầu và thông tin sơ bộ về nhà thầu có khả năng thực hiện gói thầu, chủ đầu tư hoặc cơ quan trực tiếp quản lý gói thầu xác định và giao cho nhà thầu có năng lực, kinh nghiệm thực hiện ngay gói thầu. Trong thời hạn 15 ngày kể từ ngày bắt đầu thực hiện gói thầu, các bên phải hoàn thiện thủ tục chỉ định thầu quy định tại khoản 3 Điều này. Việc thực hiện chỉ định thầu không phải đáp ứng các điều kiện quy định tại khoản 2 Điều 79 của Nghị định này",
            { color: "FF0000", italics: true }
          )
        ),
      ],
    }),
  ];
  const mainRow7 = new TableRow({
    children: [
      cell("7", { alignment: AlignmentType.CENTER }),
      cell("Thời gian tổ chức lựa chọn nhà thầu", {
        bold: true,
      }),
      cell(""),
      cell(""),
      cell(
        createCellParagraph(
          createCellItalics(
            "Kế hoạch lựa chọn nhà thầu phải xác định cụ thể loại hợp đồng theo quy định tại Điều 64 của Luật này để làm căn cứ lập hồ sơ mời quan tâm, hồ sơ mời sơ tuyển, hồ sơ mời thầu, hồ sơ yêu cầu; ký kết hợp đồng",
          )
        )
      ),
    ],
  });

  const subRows7 = [
    new TableRow({
      children: [
        cell("7.1", { alignment: AlignmentType.CENTER, rowSpan: 2 }),
        cell(
          [
            ...rows.map((row, i) =>
              createCellParagraph(
                `Tư vấn_${row.costName}${i == lengthRows - 1 ? "." : ";"}`,

              )
            ),
          ],
          { bold: true, rowSpan: 2 }
        ),
        cell("Quý IV/2025", { rowSpan: 2 }),
        cell("Khoản 5 Điều 39 Luật Đấu thầu năm 2023"),
        cell([
          createCellParagraph(
            createCellItalics("5. Thời gian tổ chức lựa chọn nhà thầu:", {
            })
          ),
          createCellParagraph(
            [
              createCellItalics(
                "Kế hoạch lựa chọn nhà thầu phải nêu rõ thời gian tổ chức lựa chọn nhà thầu và thời gian bắt đầu tổ chức lựa chọn nhà thầu. Thời gian bắt đầu tổ chức lựa chọn nhà thầu được tính từ khi phát hành hồ sơ mời thầu, hồ sơ yêu cầu, ",
              ),
              createCellItalics("được ghi rõ theo tháng hoặc quý trong năm.", {
                bold: true,
              }),
            ],
          ),
        ]),
      ],
    }),
    new TableRow({
      children: [
        cell(
          createCellParagraph(
            "Vận dụng Khoản 1 Điều 80 Nghị định số 214/2025/NĐ-CP",
            { color: "FF0000" }
          )
        ),
        cell(
          createCellParagraph(
            createCellItalics(
            "Đối với gói thầu thuộc trường hợp quy định tại khoản 1 Điều 78 của Nghị định này, căn cứ quy mô, tính chất của gói thầu và thông tin sơ bộ về nhà thầu có khả năng thực hiện gói thầu, chủ đầu tư hoặc cơ quan trực tiếp quản lý gói thầu xác định và giao cho nhà thầu có năng lực, kinh nghiệm thực hiện ngay gói thầu. Trong thời hạn 15 ngày kể từ ngày bắt đầu thực hiện gói thầu, các bên phải hoàn thiện thủ tục chỉ định thầu quy định tại khoản 3 Điều này. Việc thực hiện chỉ định thầu không phải đáp ứng các điều kiện quy định tại khoản 2 Điều 79 của Nghị định này",
            { color: "FF0000"}
          )
        ))
      ],
    }),
  ];

  const mainRow8 = new TableRow({
    children: [
      cell("8", { alignment: AlignmentType.CENTER, rowSpan: 2 }),
      cell("Loại hợp đồng", {
        bold: true,
        rowSpan: 2,
      }),
      cell("Trọn gói", { rowSpan: 2 }),
      cell("Điểm a Khoản 6 Điều 39 Luật Đấu thầu năm 2023"),
      cell(""),
    ],
  });

  const subRows8 = [
    new TableRow({
      children: [
        cell("Điểm a Khoản 1 Điều 64 Luật Đấu thầu năm 2023"),
        cell([
          createCellParagraph(
            [
              createCellItalics("Hợp đồng trọn gói: ", {
                bold: true,
              }),

              createCellItalics(
                "Hợp đồng trọn gói được áp dụng đối với gói thầu mà tại thời điểm lựa chọn nhà thầu, phạm vi công việc, yêu cầu kỹ thuật, thời gian thực hiện gói thầu được xác định rõ, ít có khả năng thay đổi về khối lượng, yêu cầu kỹ thuật, các điều kiện không lường trước được;"
              ),
            ],
          ),
          createCellParagraph(
            createCellItalics(
              "b) Khi áp dụng hợp đồng trọn gói, giá gói thầu làm căn cứ xét duyệt trúng thầu bao gồm chi phí dự phòng cho các yếu tố rủi ro về khối lượng công việc và trượt giá có thể xảy ra trong quá trình thực hiện hợp đồng tương ứng với trách nhiệm quản lý rủi ro giao cho nhà thầu trong gói thầu. Giá dự thầu phải bao gồm tất cả chi phí cho các yếu tố rủi ro về khối lượng công việc và trượt giá có thể phát sinh trong quá trình thực hiện hợp đồng tương ứng với trách nhiệm của nhà thầu trong việc thực hiện gói thầu;"
            )
          ),
          createCellParagraph(
            createCellItalics(
              "c) Giá hợp đồng không thay đổi trong suốt thời gian thực hiện hợp đồng đối với phạm vi công việc, yêu cầu kỹ thuật và điều khoản quy định trong hợp đồng, trừ trường hợp bất khả kháng và thay đổi phạm vi công việc phải thực hiện dẫn đến giá hợp đồng thay đổi;"
            )
          ),
        ]),
      ],
    }),
  ];

  const mainRow9 = new TableRow({
    children: [
      cell("9", { alignment: AlignmentType.CENTER }),
      cell("Thời gian thực hiện gói thầu", {
        bold: true,
      }),
      cell(""),
      cell(""),
      cell(""),
    ],
  });

  const subRows9 = rows.map((row, i) => {
    return new TableRow({
      children: [
        cell(`9.${i + 1}`, { alignment: AlignmentType.CENTER }),
        cell(`Tư vấn_${row.costName}`),
        cell(""),
        ...(i === 0
          ? [
              cell("Khoản 7 Điều 39 Luật Đấu thầu năm 2023", {
                rowSpan: 2,
              }),
              cell(
                createCellParagraph([
                  createCellItalics("Thời gian thực hiện gói thầu được tính "),
                  textItalics(
                    "từ ngày hợp đồng có hiệu lực đến ngày nghiệm thu hoàn thành công trình, hàng hóa ",
                    { bold: true }
                  ),
                  createCellItalics(
                    "(bao gồm cả dịch vụ liên quan, nếu có), dịch vụ phi tư vấn, tư vấn.Thời gian thực hiện gói thầu được tính theo số ngày, số tuần, số tháng hoặc số năm, không bao gồm thời gian hoàn thành nghĩa vụ bảo hành, thời gian giám sát tác giả đối với gói thầu tư vấn(nếu có)."
                  ),
                ]),
                { rowSpan: 2 }
              ),
            ]
          : []),
      ],
    });
  });

  const mainRow10 = new TableRow({
    children: [
      cell("10", { alignment: AlignmentType.CENTER }),
      cell("Tùy chọn mua thêm", {
        bold: true,
      }),
      cell("Không áp dụng"),
      cell(
        "Mẫu số 02A. Mẫu tờ trình kế hoạch lựa chọn nhà thầu kèm theo Thông tư số 79/2025/TT-BTC ngày 04 tháng 8 năm 2025"
      ),
      cell(
        createCellParagraph([
          createCellItalics(
            "(12) Tùy chọn mua thêm chỉ áp dụng đối với gói thầu đấu thầu rộng rãi, đàm phán giá và thực hiện theo quy định tại khoản 8 Điều 39 của Luật Đấu thầu. Trường hợp áp dụng tùy chọn mua thêm thì ghi rõ khối lượng, số lượng có thể mua bổ sung theo tỷ lệ phần trăm so với khối lượng tương ứng của hợp đồng nhưng bảo đảm không vượt 30%; nêu giá trị ước tính tương ứng. "
          ),
          createCellItalics(
            "(Trường hợp không áp dụng tùy chọn mua thêm thì ghi “không áp dụng”."
          ),
        ])
      ),
    ],
  });
  return new Table({
    rows: [
      headerRow,
      mainRow,
      ...subRows,
      mainRow2,
      ...subRows2,
      mainRow3,
      mainRow4,
      ...subRows4,
      mainRow5,
      subRows5,
      mainRow6,
      ...subRows6,
      mainRow7,
      ...subRows7,
      mainRow8,
      ...subRows8,
      mainRow9,
      ...subRows9,
      mainRow10,
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths: [
      WIDTHS.STT,
      WIDTHS.NOI_DUNG,
      WIDTHS.DE_XUAT,
      WIDTHS.CAN_CU,
      WIDTHS.TRICH_DAN,
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
 * Create appendix table
 */
export const createAppendixTable = (estimateData: EstimateCostData): Table => {
  const appendixRows = estimateData.rows || [];

  const WIDTHS = {
    STT: 1000,
    NOI_DUNG: 2400,
    DIEN_GIAI: 2400,
    GIA_TRI: 2100,
    GHI_CHU: 8700,
  };

  // Header row

  const headerRowStyle = {
    bold: true,
    alignment: AlignmentType.LEFT,
    fontSize: 26,
    spacing: { after: 0, before: 0 },
  };

  const headerRow = new TableRow({
    children: [
      createTableCellUnified("STT", headerRowStyle),
      createTableCellUnified("Nội dung", headerRowStyle),
      createTableCellUnified("Diễn giải", headerRowStyle),
      createTableCellUnified("Giá trị tạm tính (đồng)", headerRowStyle),
      createTableCellUnified("Ghi chú", headerRowStyle),
    ],
  });

  // Data rows
  const dataRows = appendixRows.map(
    (row: EstimateCostRow, index) =>
      new TableRow({
        children: [
          createTableCellUnified(String(index + 1), {
            splitBr: true,
            spacing: { after: 0, before: 0 },
          }),
          createTableCellUnified(row.costName, {
            splitBr: true,
            spacing: { after: 0, before: 0 },
          }),
          createTableCellUnified(row.formula || "", {
            splitBr: true,
            spacing: { after: 0, before: 0 },
          }),
          createTableCellUnified(formatNumberWithDots(row.moneyAfterTax), {
            splitBr: true,
            spacing: { after: 0, before: 0 },
          }),
          createTableCellUnified(row.note || "", {
            splitBr: true,
            spacing: { after: 0, before: 0 },
          }),
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
 * Create contractor selection summary table
 */
export const createContractorSelectionTable = (
  completedWork: number = 0,
  nonApplicableWork: number = 0,
  plannedWork: number = 0
): Table => {
  const totalWork = completedWork + nonApplicableWork + plannedWork;

  // Helper: Create cell with borders and custom styling
  const createCell = (
    content: string,
    options?: {
      bold?: boolean;
      alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
      columnSpan?: number;
    }
  ): TableCell => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: content,
              font: CONSTANTS.FONT,
              size: 24,
              bold: options?.bold || false,
            }),
          ],
          alignment: options?.alignment || AlignmentType.LEFT,
          spacing: { after: 80, before: 80 },
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 0, bottom: 0, left: 150, right: 150 },
      columnSpan: options?.columnSpan,
    });
  };

  // Header row
  const headerRow = new TableRow({
    children: [
      createCell("STT", { bold: true, alignment: AlignmentType.CENTER }),
      createCell("Nội dung", { bold: true, alignment: AlignmentType.CENTER }),
      createCell("Giá trị (VNĐ)", {
        bold: true,
        alignment: AlignmentType.CENTER,
      }),
    ],
  });

  // Data rows
  const row1 = new TableRow({
    children: [
      createCell("1", { alignment: AlignmentType.CENTER }),
      createCell("Tổng giá trị phần công việc đã thực hiện"),
      createCell(formatNumberWithDots(completedWork), {
        alignment: AlignmentType.RIGHT,
      }),
    ],
  });

  const row2 = new TableRow({
    children: [
      createCell("2", { alignment: AlignmentType.CENTER }),
      createCell(
        "Tổng giá trị phần công việc không áp dụng được một trong các hình thức lựa chọn nhà thầu"
      ),
      createCell(formatNumberWithDots(nonApplicableWork), {
        alignment: AlignmentType.RIGHT,
      }),
    ],
  });

  const row3 = new TableRow({
    children: [
      createCell("3", { alignment: AlignmentType.CENTER }),
      createCell(
        "Tổng giá trị phần công việc thuộc kế hoạch lựa chọn nhà thầu"
      ),
      createCell(formatNumberWithDots(plannedWork), {
        alignment: AlignmentType.RIGHT,
      }),
    ],
  });

  // Summary rows
  const totalRow = new TableRow({
    children: [
      createCell("Tổng giá trị các phần công việc", {
        bold: true,
        alignment: AlignmentType.RIGHT,
        columnSpan: 2,
      }),
      createCell(formatNumberWithDots(totalWork), {
        bold: true,
        alignment: AlignmentType.RIGHT,
      }),
    ],
  });

  const grandTotalRow = new TableRow({
    children: [
      createCell("Tổng dự toán mua sắm", {
        bold: true,
        alignment: AlignmentType.RIGHT,
        columnSpan: 2,
      }),
      createCell(formatNumberWithDots(totalWork), {
        bold: true,
        alignment: AlignmentType.RIGHT,
      }),
    ],
  });

  // Create table with borders
  return new Table({
    rows: [headerRow, row1, row2, row3, totalRow, grandTotalRow],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths: [1000, 8500, 3000], // STT, Nội dung, Giá trị
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

export const createContractorPlanAppendixTable = (
  estimateData: EstimateCostData,
  chuDauTu: string,
  nguonVon: string
): Table => {
  const rows = estimateData.rows || [];
  const totalAmount = rows.reduce(
    (sum, row) => sum + (row.moneyAfterTax || 0),
    0
  );

  const WIDTHS = {
    STT: 800,
    TEN_CHU_DAU_TU: 1500,
    TEN_GOI_THAU: 1800,
    TOM_TAT: 2000,
    GIA_GOI_THAU: 2500,
    NGUON_VON: 1500,
    HINH_THUC: 1500,
    PHUONG_THUC: 1500,
    THOI_GIAN_LUA_CHON: 1500,
    THOI_GIAN_BAT_DAU: 1500,
    LOAI_HOP_DONG: 1500,
    THOI_GIAN_THUC_HIEN: 1500,
    TUY_CHON: 1500,
  };

  // Helper: Wrapper để sử dụng createTableCellUnified với margin khác
  const cell = (
    content: string,
    options?: {
      bold?: boolean;
      alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
      rowSpan?: number;
      columnSpan?: number;
    }
  ): TableCell => {
    return createTableCellUnified(content, {
      bold: options?.bold,
      alignment: options?.alignment || AlignmentType.CENTER,
      rowSpan: options?.rowSpan,
      columnSpan: options?.columnSpan,
      fontSize: 24,
      margins: { top: 0, bottom: 0, left: 20, right: 20 },
      spacing: { after: 50, before: 50 },
    });
  };

  // Header row 1
  const headerRow1 = new TableRow({
    children: [
      cell("Stt", { bold: true, rowSpan: 2 }), // STT - merge 2 rows
      cell("Tên chủ đầu tư", { bold: true, rowSpan: 2 }), // Tên chủ đầu tư - merge 2 rows
      cell("Tên gói thầu", { bold: true, columnSpan: 2 }), // Tên gói thầu - merge 2 columns
      cell("Giá gói thầu (VND)", { bold: true, rowSpan: 2 }), // Giá gói thầu - merge 2 rows
      cell("Nguồn vốn", { bold: true, rowSpan: 2 }), // Nguồn vốn - merge 2 rows
      cell("Hình thức lựa chọn nhà thầu", { bold: true, rowSpan: 2 }), // merge 2 rows
      cell("Phương thức lựa chọn nhà thầu", { bold: true, rowSpan: 2 }), // merge 2 rows
      cell("Thời gian lựa chọn nhà thầu", { bold: true, rowSpan: 2 }), // merge 2 rows
      cell("Thời gian bắt đầu tổ chức lựa chọn nhà thầu", {
        bold: true,
        rowSpan: 2,
      }), // merge 2 rows
      cell("Loại hợp đồng", { bold: true, rowSpan: 2 }), // merge 2 rows
      cell("Thời gian thực hiện gói thầu", { bold: true, rowSpan: 2 }), // merge 2 rows
      cell("Tùy chọn mua thêm", { bold: true, rowSpan: 2 }), // merge 2 rows
    ],
  });

  // Header row 2 - Row thứ hai chỉ có 2 cells cho "Tên gói thầu"
  const headerRow2 = new TableRow({
    children: [
      cell("Tên gói thầu", { bold: true }),
      cell("Tóm tắt công việc chính của gói thầu", { bold: true }),
    ],
  });

  // Data rows
  const dataRows = rows.map(
    (row: EstimateCostRow, index: number) =>
      new TableRow({
        children: [
          cell(String(index + 1), { alignment: AlignmentType.CENTER }),
          cell(chuDauTu, { alignment: AlignmentType.LEFT }),
          cell(`Tư vấn_${row.costName}`, { alignment: AlignmentType.LEFT }),
          cell(row.costDesc || "", {
            alignment: AlignmentType.LEFT,
          }),
          cell(formatNumberWithDots(row.moneyAfterTax), {
            alignment: AlignmentType.LEFT,
          }),
          cell(nguonVon, { alignment: AlignmentType.CENTER }),
          cell("Chỉ định thầu rút gọn", { alignment: AlignmentType.CENTER }),
          cell("", { alignment: AlignmentType.CENTER }),
          cell("15 ngày", { alignment: AlignmentType.CENTER }),
          cell("Quý IV/2025", { alignment: AlignmentType.CENTER }),
          cell("Trọn gói", { alignment: AlignmentType.CENTER }),
          cell(row.costName.includes("Lập") ? "60 ngày" : "30 ngày", {
            alignment: AlignmentType.CENTER,
          }),
          cell("Không áp dụng", { alignment: AlignmentType.CENTER }),
        ],
      })
  );

  // Total row
  const totalRow = new TableRow({
    children: [
      cell("Tổng giá gói thầu", {
        bold: true,
        columnSpan: 4,
        alignment: AlignmentType.CENTER,
      }),
      cell(formatNumberWithDots(totalAmount), {
        bold: true,
        alignment: AlignmentType.RIGHT,
      }),
      cell("", { columnSpan: 5 }),
      cell("", { columnSpan: 1 }),
      cell("", { columnSpan: 1 }),
      cell("", { columnSpan: 1 }),
    ],
  });

  return new Table({
    rows: [headerRow1, headerRow2, ...dataRows, totalRow],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths: [
      WIDTHS.STT,
      WIDTHS.TEN_CHU_DAU_TU,
      WIDTHS.TEN_GOI_THAU,
      WIDTHS.TOM_TAT,
      WIDTHS.GIA_GOI_THAU,
      WIDTHS.NGUON_VON,
      WIDTHS.HINH_THUC,
      WIDTHS.PHUONG_THUC,
      WIDTHS.THOI_GIAN_LUA_CHON,
      WIDTHS.THOI_GIAN_BAT_DAU,
      WIDTHS.LOAI_HOP_DONG,
      WIDTHS.THOI_GIAN_THUC_HIEN,
      WIDTHS.TUY_CHON,
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