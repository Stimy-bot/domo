// libs/shared/utils/src/lib/exportCsv.ts
import type { AuditLog, Quote } from '@domo/types';

export const exportAuditLogsToCSV = (logs: AuditLog[]) => {
  const headers = ['Event', 'Actor', 'Target', 'Date'];
  const rows = logs.map((log) => [
    log.type,
    (log.actor as { email?: string } | null | undefined)?.email || '-',
    (log.target as { email?: string } | null | undefined)?.email || '-',
    new Date(String(log.createdAt ?? Date.now())).toLocaleString(),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `audit_logs_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportQuoteToCSV = (quotes: Quote[]) => {
  // 1. Define headers based on the Quote type
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Company',
    'Service Type',
    'Price Range',
    'Phone',
    'Website',
    'Details',
  ];

  // 2. Map the quote data to rows
  const rows = quotes.map((quote) => [
    quote.firstName,
    quote.lastName,
    quote.email,
    quote.companyName,
    quote.serviceType,
    quote.priceRange,
    quote.phone || '-',
    quote.website || '-',
    // Replace newlines or quotes in details to avoid breaking CSV format
    quote.quoteDetails.replace(/"/g, '""').replace(/\n/g, ' '),
  ]);

  // 3. Generate CSV content
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  // 4. Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `quotes_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
