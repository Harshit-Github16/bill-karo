const defaultMeta = {
  title: 'BillKaro - Financial Management Platform',
  description: 'Manage your business finances, GST, invoices, and expenses with BillKaro',
  keywords: 'finance, gst, invoices, expenses, business management',
  author: 'BillKaro',
  ogImage: '/images/og-image.png',
  themeColor: '#0ea5e9',
};

export function getMetaData({ title, description }) {
  return {
    ...defaultMeta,
    title: title ? `${title} | BillKaro` : defaultMeta.title,
    description: description || defaultMeta.description,
  };
} 