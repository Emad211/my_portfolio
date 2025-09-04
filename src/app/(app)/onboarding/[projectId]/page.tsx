"use client";

import React, { useCallback } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { chapter5InputKeys } from '@/lib/mock-data/ch05-inputs';

// A simple debounce utility
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
}


type OnboardingPageProps = {
  params: {
    projectId: string;
  };
};

export default function OnboardingPage({ params }: OnboardingPageProps) {
  const { projectId } = params;
  const section = 'ch05'; // Hardcoding for this example

  // This function will be called to auto-save the form data
  const saveIntakeData = async (data: any) => {
    try {
      console.log(`Auto-saving data for project ${projectId}, section ${section}:`, data);
      const response = await fetch(`/api/projects/${projectId}/intake/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
      // Could add a toast notification here for success
      console.log('Progress saved.');

    } catch (error) {
      console.error('Auto-save failed:', error);
      // Could add a toast notification for error
    }
  };

  // Debounce the save function to avoid excessive API calls
  const debouncedSave = useCallback(debounce(saveIntakeData, 1000), [projectId, section]);

  const handleSubmit = (data: any) => {
    console.log('Final form submission:', data);
    // Here you would navigate to the next step or the studio page
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">آن‌بوردینگ پروژه: فصل ۵ (API)</h1>
        <p className="text-gray-500 mb-6">پروژه ID: {projectId}</p>
        <div className="p-8 bg-white border rounded-lg shadow-sm">
          <DynamicForm
            inputKeys={chapter5InputKeys}
            onSubmit={handleSubmit}
            onDataChange={debouncedSave}
          />
        </div>
      </div>
    </div>
  );
}
