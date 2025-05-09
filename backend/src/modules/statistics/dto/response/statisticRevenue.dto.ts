

export class StatisticRevenueDto {
  week?: number;
  month?: number;
  year?: number;
  revenueTotal: number;
  quantityDelivered: number;
  quantityPending: number;
  quantityCancelled: number;
  quantityReturned: number;
  bestSellingProducts: BestSellingProduct[];
  revenue: Revenue[];
}
class BestSellingProduct {
  name: string;
  total: number;
}
class Revenue {
  year?: number;
  month?: number;
  week?: number;
  day?: number;
  revenue: number;
  quantityDelivered: number;
  quantityPending: number;
  quantityCancelled: number;
  quantityReturned: number;
}
