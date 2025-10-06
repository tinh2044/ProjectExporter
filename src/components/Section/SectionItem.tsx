import React, { Suspense, useMemo } from 'react'
import type { Item } from '@/models/project-form/item'
import type { Selection as SelectionModel } from '@/models/project-form/selection'
import type { TextEditor as TextEditorModel } from '@/models/project-form/text-editor'
import { Button, Card, Input, Space } from 'antd'
import Selection from './Selection'
const TextEditorLazy = React.lazy(() => import('./TextEditor'))

function SectionItem({
  item,
  onChange,
  onDelete,
}: {
  item: Item | SelectionModel | TextEditorModel
  onChange: (item: Item) => void
  onDelete: (itemId: string) => void
}) {
  // Tự động detect loại item dựa trên properties
  const getItemType = (it: Item | SelectionModel | TextEditorModel): 'text' | 'selection' => {
    if ('values' in it && 'options' in it) return 'selection'
    if ('content' in it) return 'text'
    return 'text' // default
  }
  
  const itemType = getItemType(item)

  const selectionPlaceholder = useMemo(() => 'Chọn hoặc tìm kiếm', [])

  return (
    <Card size="small">
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={item.title}
            onChange={(e) => onChange({ ...item, title: e.target.value })}
            placeholder="Tiêu đề câu hỏi"
          />
          <Button danger onClick={() => onDelete(item.id)}>
            Xóa
          </Button>
        </Space.Compact>

        {itemType === 'selection' && (
          <Selection
            selectionModel={item as SelectionModel}
            loading={false}
            mode="multiple"
            placeholder={selectionPlaceholder}
            onChange={(vals) => {
              const updated: SelectionModel = { ...item, values: vals } as SelectionModel
              onChange(updated as unknown as Item)
            }}
            availableOptions={(item as SelectionModel).options || []}
          />
        )}

        {itemType === 'text' && (
          <Suspense fallback={null}>
            <TextEditorLazy
              textEditor={item as TextEditorModel}
              onChange={(content) => {
                const updated: TextEditorModel = { ...item, content } as TextEditorModel
                onChange(updated as unknown as Item)
              }}
            />
          </Suspense>
        )}
      </Space>
    </Card>
  )
}

export default SectionItem
