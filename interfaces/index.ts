export interface IProduct {
  _id: string;
  title: string;
  description: string;
  images: string[];
  currentPrice: number;
  originalPrice: number;
  rating: number;
  stock: number;
  category: string;
  exclusive: boolean;
  tags: string[];
  specifications: Object[];
  color: string;
  quantity?: number;
}

export interface IFilters {
  id: string;
  colors: string[];
  brands: string[];
  categories: string[];
  rating: string;
  inStock: string;
  priceRange: string[];
  exclusive: string;
  productIds: string[];
}

export interface IAddress {
  id: string;
  apartment: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface IinitialStoreState {
  cart: IProduct[];
  wishlist: string[];
  sidebarVisible: boolean;
}
