import React from 'react';

type OnboardingPageProps = {
  params: {
    projectId: string;
  };
};

export default function OnboardingPage({ params }: OnboardingPageProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">آن‌بوردینگ پروژه</h1>
      <p className="text-gray-500 mb-6">پروژه ID: {params.projectId}</p>
      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">ویزارد فصل‌ها</h2>
        <p className="mt-2 text-gray-600">
          در اینجا یک ویزارد چندمرحله‌ای برای ورود اطلاعات بر اساس `brief_input_keys` هر فصل قرار خواهد گرفت.
        </p>
      </div>
    </div>
  );
}
