import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">تنظیمات</h1>
      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">کلیدهای API و متغیرها</h2>
        <p className="mt-2 text-gray-600">
          مدیریت کلیدهای API و سایر تنظیمات پروژه (این صفحه فقط برای ادمین قابل مشاهده خواهد بود).
        </p>
      </div>
    </div>
  );
}
