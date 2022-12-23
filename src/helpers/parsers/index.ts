import { HTMLElement } from 'node-html-parser';
import { Product, ProductVendor } from 'types';

export const scorptecSearchProductHTMLNodeToProduct = (node: HTMLElement) => {
    const product: Product = {
        name: node.querySelector('.detail-product-title')?.querySelector('a')?.text ?? '',
        info: [{
            originalPrice: parseFloat(node.querySelector('.detail-product-before-price')?.text?.replace('$', '') ?? '0'),
            price: node.querySelector('.detail-product-price')?.innerText ?? '',
            url: node.querySelector('.detail-product-title')?.querySelector('a')?.getAttribute('href') ?? '',
            inStock: node.querySelector('.detail-product-stock')?.text?.trim().toLowerCase() === 'in stock' ? true : false,
            vendor: ProductVendor.SCORPTEC,
            description: node.querySelector('a[data-tb-sid="st_description-link"]')?.text ?? '',
        }],
        image: node.querySelector('.detail-image-wrapper')?.querySelector('img')?.getAttribute('src') ?? '',
    }
    return product;
}

export const centrecomSearchProductHTMLNodeToProduct = (productItem: any) => {
    const product: Product = {
        name: productItem.name,
        info: [{
            originalPrice: parseFloat('0'),
            price: `$${productItem.price}`,
            url: `https://www.centrecom.com.au/${productItem.seName}`,
            inStock: productItem.stockQuantity ? true : false,
            vendor: ProductVendor.CENTRECOM,
            description: productItem.shortDescription ?? '',
        }],
        image: productItem.imgUrl,
    }
    return product;
}

export const msySearchProductHTMLNodeToProduct = (node: HTMLElement) => {
    const product: Product = {
        name: node.querySelector('.goods_name')?.querySelector('a')?.getAttribute('title') ?? '',
        info: [{
            originalPrice: parseFloat('0'),
            price: node.querySelector('.goods_price')?.text ?? '0',
            url: 'https://www.msy.com.au/' + node.querySelector('.goods_name')?.querySelector('a')?.getAttribute('href') ?? '',
            inStock: node.querySelector('.goods_stock')?.text?.trim().toLowerCase() === 'in stock' ? true : false,
            vendor: ProductVendor.MSY,
            description: node.querySelector('.goods_name')?.querySelector('a')?.getAttribute('title') ?? '',
        }],
        image: node.querySelector('.goods_img')?.querySelector('img')?.getAttribute('src') ?? '',
    }
    return product;
}

export const computerAllianceSearchProductHTMLNodeToProduct = (node: HTMLElement) => { 
    const product: Product = {
        name: node.querySelector('.equalize')?.text ?? '',
        info: [{
            originalPrice: parseFloat('0'),
            price: node.querySelector('.price')?.text ?? '0',
            url: 'https://www.computeralliance.com.au/' + node.querySelector('a')?.getAttribute('href') ?? '',
            inStock: node.querySelector('.instock')?.text?.trim().toLowerCase() === 'in stock' ? true : false,
            vendor: ProductVendor.COMPUTER_ALLIANCE,
            description: node.querySelector('.equalize')?.text ?? '',
        }],
        image: node.querySelector('.img-container')?.querySelector('img')?.getAttribute('src') ?? '',
    }
    return product;
}

export const pcCaseGearSearchProductHTMLNodeToProduct = (productItem: any) => {
    const product: Product = {
        name: productItem.products_name,
        info: [{
            originalPrice: parseFloat('0'),
            price: `$${productItem.products_price}`,
            url: `https://www.pccasegear.com/${productItem.Product_URL}`,
            inStock: productItem.indicator.label === 'In stock' ? true : false,
            vendor: ProductVendor.PC_CASE_GEAR,
            description: productItem.products_description ?? '',
        }],
        image: productItem.Image_URL,
    }
    return product;
}
