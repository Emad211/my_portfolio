"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// A generic type for the input keys - can be expanded
type InputKey = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

type DynamicFormProps = {
  inputKeys: InputKey[];
  onSubmit: (data: any) => void;
  onDataChange?: (data: any) => void; // For auto-saving
};

// Function to generate a Zod schema from the input keys
const generateSchema = (keys: InputKey[]) => {
  const shape: { [key: string]: z.ZodType<any, any> } = {};
  keys.forEach(key => {
    let fieldSchema: z.ZodType<any, any>;
    switch (key.type) {
      case 'boolean':
        fieldSchema = z.boolean();
        break;
      case 'enum-select':
        fieldSchema = z.string().min(1, { message: 'این فیلد الزامی است' });
        break;
      case 'multi-select':
        fieldSchema = z.array(z.string()).min(1, { message: 'حداقل یک گزینه انتخاب کنید' });
        break;
      default:
        fieldSchema = z.any();
    }
    if (key.required) {
      // Handled by min(1) for string/array, but could add more specific required messages
    }
    shape[key.key] = fieldSchema;
  });
  return z.object(shape);
};


export default function DynamicForm({ inputKeys, onSubmit, onDataChange }: DynamicFormProps) {
  const formSchema = generateSchema(inputKeys);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: inputKeys.reduce((acc, key) => ({ ...acc, [key.key]: key.type === 'multi-select' ? [] : key.type === 'boolean' ? false : '' }), {})
  });

  // Watch for changes and trigger the onDataChange callback for auto-saving
  React.useEffect(() => {
    const subscription = watch((value) => {
      onDataChange?.(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  const renderField = (key: InputKey) => {
    const error = errors[key.key];
    return (
      <div key={key.key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{key.label} {key.required && '*'}</label>
        <Controller
          name={key.key}
          control={control}
          render={({ field }) => {
            switch (key.type) {
              case 'enum-select':
                return (
                  <select {...field} className="w-full p-2 border rounded-md">
                    <option value="">یک گزینه را انتخاب کنید...</option>
                    {key.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                );
              case 'boolean':
                return <input type="checkbox" {...field} className="h-4 w-4 rounded" />;
              // Add more field types here (multi-select, object, etc.)
              default:
                return <input type="text" {...field} className="w-full p-2 border rounded-md" />;
            }
          }}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error.message?.toString()}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {inputKeys.map(renderField)}
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
        ذخیره و ادامه
      </button>
    </form>
  );
}
