import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormField {
    id: string;
    type: string;
    label: string;
    required: boolean;
    defaultValue?: string;
    options?: string[]; // for select, radio, checkbox
    validations?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        customRule?: string;
        isEmail?: boolean;
        isPassword?: boolean;
    };
    isDerived?: boolean;
    formula?: string;
    parentFields?: string[];
}

interface FormState {
    fields: FormField[];
    formName: string;
    description: string;
}

const initialState: FormState = {
    fields: [],
    formName: '',
    description: '',
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.fields.push(action.payload);
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) state.fields[index] = action.payload;
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(f => f.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.fields = action.payload;
    },
    insertFieldAtIndex: (state, action) => {
      const { field, index } = action.payload;
      state.fields.splice(index, 0, field);
    },  


    // 🔄 Replace this:
    // setFormName: (state, action: PayloadAction<string>) => {
    //   state.formName = action.payload;
    // },

    // ✅ With this:
    setFormMeta: (
      state,
      action: PayloadAction<{ formName: string; description: string }>
    ) => {
      state.formName = action.payload.formName;
      state.description = action.payload.description;
    },

    resetForm: () => initialState,
  },
});


export const {
    addField, updateField, deleteField,
    reorderFields, setFormMeta, resetForm, insertFieldAtIndex
} = formSlice.actions;

export default formSlice.reducer;
