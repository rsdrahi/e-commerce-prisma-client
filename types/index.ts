export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  user?: User;
  productId: string;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  userId: string;
  user?: User;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}
