import React from 'react';

type StudioPageProps = {
  params: {
    projectId: string;
  };
};

export default function StudioPage({ params }: StudioPageProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Vibe Prompt Studio</h1>
      <p className="text-gray-500 mb-6">پروژه ID: {params.projectId}</p>
      <div className="flex gap-6">
        <aside className="w-1/4 p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">فصل‌ها و بخش‌ها</h2>
          <p className="mt-2 text-sm text-gray-500">لیست فصل‌ها و بخش‌های انتخاب شده برای این پروژه.</p>
        </aside>
        <main className="flex-1 p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Prompt Pack</h2>
          <p className="mt-2 text-gray-600">
            خروجی Prompt Pack تولید شده در اینجا با قابلیت‌های کپی و استخراج (JSON/MD/ZIP) نمایش داده می‌شود.
          </p>
        </main>
      </div>
    </div>
  );
}
