export interface GenerateDocxParams<T extends object> {
  templateBinary: Uint8Array;
  data: T;
  filename: string;
}

export async function generateAndDownloadDocx<T extends object>({
  templateBinary,
  data,
  filename,
}: GenerateDocxParams<T>): Promise<void> {
  const PizZip = (await import("pizzip")).default;
  const Docxtemplater = (await import("docxtemplater")).default;
  const { saveAs } = await import("file-saver");

  const zip = new PizZip(templateBinary);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data);

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }) as Blob;

  saveAs(blob, filename);
}

export interface GenerateFromHtmlParams {
  html: string;
  filename: string;
  options?: Parameters<typeof import("html-to-docx").default>[1];
}

export async function generateDocxFromHtml({ html, filename, options }: GenerateFromHtmlParams): Promise<void> {
  const htmlToDocx = (await import("html-to-docx")).default;
  const { saveAs } = await import("file-saver");

  const blob = await htmlToDocx(html, {
    // Reasonable defaults; can be overridden by caller
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
    ...options,
  });

  saveAs(blob, filename);
}

export async function docxToHtml(fileBinary: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ arrayBuffer: fileBinary }, {
    styleMap: [
      // Basic mapping; adjust as needed
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
    ],
  });
  return result.value;
}


// Utilities to load a .docx template and render with {key} placeholders
export type TemplateData = Record<string, unknown>;

async function fetchTemplateAsUint8Array(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function generateDocxFromTemplateUrl<T extends TemplateData>(
  url: string,
  data: T,
  filename: string,
): Promise<void> {
  const templateBinary = await fetchTemplateAsUint8Array(url);
  await generateAndDownloadDocx({ templateBinary, data, filename });
}

export async function generateDocxFromFile<T extends TemplateData>(
  file: File,
  data: T,
  filename: string,
): Promise<void> {
  const buffer = await file.arrayBuffer();
  const templateBinary = new Uint8Array(buffer);
  await generateAndDownloadDocx({ templateBinary, data, filename });
}


