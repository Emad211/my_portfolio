// This data is a direct translation of the sample fields for Chapter 5 (API) from the prompt.

export const chapter5InputKeys = [
  {
    key: 'api_styles_needed',
    type: 'multi-select',
    label: 'سبک‌های API مورد نیاز',
    options: ['REST', 'GraphQL', 'gRPC', 'webhooks', 'BFF'],
    required: true,
  },
  {
    key: 'primary_clients',
    type: 'multi-select',
    label: 'کلاینت‌های اصلی',
    options: ['web-ssr', 'web-spa', 'ios', 'android', '3rd-party', 'internal'],
    required: true,
  },
  {
    key: 'versioning_policy',
    type: 'enum-select',
    label: 'سیاست نسخه‌بندی',
    options: ['semver-url', 'header', 'graphql-deprecations'],
    required: true,
  },
  {
    key: 'error_model',
    type: 'enum-select',
    label: 'مدل خطا',
    options: ['problem-details', 'custom'],
    required: true,
  },
  {
    key: 'fieldErrors',
    type: 'boolean',
    label: 'شامل کردن خطاهای سطح فیلد (fieldErrors)',
    required: false,
  },
  {
    key: 'rate_limit_policy',
    type: 'object',
    label: 'سیاست محدودیت نرخ (Rate Limit)',
    fields: [
      { key: 'limit_per_min', type: 'number', label: 'تعداد درخواست در دقیقه' },
      { key: 'burst', type: 'number', label: 'تعداد درخواست ناگهانی (Burst)' },
      { key: 'headers', type: 'boolean', label: 'ارسال هدرهای RateLimit' },
    ]
  },
  {
    key: 'idempotency_policy',
    type: 'object',
    label: 'سیاست کلید幂 (Idempotency)',
    fields: [
        { key: 'apply_to', type: 'multi-select', label: 'اعمال برای متدها', options: ['POST', 'PATCH', 'PUT', 'DELETE'] },
        { key: 'ttl_hours', type: 'number', label: 'طول عمر کلید (ساعت)', min: 24, max: 72 },
    ]
  },
  {
    key: 'security_schemes',
    type: 'multi-select',
    label: 'مکانیسم‌های امنیتی',
    options: ['OIDC', 'mTLS', 'APIKey', 'HMAC-webhook'],
    required: true,
  },
  // ... other fields from the prompt can be added here
];
