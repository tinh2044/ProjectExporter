import type { Section } from "@/models/project-form/section";
import SectionComponent from "@/components/Section";
import { useMemo, useState } from "react";
import { Button, Card, Empty, Space } from "antd";
import { nanoid } from "nanoid";


const ProjectFormEditor = () => {
  const [sections, setSections] = useState<Section[]>(() => []);

  const handleRemoveSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const handleUpdateSection = (updated: Section) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const emptyState = useMemo(() => sections.length === 0, [sections.length]);

  return (
    <div className="max-w-4xl mx-auto py-6">

      <Space direction="vertical" size={12} style={{ width: "100%", marginTop: 16 }}>
        {sections.map((section) => (
          <SectionComponent
            key={section.id}
            sectionModel={section}
            onUpdate={handleUpdateSection}
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
            setSections((prev) => [...prev, newSection]);
          }}
        >
          Thêm tờ trình
        </Button>
      </div>
    </div>
  );
};

export default ProjectFormEditor;
