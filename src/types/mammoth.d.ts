declare module "mammoth" {
  export function convertToHtml(
    input: { arrayBuffer: ArrayBuffer },
    options?: unknown
  ): Promise<{ value: string; messages?: Array<{ type: string; message: string }> }>;
}


