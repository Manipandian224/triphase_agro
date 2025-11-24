import productsData from './products.json';

export type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    imageUrl: string;
    imageHint: string;
};

export const products: Product[] = productsData.products;
