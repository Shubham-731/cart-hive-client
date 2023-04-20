interface UserTypes {
  fullName: string;
  email: string;
}

interface LoginFormValTypes {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormValTypes extends LoginFormValTypes {
  fullName: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category?: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

interface Cart {
  id: number;
  title: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderedProduct {
  orderId: string;
  quantity: number;
  title: string;
  description: string;
  price: number;
  image: string;
  status: string;
}
