import React from 'react';
import { createPortal } from 'react-dom';
import { formatNumber } from '../lib/utils';
import { useAppContext } from '../context/AppContext';
import { numberToWordsVN } from '../lib/numberToWords';

interface PrintTemplateProps {
  title: string;
  id: string;
  date: string;
  partner: string;
  phone?: string;
  address?: string; // Add address if available
  items?: { name: string; qty: number; price: number; total: number; sn?: string | string[]; unit?: string }[];
  total: number;
  paid: number;
  debt: number;
  oldDebt?: number;
  discount?: number;
  note?: string;
  type: 'HOA_DON' | 'PHIEU_NHAP' | 'THU' | 'CHI';
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({
  title, id, date, partner, phone, address, items, total, paid, debt, oldDebt = 0, discount, note, type
}) => {
  const { printSettings } = useAppContext();

  const content = (
    <div id="print-section" className="fixed top-0 left-0 w-full min-h-screen bg-white text-slate-900 font-sans z-[999999] opacity-0 pointer-events-none print:relative print:opacity-100 print:z-auto print:pointer-events-auto p-8 shadow-inner">
      {/* Decorative background for professional look (only visible in some printers or if background graphics are on) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      
      {/* Header with Store Info */}
      <div className="flex justify-between items-start mb-10 pb-6 border-b-2 border-slate-200">
        <div className="flex gap-6">
          <div className="flex flex-col items-center justify-center p-2 bg-slate-900 text-white rounded-lg shadow-md aspect-square w-24">
            <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Payment</span>
            <div className="bg-white p-1 rounded">
              <div className="w-12 h-12 border border-black flex items-center justify-center text-[8px] text-black font-mono">QR CODE</div>
            </div>
          </div>
          <div className="text-xs space-y-1">
            <h1 className="font-extrabold text-xl text-slate-900 uppercase tracking-tight mb-1">{printSettings.storeName}</h1>
            <p className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="font-bold text-slate-900">Địa chỉ:</span> {printSettings.address}
            </p>
            <p className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="font-bold text-slate-900">Hotline:</span> {printSettings.phone}
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-bold text-slate-900">Email:</span> {printSettings.email}
            </p>
            <p className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="font-bold text-slate-900">Tài khoản:</span> {printSettings.bankInfo}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-4 py-2 bg-slate-100 rounded-lg mb-2">
             <span className="text-[10px] block font-bold text-slate-500 uppercase">Mã đơn hàng</span>
             <span className="text-lg font-black font-mono text-slate-900">{id}</span>
          </div>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-[0.2em] mb-2">{title}</h2>
        <div className="h-1 w-24 bg-slate-900 mx-auto rounded-full mb-3"></div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          Ngày {date.split(',')[0]} <span className="mx-2 opacity-30">|</span> {date}
        </p>
      </div>

      {/* Customer Info */}
      <div className="flex justify-between mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="space-y-2">
          <p className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Khách hàng / Đối tác</span>
            <span className="font-bold text-base text-slate-900">{partner}</span>
          </p>
          {address && (
            <p className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Địa chỉ giao hàng</span>
              <span className="text-sm text-slate-700 font-medium">{address}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          {phone && (
            <p className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400">Số điện thoại</span>
              <span className="font-bold text-base text-slate-900 tracking-wider">{phone}</span>
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      {items && items.length > 0 && (
        <div className="mb-8 rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-4 px-4 text-center font-bold uppercase text-[10px] w-12">STT</th>
                <th className="py-4 px-4 text-left font-bold uppercase text-[10px]">Tên mặt hàng / Quy cách</th>
                <th className="py-4 px-4 text-center font-bold uppercase text-[10px] w-20">ĐVT</th>
                <th className="py-4 px-4 text-center font-bold uppercase text-[10px] w-20">Số lượng</th>
                <th className="py-4 px-4 text-right font-bold uppercase text-[10px] w-32">Đơn giá</th>
                <th className="py-4 px-4 text-right font-bold uppercase text-[10px] w-32">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    {item.sn && (
                      <p className="text-[10px] text-slate-400 italic font-mono mt-1">
                        SN: {Array.isArray(item.sn) ? item.sn.join(', ') : item.sn}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 font-medium">{item.unit || 'Cái'}</td>
                  <td className="py-3 px-4 text-center font-black text-slate-900">{item.qty}</td>
                  <td className="py-3 px-4 text-right text-slate-600 font-medium">{formatNumber(item.price)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{formatNumber(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Calculations section */}
      <div className="flex justify-end mb-10">
        <div className="w-full max-w-sm space-y-3">
          <div className="flex justify-between text-slate-500 font-medium text-sm px-2">
            <span>Thành tiền hàng:</span>
            <span>{formatNumber(items?.reduce((s, i) => s + i.total, 0) || total)}</span>
          </div>
          {discount !== undefined && discount > 0 && (
            <div className="flex justify-between text-rose-500 font-bold text-sm px-2">
              <span>Chiết khấu (giảm giá):</span>
              <span>-{formatNumber(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl">
            <span className="font-black text-slate-900 uppercase text-xs">Tổng đơn hàng:</span>
            <span className="text-xl font-black text-blue-600">{formatNumber(total)}</span>
          </div>
          
          <div className="p-4 space-y-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between text-sm text-slate-600">
              <span className="font-medium">Nợ cũ trước đơn này:</span>
              <span className="font-bold underline decoration-slate-300">{formatNumber(oldDebt)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span className="font-medium">Đã thanh toán hôm nay:</span>
              <span className="font-bold text-emerald-600">{formatNumber(paid)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-black text-slate-900 uppercase text-[10px]">Tổng nợ sau bán hàng:</span>
              <span className="text-lg font-black text-slate-900">{formatNumber(oldDebt + (total - paid))}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50/50 rounded-lg text-center">
            <p className="text-[10px] text-blue-800 font-bold uppercase mb-1">Số tiền bằng chữ</p>
            <p className="text-sm italic font-serif text-slate-700">"{numberToWordsVN(total)}"</p>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 text-center mt-12 mb-20 px-10">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Người mua hàng</h4>
          <p className="text-[10px] italic text-slate-400 mb-20">(Ký và ghi rõ họ tên)</p>
          <p className="text-base font-bold text-slate-900">{partner}</p>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Người bán hàng</h4>
          <p className="text-[10px] italic text-slate-400 mb-20">(Ký và ghi rõ họ tên)</p>
          <p className="text-base font-bold text-slate-900">{printSettings.storeName.replace('TIN HỌC ', '')}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] italic mb-2">
          {printSettings.footNote}
        </p>
        <p className="text-[9px] text-slate-300 font-medium">Bản in từ hệ thống quản lý ERP Cường Tín - {new Date().toLocaleString('vi-VN')}</p>
      </div>

      {/* Print Helper for hidden UI in screen but visible in print */}
      <style>{`
        @media print {
          body { background: white !important; }
          #root { display: none !important; }
          #print-section { 
            position: relative !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            padding: 0 !important;
            shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );

  return createPortal(content, document.body);
};
