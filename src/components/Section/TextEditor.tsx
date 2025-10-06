import { Input } from "antd";
import type { TextEditor } from "@/models/project-form/text-editor";
import { ProjectOutlined } from "@ant-design/icons";
function TextEditor({
  textEditor,
}: {
  textEditor: TextEditor;
}) {
  return (
    <Input
      prefix={<ProjectOutlined />}
      placeholder="Nhập nội dung"
      value={textEditor.content}
      onChange={(e) => { textEditor.content = e.target.value }}
    />
  );
}

export default TextEditor;
// Ensure this module is treated as a value module in strict verbatimModuleSyntax setups
export const TEXT_EDITOR_COMPONENT = true;
