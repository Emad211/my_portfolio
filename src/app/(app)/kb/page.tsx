import React from 'react';

export default function KnowledgeBasePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">جست‌وجوی دانش</h1>
      <div className="mb-6">
        <input
          type="search"
          placeholder="عبارت مورد نظر خود را جست‌وجو کنید..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="p-6 bg-white border rounded-lg shadow-sm min-h-[300px]">
        <h2 className="text-xl font-semibold">نتایج جست‌وجو</h2>
        <p className="mt-2 text-gray-600">
          نتایج جست‌وجو در اینجا نمایش داده خواهد شد.
        </p>
      </div>
    </div>
  );
}
