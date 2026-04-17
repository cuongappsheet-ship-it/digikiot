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
  discount?: number;
  note?: string;
  type: 'HOA_DON' | 'PHIEU_NHAP' | 'THU' | 'CHI';
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({
  title, id, date, partner, phone, address, items, total, paid, debt, discount, note, type
}) => {
  const { printSettings } = useAppContext();

  const content = (
    <div id="print-section" className="fixed top-0 left-0 w-full bg-white text-black font-serif z-[999999] opacity-0 pointer-events-none print:relative print:opacity-100 print:z-auto print:pointer-events-auto p-4 md:p-8">
      {/* Header with QR and Store Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-black flex items-center justify-center font-bold text-[8px] md:text-[10px] text-center p-1">
            QR CODE<br/>PAYMENT
          </div>
          <div className="text-[10px] md:text-[11px] leading-tight">
            <h1 className="font-bold text-xs md:text-sm uppercase">{printSettings.storeName}</h1>
            <p>Địa chỉ: {printSettings.address}</p>
            <p>ĐT: {printSettings.phone} | Email: {printSettings.email}</p>
            <p>Số tài khoản: {printSettings.bankInfo}</p>
            <p className="italic text-[9px] md:text-[10px]">(Quý khách có thể quét mã QR bên cạnh để thanh toán chuyển khoản)</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-lg md:text-xl font-bold uppercase">{title}</h2>
        <p className="text-xs md:text-sm">Số hóa đơn: {id}</p>
        <p className="text-xs md:text-sm">Ngày {date.split(',')[0]} (hoặc {date})</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-xs md:text-sm">
        <div>
          <p><span className="font-bold">Khách hàng / Đối tác:</span> {partner}</p>
          {address && <p><span className="font-bold">Địa chỉ:</span> {address}</p>}
        </div>
        <div className="text-right">
          {phone && <p><span className="font-bold">SĐT:</span> {phone}</p>}
        </div>
      </div>

      {items && items.length > 0 && (
        <table className="w-full mb-6 border-collapse border border-black text-[10px] md:text-xs">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-black py-1 px-1 md:px-2 text-center w-8 md:w-10">STT</th>
              <th className="border border-black py-1 px-1 md:px-2 text-left">Tên hàng</th>
              <th className="border border-black py-1 px-1 md:px-2 text-center w-10 md:w-12">ĐVT</th>
              <th className="border border-black py-1 px-1 md:px-2 text-center w-10 md:w-12">SL</th>
              <th className="border border-black py-1 px-1 md:px-2 text-right">Đơn giá</th>
              <th className="border border-black py-1 px-1 md:px-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-black py-1 px-1 md:px-2 text-center">{idx + 1}</td>
                <td className="border border-black py-1 px-1 md:px-2">
                  <p className="font-bold">{item.name}</p>
                  {item.sn && (
                    <p className="text-[9px] italic">
                      SN: {Array.isArray(item.sn) ? item.sn.join(', ') : item.sn}
                    </p>
                  )}
                </td>
                <td className="border border-black py-1 px-1 md:px-2 text-center">{item.unit || 'Cái'}</td>
                <td className="border border-black py-1 px-1 md:px-2 text-center">{item.qty}</td>
                <td className="border border-black py-1 px-1 md:px-2 text-right">{formatNumber(item.price)}</td>
                <td className="border border-black py-1 px-1 md:px-2 text-right font-bold">{formatNumber(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end mb-6">
        <div className="w-64 md:w-80 space-y-1 text-xs md:text-sm">
          <div className="flex justify-between">
            <span className="font-bold">Tổng cộng:</span>
            <span className="font-bold">{formatNumber(items?.reduce((s, i) => s + i.total, 0) || total)}</span>
          </div>
          {discount !== undefined && discount > 0 && (
            <div className="flex justify-between">
              <span className="font-bold">Chiết khấu:</span>
              <span className="font-bold">{formatNumber(discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-black pt-1">
            <span className="font-bold uppercase">Tổng thanh toán:</span>
            <span className="font-bold">{formatNumber(total)}</span>
          </div>
          <p className="text-[10px] md:text-xs italic mt-1">(Tổng thanh toán bằng chữ: {numberToWordsVN(total)})</p>
          
          <div className="flex justify-between pt-4">
            <span>Khách hàng thanh toán:</span>
            <span>{formatNumber(paid)}</span>
          </div>
          <div className="flex justify-between">
            <span>Nợ cũ:</span>
            <span>0</span>
          </div>
          <div className="flex justify-between border-t border-black pt-1">
            <span className="font-bold">Số nợ sau hóa đơn:</span>
            <span className="font-bold">{formatNumber(debt)}</span>
          </div>
        </div>
      </div>

      <div className="text-right text-xs md:text-sm italic mb-10">
        <p>Ngày {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 text-center text-xs md:text-sm font-bold mt-10">
        <div>
          <p className="mb-20 md:mb-24">Người mua hàng</p>
        </div>
        <div>
          <p className="mb-20 md:mb-24">Người bán hàng</p>
        </div>
      </div>

      <div className="text-center text-[10px] md:text-xs italic mt-16 md:mt-20 border-t border-dotted border-black pt-4">
        {printSettings.footNote}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
