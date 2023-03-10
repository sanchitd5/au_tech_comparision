export enum ProductVendor {
    SCORPTEC = 'SCORPTEC',
    MSY = 'MSY',
    CENTRECOM = 'CENTRECOM',
    PC_CASE_GEAR = 'PC_CASE_GEAR',
    COMPUTER_ALLIANCE = 'COMPUTER_ALLIANCE',
    PLE_COMPUTERS = 'PLE_COMPUTERS',
    CUSTOM = 'CUSTOM'
}

export interface ProductInfo {
    originalPrice: number;
    price: string;
    vendor: ProductVendor;
    inStock: boolean;
    url: string;
    description: string;
}

export interface Product {
    name: string;
    image: string;
    info: ProductInfo[];
}

export interface CartProduct {
    name: string;
    image: string;
    price: number;
    vendor: ProductVendor;
    url: string;
    quantity: number;
}