import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">داشبورد</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">پروژه‌های اخیر</h2>
          <p className="mt-2 text-gray-600">لیست پروژه‌های شما در اینجا نمایش داده می‌شود.</p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">ایجاد پروژه جدید</h2>
          <p className="mt-2 text-gray-600">برای شروع، یک پروژه جدید ایجاد کنید.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            پروژه جدید
          </button>
        </div>
      </div>
    </div>
  );
}
