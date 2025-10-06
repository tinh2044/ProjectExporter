/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'
import type { Section as SectionModel } from '@/models/project-form/section'
import type { Item } from '@/models/project-form/item'
import SectionItem from '@/components/Section/SectionItem'
import { nanoid } from 'nanoid'
import { Button, Card, Empty, Input, Space, Select } from 'antd'
import type { Selection as SelectionModel } from '@/models/project-form/selection'
import type { TextEditor as TextEditorModel } from '@/models/project-form/text-editor'

const ITEM_TYPES = {
  text: {
    label: 'Text',
    value: 'text',
    createItem: (): TextEditorModel => ({
      id: nanoid(6),
      title: 'Tiêu đề cho mục',
      content: '',
    }),
    onChange: (item: TextEditorModel, field: string, value: any): TextEditorModel => ({
      ...item,
      [field]: value
    })
  },
  selection: {
    label: 'Selection', 
    value: 'selection',
    createItem: (): SelectionModel => ({
      id: nanoid(6),
      title: 'Tiêu đề cho mục',
      values: [],
      options: [],
    }),
    onChange: (item: SelectionModel, field: string, value: any): SelectionModel => ({
      ...item,
      [field]: value
    })
  },
  // ratio: {
  //   label: 'Radio',
  //   value: 'ratio', 
  //   createItem: (): RatioModel => ({ ... }),
  //   onChange: (item: RatioModel, field: string, value: any): RatioModel => ({ ... })
  // },
  // image: {
  //   label: 'Hình ảnh',
  //   value: 'image',
  //   createItem: (): ImageModel => ({ ... }),
  //   onChange: (item: ImageModel, field: string, value: any): ImageModel => ({ ... })
  // }
} as const

const itemTypes = Object.values(ITEM_TYPES).map(type => ({
  label: type.label,
  value: type.value
}))

function Section({
  sectionModel,
  onUpdate,
  onDelete,
}: {
  sectionModel: SectionModel
  onUpdate: (updated: SectionModel) => void
  onDelete: (sectionId: string) => void
}) {

  const [title, setTitle] = useState<string>(sectionModel.title || '')
  const [items, setItems] = useState<Item[]>(sectionModel.items || [])
  const [itemType, setItemType] = useState<keyof typeof ITEM_TYPES>('text')

  const sync = useCallback((nextItems: Item[] = items, nextTitle: string = title) => {
    const updated: SectionModel = {
      ...sectionModel,
      title: nextTitle,
      items: nextItems,
    }
    onUpdate(updated)
  }, [sectionModel, onUpdate, items, title])

  const handleAddItem = () => {
    const newItem = ITEM_TYPES[itemType].createItem()
    const next = [...items, newItem]
    setItems(next)
    sync(next)
  }

  const handleRemoveItem = (itemId: string) => {
    const next = items.filter((i) => i.id !== itemId)
    setItems(next)
    sync(next)
  }

  const handleChangeItem = useCallback((changed: Item) => {
    const next = items.map((i) => {
      if (i.id === changed.id) {
        return { ...changed } 
      }
      return i
    })  
    setItems(next)
    sync(next) // Add sync to update parent
  }, [items, sync])

  return (
    <Card>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={title}
            onChange={(e) => {
              const val = e.target.value
              setTitle(val)
              sync(items, val)
            }}
            placeholder="Tiêu đề của tờ trình"
          />
          <Button danger onClick={() => onDelete(sectionModel.id)}>
            Xóa
          </Button>
        </Space.Compact>

        <hr className="my-1 border-0 border-t-1 border-gray-500" />

        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {items.map((item) => (
            <SectionItem
              key={item.id}
              item={item}
              onChange={handleChangeItem}
              onDelete={handleRemoveItem}
            />
          ))}
          {items.length === 0 && <Empty description="Chưa có mục nào trong phần này." />}
        </Space>

        <Space>
          <Select
            value={itemType}
            onChange={setItemType}
            options={itemTypes}
            style={{ width: 120 }}
            placeholder="Chọn loại mục"
          />
          <Button type="dashed" onClick={handleAddItem}>
            Thêm mục
          </Button>
          <Button 
            type="primary" 
            onClick={() => {
              console.log('Section Model:', sectionModel)
            }}
          >
            Tạo tờ trình
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

export default Section