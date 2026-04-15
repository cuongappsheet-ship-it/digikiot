import React, { useState } from 'react';
import { Search, Plus, Wrench, Clock, CheckCircle, ArrowLeftRight, X, User, Phone, Tag, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MaintenanceRecord } from '../types';
import { formatNumber, parseFormattedNumber } from '../lib/utils';
import { generateId } from '../lib/idUtils';

export const Maintenance: React.FC = () => {
  const { maintenanceRecords, addMaintenanceRecord, updateMaintenanceRecord } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [issue, setIssue] = useState('');
  const [cost, setCost] = useState('');
  const [note, setNote] = useState('');

  const filteredRecords = (maintenanceRecords || [])
    .filter(r => 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerPhone.includes(searchTerm) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.serialNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSave = async () => {
    if (!customerName || !customerPhone || !productName || !issue) {
      alert('Vui lòng nhập đủ thông tin bắt buộc');
      return;
    }

    const now = new Date();
    const id = generateId('BH', maintenanceRecords);

    await addMaintenanceRecord({
      id,
      date: now.toLocaleString('vi-VN'),
      customerName,
      customerPhone,
      productName,
      serialNumber,
      issue,
      status: 'RECEIVING',
      cost: parseFormattedNumber(cost) || 0,
      note
    });

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setProductName('');
    setSerialNumber('');
    setIssue('');
    setCost('');
    setNote('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVING': return 'bg-blue-100 text-blue-700';
      case 'REPAIRING': return 'bg-orange-100 text-orange-700';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
      case 'RETURNED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RECEIVING': return 'Tiếp nhận';
      case 'REPAIRING': return 'Đang sửa';
      case 'COMPLETED': return 'Đã xong';
      case 'RETURNED': return 'Đã trả khách';
      default: return status;
    }
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-0 py-4 md:py-0">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 shrink-0">
        <div className="flex-1 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 focus-within:border-blue-400 transition-all">
          <Search className="text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm phiếu bảo hành/sửa chữa..." 
            className="flex-1 bg-transparent text-sm font-medium outline-none"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md flex items-center justify-center gap-2 font-semibold text-xs tracking-wide active:scale-95 transition-all hover:bg-blue-700"
        >
          <Plus size={16} /> Tiếp nhận máy
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider">Mã phiếu</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider">Khách hàng</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider">Thiết bị</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider">Tình trạng</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider text-center">Trạng thái</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider text-right">Chi phí</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 italic text-sm">Chưa có phiếu bảo hành nào.</td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr 
                    key={r.id} 
                    onClick={() => setSelectedRecord(r)}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <span className="font-semibold text-xs text-slate-800 tracking-tight">{r.id}</span>
                      <p className="text-[9px] text-slate-400 font-medium mt-1">{r.date}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-xs text-slate-800 tracking-tight">{r.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{r.customerPhone}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-xs text-slate-800 tracking-tight">{r.productName}</p>
                      {r.serialNumber && <p className="text-[9px] text-orange-500 font-medium tracking-wide font-mono">SN: {r.serialNumber}</p>}
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-600 font-medium line-clamp-1">{r.issue}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-wide ${getStatusColor(r.status)}`}>
                        {getStatusText(r.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold text-sm text-slate-800">{formatNumber(r.cost)}đ</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <div className="p-10 text-center text-slate-400 italic text-sm">Chưa có phiếu bảo hành nào.</div>
            ) : (
              filteredRecords.map(r => (
                <div 
                  key={r.id} 
                  onClick={() => setSelectedRecord(r)}
                  className="p-4 space-y-3 active:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-slate-800">{r.id}</span>
                      <p className="text-[10px] text-slate-400 font-medium">{r.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wide ${getStatusColor(r.status)}`}>
                      {getStatusText(r.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{r.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{r.customerPhone}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-700">{r.productName}</p>
                    {r.serialNumber && <p className="text-[9px] text-orange-500 font-semibold font-mono mt-0.5">SN: {r.serialNumber}</p>}
                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 italic">"{r.issue}"</p>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dự kiến chi phí</span>
                    <span className="font-bold text-sm text-blue-600">{formatNumber(r.cost)}đ</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Maintenance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Tiếp nhận bảo hành / sửa chữa</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 tracking-wider ml-1">Tên khách hàng</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none mt-1 shadow-inner focus:border-blue-400" 
                    placeholder="Nguyễn Văn A..." 
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 tracking-wider ml-1">Số điện thoại</label>
                  <input 
                    type="text" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none mt-1 shadow-inner focus:border-blue-400" 
                    placeholder="090..." 
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-semibold text-slate-400 tracking-wider ml-1">Tên thiết bị</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none mt-1 shadow-inner focus:border-blue-400" 
                  placeholder="iPhone 13 Pro Max..." 
                />
              </div>

              <div>
                <label className="text-[9px] font-semibold text-slate-400 tracking-wider ml-1">Số Serial / IMEI (nếu có)</label>
                <input 
                  type="text" 
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none mt-1 shadow-inner focus:border-blue-400" 
                  placeholder="SN..." 
                />
              </div>

              <div>
                <label className="text-[9px] font-semibold text-slate-400 tracking-wider ml-1">Tình trạng / Lỗi</label>
                <textarea 
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none mt-1 shadow-inner focus:border-blue-400 h-20" 
                  placeholder="Mô tả lỗi của máy..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 tracking-wider ml-1">Dự kiến chi phí (đ)</label>
                  <input 
                    type="text" 
                    value={cost}
                    onChange={(e) => setCost(formatNumber(parseFormattedNumber(e.target.value)))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none mt-1 shadow-inner focus:border-blue-400" 
                    placeholder="0" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ghi chú thêm</label>
                <input 
                  type="text" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none mt-1 shadow-inner focus:border-blue-400" 
                  placeholder="Phụ kiện đi kèm, mật khẩu máy..." 
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold shadow-md shadow-blue-200 tracking-wide active:scale-95 transition-all hover:bg-blue-700"
              >
                Tạo phiếu tiếp nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Chi tiết phiếu {selectedRecord.id}</h3>
              <button onClick={() => setSelectedRecord(null)} className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 tracking-tight">{selectedRecord.customerName}</p>
                  <p className="text-xs text-slate-500 font-medium">{selectedRecord.customerPhone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Tag className="text-slate-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider">Thiết bị</p>
                    <p className="text-sm font-semibold text-slate-800">{selectedRecord.productName}</p>
                    {selectedRecord.serialNumber && <p className="text-xs text-orange-500 font-semibold font-mono">SN: {selectedRecord.serialNumber}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-slate-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider">Tình trạng lỗi</p>
                    <p className="text-sm font-medium text-slate-600">{selectedRecord.issue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-slate-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider">Trạng thái hiện tại</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(['RECEIVING', 'REPAIRING', 'COMPLETED', 'RETURNED'] as const).map(s => (
                        <button 
                          key={s}
                          onClick={() => {
                            updateMaintenanceRecord(selectedRecord.id, { status: s });
                            setSelectedRecord({...selectedRecord, status: s});
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[8px] font-bold tracking-wide transition-all ${selectedRecord.status === s ? getStatusColor(s) + ' shadow-sm scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {getStatusText(s)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">Chi phí dự kiến</span>
                  <span className="text-lg font-semibold text-slate-800">{formatNumber(selectedRecord.cost)}đ</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setSelectedRecord(null)} className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg text-[10px] tracking-wide">Đóng chi tiết</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
