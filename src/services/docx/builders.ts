import {
  Paragraph,
  TextRun,
  AlignmentType,
  type IParagraphOptions,
  type IRunOptions,
} from "docx";
import { baseParagraphOpts, baseRunOpts } from "./constanst";
import { CONSTANTS } from "./constanst";
/**
 * Create TextRun with custom options
 */
export const createText = (text: string, options?: Partial<IRunOptions>): TextRun => {
  return new TextRun({
    text,
    ...baseRunOpts,
    ...options,
  });
};

/**
 * Create TextRun in bold
 */
export const textBold = (text: string, options?: Partial<IRunOptions>): TextRun => {
  return createText(text, { ...options, bold: true });
};

/**
 * Create TextRun in italics
 */
export const textItalics = (text: string, options?: Partial<IRunOptions>): TextRun => {
  return createText(text, { ...options, italics: true });
};

/**
 * Create Paragraph with multiple input types
 */
export const createParagraph = (
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
export const paragraphJustify = (
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
export const paragraphLeft = (
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
export const paragraphNoIndent = (
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
