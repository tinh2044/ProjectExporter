import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Section } from '@/models/project-form/section';
import type { Item } from '@/models/project-form/item';
import type { ProjectForm } from '@/models/project-form';
import type { Project } from '@/models/project';

const initialState: ProjectForm = {
  id: '',
  project: undefined,
  sections: [],
};

const projectFormSlice = createSlice({
  name: 'projectForm',
  initialState,
  reducers: {
    setProjectData: (state, action: PayloadAction<{ id: string; project: Project }>) => {
      state.id = action.payload.id;
      state.project = action.payload.project;
    },

    addSection: (state, action: PayloadAction<Section>) => {
      state.sections.push(action.payload);
    },

    updateSection: (state, action: PayloadAction<Section>) => {
      const index = state.sections.findIndex((section: Section) => section.id === action.payload.id);
      if (index !== -1) {
        state.sections[index] = action.payload;
      }
    },

    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter((section: Section) => section.id !== action.payload);
    },

    setSections: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },

    addItemToSection: (state, action: PayloadAction<{ sectionId: string; item: Item }>) => {
      const section = state.sections.find((s: Section) => s.id === action.payload.sectionId);
      if (section) {
        section.items.push(action.payload.item);
      }
    },

    updateItemInSection: (state, action: PayloadAction<{ sectionId: string; item: Item }>) => {
      const section = state.sections.find((s: Section) => s.id === action.payload.sectionId);
      if (section) {
        const itemIndex = section.items.findIndex((item: Item) => item.id === action.payload.item.id);
        if (itemIndex !== -1) {
          section.items[itemIndex] = action.payload.item;
        }
      }
    },

    removeItemFromSection: (state, action: PayloadAction<{ sectionId: string; itemId: string }>) => {
      const section = state.sections.find((s: Section) => s.id === action.payload.sectionId);
      if (section) {
        section.items = section.items.filter((item: Item) => item.id !== action.payload.itemId);
      }
    },

    updateSectionTitle: (state, action: PayloadAction<{ sectionId: string; title: string }>) => {
      const section = state.sections.find((s: Section) => s.id === action.payload.sectionId);
      if (section) {
        section.title = action.payload.title;
      }
    },

    updateSectionContent: (state, action: PayloadAction<{ sectionId: string; content: string }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        section.content = action.payload.content;
      }
    },

    updateSectionReceiver: (state, action: PayloadAction<{ sectionId: string; receiver: string }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        section.receiver = action.payload.receiver;
      }
    },

    clearForm: (state) => {
      state.sections = [];
      state.id = '';
      state.project = undefined;
    },
  },
});

export const {
  setProjectData,
  addSection,
  updateSection,
  removeSection,
  setSections,
  addItemToSection,
  updateItemInSection,
  removeItemFromSection,
  updateSectionTitle,
  updateSectionContent,
  updateSectionReceiver,
  clearForm,
} = projectFormSlice.actions;

export default projectFormSlice.reducer;
