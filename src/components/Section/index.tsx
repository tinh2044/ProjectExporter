/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'
import type { Section as SectionModel} from '@/models/project-form/section'
import type { Item } from '@/models/project-form/item'
import SectionItem from '@/components/Section/SectionItem'
import { nanoid } from 'nanoid'
import { Button, Card, Empty, Input, Space, Select } from 'antd'
import type { Selection as SelectionModel } from '@/models/project-form/selection'
import type { TextEditor as TextEditorModel } from '@/models/project-form/text-editor'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addItemToSection, removeItemFromSection, updateSectionTitle, updateItemInSection } from '@/store/slices/projectFormSlice'
import type { RootState } from '@/store'

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
  onDelete,
}: {
  sectionModel: SectionModel
  onDelete: (sectionId: string) => void
}) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState<string>(sectionModel.title || '')
  const [itemType, setItemType] = useState<keyof typeof ITEM_TYPES>('text')

  // Get current section from Redux state
  const currentSection = useAppSelector((state: RootState) =>
    state.projectForm.sections.find((s: SectionModel) => s.id === sectionModel.id)
  )
  const items = currentSection?.items || []

  const handleAddItem = (value: keyof typeof ITEM_TYPES) => {
    // console.log()
    const newItem = ITEM_TYPES[value].createItem();
    dispatch(addItemToSection({ sectionId: sectionModel.id, item: newItem }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItemFromSection({ sectionId: sectionModel.id, itemId }))
  }

  const handleChangeItem = useCallback((changed: Item) => {
    dispatch(updateItemInSection({ sectionId: sectionModel.id, item: changed }))
  }, [dispatch, sectionModel.id])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    dispatch(updateSectionTitle({ sectionId: sectionModel.id, title: value }))
  }

  return (
    <Card>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Tiêu đề của tờ trình"
          />
        </Space.Compact>

        <hr className="my-1 border-0 border-t-1 border-gray-500" />

        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          {items.map((item: Item) => (
            <SectionItem
              key={item.id}
              item={item}
              onChange={handleChangeItem}
              onDelete={handleRemoveItem}
            />
          ))}
          {items.length === 0 && (
            <Empty description="Chưa có mục nào trong phần này." />
          )}
        </Space>

        <Space>
          <Select
            value={[]}
            onSelect={(value) => {
              // setItemType()
              console.log(value);
              handleAddItem(value as keyof typeof ITEM_TYPES);
            }}
            options={itemTypes}
            style={{ width: 120 }}
            placeholder="Thêm mục"
          />
          {/* <Button type="dashed" onClick={}>
            Thêm mục
          </Button> */}
          <Button
            type="primary"
            onClick={() => {
              console.log("Section Model:", sectionModel);
            }}
          >
            Tạo tờ trình
          </Button>
          <Button danger onClick={() => onDelete(sectionModel.id)}>
            Xóa
          </Button>
        </Space>
      </Space>
    </Card>
  );
}

export default Section