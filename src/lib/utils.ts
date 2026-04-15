export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount).replace('₫', 'đ');
};

export const formatNumber = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export const parseFormattedNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  return Number(value.replace(/\./g, '').replace(/,/g, '')) || 0;
};
