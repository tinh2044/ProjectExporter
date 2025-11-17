import {
    AlignmentType,
    WidthType,
    VerticalAlign,
    BorderStyle,
    type IParagraphOptions,
    type IRunOptions,
} from "docx";


export const CONSTANTS = {
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

export const baseTableOpts = {
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

export const baseTableCellOpts = {
  verticalAlign: VerticalAlign.TOP,
};

export const baseRunOpts: IRunOptions = {
  font: CONSTANTS.FONT,
  size: CONSTANTS.FONT_SIZE,
};

export const baseParagraphOpts: IParagraphOptions = {
  spacing: {
    after: CONSTANTS.SPACING.AFTER,
    before: CONSTANTS.SPACING.BEFORE,
  },
  alignment: AlignmentType.CENTER,
  indent: { firstLine: CONSTANTS.INDENT.FIRST_LINE },
};
