// lib/types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  prices: Price[];
  organizationId: string;
  isArchived: boolean;
  isRecurring: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface Price {
  id: string;
  priceAmount: number;
  priceCurrency: string;
  type: string;
  recurringInterval?: string;
  isArchived: boolean;
  amountType: string;
}
