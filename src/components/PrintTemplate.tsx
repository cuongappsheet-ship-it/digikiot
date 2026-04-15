import React from 'react';
import { formatNumber } from '../lib/utils';

interface PrintTemplateProps {
  title: string;
  id: string;
  date: string;
  partner: string;
  phone?: string;
  items?: { name: string; qty: number; price: number; total: number; sn?: string | string[] }[];
  total: number;
  paid: number;
  debt: number;
  note?: string;
  type: 'HOA_DON' | 'PHIEU_NHAP' | 'THU' | 'CHI';
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({
  title, id, date, partner, phone, items, total, paid, debt, note, type
}) => {
  return (
    <div id="print-section" className="hidden print:block p-8 bg-white text-slate-900 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black mb-1">Cửa hàng Vi tính Cường Tín</h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Điện thoại: 0901.234.567 - 0988.777.666</p>
      </div>

      <div className="border-t-2 border-b-2 border-slate-900 py-4 mb-8 text-center">
        <h2 className="text-xl font-black uppercase tracking-widest">{title}</h2>
        <p className="text-sm font-bold mt-1">Số: {id}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div>
          <p className="mb-1"><span className="font-bold uppercase text-[10px] text-slate-400 block">Đối tác:</span> <span className="font-black">{partner}</span></p>
          {phone && <p><span className="font-bold uppercase text-[10px] text-slate-400 block">Điện thoại:</span> <span className="font-black">{phone}</span></p>}
        </div>
        <div className="text-right">
          <p><span className="font-bold uppercase text-[10px] text-slate-400 block">Ngày lập:</span> <span className="font-black">{date}</span></p>
        </div>
      </div>

      {items && items.length > 0 && (
        <table className="w-full mb-8 border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-2 text-left font-black uppercase text-[10px]">Tên hàng hóa / Dịch vụ</th>
              <th className="py-2 text-center font-black uppercase text-[10px]">SL</th>
              <th className="py-2 text-right font-black uppercase text-[10px]">Đơn giá</th>
              <th className="py-2 text-right font-black uppercase text-[10px]">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                <tr className="border-b border-slate-200">
                  <td className="py-3">
                    <p className="font-black text-xs">{item.name}</p>
                    {item.sn && (
                      <p className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">
                        SN: {Array.isArray(item.sn) ? item.sn.join(', ') : item.sn}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-center font-bold">{item.qty}</td>
                  <td className="py-3 text-right font-bold">{formatNumber(item.price)}</td>
                  <td className="py-3 text-right font-black">{formatNumber(item.total)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-bold uppercase text-[10px] text-slate-400">Tổng cộng:</span>
            <span className="font-black">{formatNumber(total)}đ</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold uppercase text-[10px] text-slate-400">Đã thanh toán:</span>
            <span className="font-black">{formatNumber(paid)}đ</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-900">
            <span className="font-black uppercase text-xs">Còn nợ:</span>
            <span className="font-black text-lg">{formatNumber(debt)}đ</span>
          </div>
        </div>
      </div>

      {note && (
        <div className="mb-12 text-sm italic">
          <p><span className="font-bold uppercase text-[10px] text-slate-400 not-italic block mb-1">Ghi chú:</span> {note}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 text-center text-sm font-bold uppercase tracking-widest mt-20">
        <div>
          <p className="mb-20">Người lập phiếu</p>
          <p className="text-slate-300">(Ký, họ tên)</p>
        </div>
        <div>
          <p className="mb-20">Khách hàng / Đối tác</p>
          <p className="text-slate-300">(Ký, họ tên)</p>
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
        Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của Cường Tín!
      </div>
    </div>
  );
};
