'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../hooks/LanguageProvider';

interface ReportData {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
  details: any[];
}

const AdvancedReports: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedReport, setSelectedReport] = useState('sales');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // بيانات تجريبية للتقارير
  const mockReportData: ReportData[] = [
    {
      id: 'sales',
      title: 'إجمالي المبيعات',
      value: 45680,
      change: 12.5,
      changeType: 'increase',
      period: 'آخر 7 أيام',
      details: [
        { date: '2024-01-15', amount: 6500, orders: 45 },
        { date: '2024-01-14', amount: 7200, orders: 52 },
        { date: '2024-01-13', amount: 5800, orders: 38 },
        { date: '2024-01-12', amount: 6900, orders: 48 },
        { date: '2024-01-11', amount: 7500, orders: 55 },
        { date: '2024-01-10', amount: 6200, orders: 42 },
        { date: '2024-01-09', amount: 5580, orders: 39 }
      ]
    },
    {
      id: 'orders',
      title: 'عدد الطلبات',
      value: 319,
      change: 8.3,
      changeType: 'increase',
      period: 'آخر 7 أيام',
      details: [
        { date: '2024-01-15', count: 45, avgValue: 144.44 },
        { date: '2024-01-14', count: 52, avgValue: 138.46 },
        { date: '2024-01-13', count: 38, avgValue: 152.63 },
        { date: '2024-01-12', count: 48, avgValue: 143.75 },
        { date: '2024-01-11', count: 55, avgValue: 136.36 },
        { date: '2024-01-10', count: 42, avgValue: 147.62 },
        { date: '2024-01-09', count: 39, avgValue: 143.08 }
      ]
    },
    {
      id: 'customers',
      title: 'العملاء الجدد',
      value: 127,
      change: -3.2,
      changeType: 'decrease',
      period: 'آخر 7 أيام',
      details: [
        { date: '2024-01-15', newCustomers: 18, returningCustomers: 27 },
        { date: '2024-01-14', newCustomers: 22, returningCustomers: 30 },
        { date: '2024-01-13', newCustomers: 15, returningCustomers: 23 },
        { date: '2024-01-12', newCustomers: 19, returningCustomers: 29 },
        { date: '2024-01-11', newCustomers: 25, returningCustomers: 30 },
        { date: '2024-01-10', newCustomers: 16, returningCustomers: 26 },
        { date: '2024-01-09', newCustomers: 12, returningCustomers: 27 }
      ]
    },
    {
      id: 'products',
      title: 'المنتجات الأكثر مبيعاً',
      value: 89,
      change: 15.7,
      changeType: 'increase',
      period: 'آخر 7 أيام',
      details: [
        { product: 'لاتيه حار', sales: 45, revenue: 990 },
        { product: 'كابتشينو', sales: 38, revenue: 760 },
        { product: 'براونيز', sales: 32, revenue: 800 },
        { product: 'كرواسون لوز', sales: 28, revenue: 728 },
        { product: 'أمريكانو', sales: 25, revenue: 450 }
      ]
    }
  ];

  useEffect(() => {
    setReportData(mockReportData);
  }, [selectedPeriod]);

  const handleExportReport = (reportId: string) => {
    const report = reportData.find(r => r.id === reportId);
    if (report) {
      // محاكاة تصدير التقرير
      const csvContent = generateCSV(report);
      downloadCSV(csvContent, `${report.title}_${selectedPeriod}.csv`);
    }
  };

  const generateCSV = (report: ReportData) => {
    const headers = Object.keys(report.details[0]).join(',');
    const rows = report.details.map(detail => 
      Object.values(detail).join(',')
    ).join('\n');
    return `${headers}\n${rows}`;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'sales':
        return `${value.toLocaleString()} ريال`;
      case 'orders':
        return value.toLocaleString();
      case 'customers':
        return value.toLocaleString();
      case 'products':
        return value.toLocaleString();
      default:
        return value.toLocaleString();
    }
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
            التقارير المتقدمة
          </h2>
          <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">
            تحليل شامل لأداء المقهى والمبيعات
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300 font-arabic"
          >
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 3 أشهر</option>
            <option value="1y">آخر سنة</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportData.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#fce7e7] dark:bg-[#b91c1c]/20 rounded-lg">
                {report.id === 'sales' && <CurrencyDollarIcon className="w-6 h-6 text-[#e57373]" />}
                {report.id === 'orders' && <ShoppingBagIcon className="w-6 h-6 text-[#e57373]" />}
                {report.id === 'customers' && <UsersIcon className="w-6 h-6 text-[#e57373]" />}
                {report.id === 'products' && <ChartBarIcon className="w-6 h-6 text-[#e57373]" />}
              </div>
              <div className="flex items-center gap-2">
                {getChangeIcon(report.changeType)}
                <span className={`text-sm font-medium ${getChangeColor(report.changeType)}`}>
                  {report.change > 0 ? '+' : ''}{report.change}%
                </span>
              </div>
            </div>
            
            <div className="mb-2">
              <h3 className="text-lg font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                {formatValue(report.value, report.id)}
              </h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                {report.title}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                {report.period}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(report.id)}
                  className="p-1 text-[#6b7280] dark:text-[#9ca3af] hover:text-[#e57373] transition-colors"
                  title="عرض التفاصيل"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleExportReport(report.id)}
                  className="p-1 text-[#6b7280] dark:text-[#9ca3af] hover:text-[#e57373] transition-colors"
                  title="تصدير التقرير"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Report View */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
              تفاصيل التقرير: {reportData.find(r => r.id === selectedReport)?.title}
            </h3>
            <button
              onClick={() => setSelectedReport('')}
              className="text-[#6b7280] dark:text-[#9ca3af] hover:text-[#e57373] transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#374151]">
                  {selectedReport === 'products' ? (
                    <>
                      <th className="text-right py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">المنتج</th>
                      <th className="text-right py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">المبيعات</th>
                      <th className="text-right py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">الإيرادات</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">التاريخ</th>
                      <th className="text-right py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                        {selectedReport === 'sales' ? 'المبلغ' : selectedReport === 'orders' ? 'الطلبات' : 'العملاء الجدد'}
                      </th>
                      {selectedReport === 'orders' && (
                        <th className="text-right py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">متوسط القيمة</th>
                      )}
                      {selectedReport === 'customers' && (
                        <th className="text-right py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">العملاء العائدون</th>
                      )}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reportData.find(r => r.id === selectedReport)?.details.map((detail, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-[#374151]/50">
                    {selectedReport === 'products' ? (
                      <>
                        <td className="py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">{detail.product}</td>
                        <td className="py-3 px-4 text-[#1f2937] dark:text-[#f9fafb]">{detail.sales}</td>
                        <td className="py-3 px-4 text-[#1f2937] dark:text-[#f9fafb]">{detail.revenue} ريال</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-[#1f2937] dark:text-[#f9fafb] font-arabic">{detail.date}</td>
                        <td className="py-3 px-4 text-[#1f2937] dark:text-[#f9fafb]">
                          {selectedReport === 'sales' ? `${detail.amount} ريال` : 
                           selectedReport === 'orders' ? detail.orders : detail.newCustomers}
                        </td>
                        {selectedReport === 'orders' && (
                          <td className="py-3 px-4 text-[#1f2937] dark:text-[#f9fafb]">{detail.avgValue} ريال</td>
                        )}
                        {selectedReport === 'customers' && (
                          <td className="py-3 px-4 text-[#1f2937] dark:text-[#f9fafb]">{detail.returningCustomers}</td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedReports;
