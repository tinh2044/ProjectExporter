import type { Section } from "@/models/project-form/section";
import SectionComponent from "@/components/Section";
import { useMemo } from "react";
import { Button, Card, Empty, Space } from "antd";
import { nanoid } from "nanoid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSection, removeSection } from "@/store/slices/projectFormSlice";


const ProjectFormEditor = () => {
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.projectForm);

  const handleRemoveSection = (sectionId: string) => {
    dispatch(removeSection(sectionId));
  };

  const emptyState = useMemo(() => sections.length === 0, [sections.length]);

  return (
    <div className="max-w-4xl mx-auto py-6">

      <Space direction="vertical" size={12} style={{ width: "100%", marginTop: 16 }}>
        {sections.map((section) => (
          <SectionComponent
            key={section.id}
            sectionModel={section}
            onDelete={handleRemoveSection}
          />
        ))}
        {emptyState && (
          <Card>
            <Empty description="Chưa có tờ trình nào. Thêm một tờ trình mới để bắt đầu." />
          </Card>
        )}
      </Space>

      <div className="mt-4">
        <Button
          type="primary"
          onClick={() => {
            const newSection: Section = {
              id: nanoid(6),
              title: "Tiêu đề tờ trình",
              content: "",
              receiver: "",
              items: [],
            };
            dispatch(addSection(newSection));
          }}
        >
          Thêm tờ trình
        </Button>
      </div>
    </div>
  );
};

export default ProjectFormEditor;
