export interface ProductDetails {
    title: string;
    description: string;
    keyword: string;
    url: string;
    price?: string;
    shippingPrice?: string;
    sellerName?: string;
}

export interface ProductDetailsFilterByUrl {
    url: string;
    productDetailWithPrice: productDetailWithPrice[];
}

export interface productDetailWithPrice {
    price: number;
    productDetails: ProductDetails;
}