declare module 'html-to-docx' {
  export default function htmlToDocx(
    html: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ): Promise<Blob>;
}
