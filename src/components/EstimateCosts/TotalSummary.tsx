import { formatNumberWithDots } from "@/utils/formatters";
import type { EstimateCostData } from "@/types";

type TotalSummaryProps = {
  localData: EstimateCostData;
};

export default function TotalSummary({ localData }: TotalSummaryProps) {
  const totalAmount = localData.categories.reduce((sum, cat) =>  sum + cat.money, 0);
  
  // Calculate total with VAT
  const totalWithVAT = localData.categories.reduce((sum, cat) => {
    const tongCong = cat.money + (cat.money * cat.vat / 100);
    return sum + tongCong;
  }, 0);

  return (
    <div className="text-right border-t pt-4 space-y-2">
      <div className="text-lg font-semibold text-gray-700">
        Tổng dự toán (chưa VAT): {formatNumberWithDots(totalAmount)} VNĐ
      </div>
      <div className="text-xl font-bold text-blue-600">
        TỔNG CỘNG (có VAT): {formatNumberWithDots(totalWithVAT)} VNĐ
      </div>
    </div>
  );
}
