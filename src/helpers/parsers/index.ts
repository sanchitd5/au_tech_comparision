import { HTMLElement } from 'node-html-parser';
import { Product, ProductVendor } from 'types';

/**
 * Utility function for safer text extraction from HTML elements
 * @param element The HTML element to extract text from
 * @returns Trimmed text or empty string
 */
const safeText = (element: HTMLElement | null | undefined): string =>
    element?.text?.trim() || '';

/**
 * Utility function for safer attribute extraction from HTML elements
 * @param element The HTML element to extract attribute from
 * @param attribute The attribute name to extract
 * @returns Attribute value or empty string
 */
const safeAttribute = (element: HTMLElement | null | undefined, attribute: string): string =>
    element?.getAttribute(attribute) || '';

/**
 * Creates a complete URL from base URL and path
 * @param baseUrl The base URL
 * @param path The path to append
 * @returns Complete URL
 */
const createUrl = (baseUrl: string, path: string): string => {
    if (!path) return baseUrl;
    if (path.startsWith('http')) return path;
    return baseUrl + (path.startsWith('/') ? path : '/' + path);
};

export const scorptecSearchProductHTMLNodeToProduct = (node: HTMLElement) => {
    try {
        const titleElement = node.querySelector('.detail-product-title')?.querySelector('a');
        const product: Product = {
            name: safeText(titleElement),
            info: [{
                originalPrice: parseFloat(node.querySelector('.detail-product-before-price')?.text?.replace('$', '') ?? '0'),
                price: node.querySelector('.detail-product-price')?.innerText ?? '',
                url: safeAttribute(titleElement, 'href'),
                inStock: safeText(node.querySelector('.detail-product-stock')).toLowerCase() === 'in stock',
                vendor: ProductVendor.SCORPTEC,
                description: safeText(node.querySelector('a[data-tb-sid="st_description-link"]')),
            }],
            image: safeAttribute(node.querySelector('.detail-image-wrapper')?.querySelector('img'), 'src'),
        }
        return product;
    } catch (error) {
        console.error('Error parsing Scorptec product:', error);
        return createEmptyProduct(ProductVendor.SCORPTEC);
    }
}

export const centrecomSearchProductHTMLNodeToProduct = (productItem: any) => {
    try {
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
    } catch (error) {
        console.error('Error parsing Centrecom product:', error);
        return createEmptyProduct(ProductVendor.CENTRECOM);
    }
}

export const msySearchProductHTMLNodeToProduct = (node: HTMLElement) => {
    try {
        const linkElement = node.querySelector('.goods_name')?.querySelector('a');
        const product: Product = {
            name: safeAttribute(linkElement, 'title'),
            info: [{
                originalPrice: parseFloat('0'),
                price: safeText(node.querySelector('.goods_price')),
                url: createUrl('https://www.msy.com.au', safeAttribute(linkElement, 'href')),
                inStock: safeText(node.querySelector('.goods_stock')).toLowerCase() === 'in stock',
                vendor: ProductVendor.MSY,
                description: safeAttribute(linkElement, 'title'),
            }],
            image: safeAttribute(node.querySelector('.goods_img')?.querySelector('img'), 'src'),
        }
        return product;
    } catch (error) {
        console.error('Error parsing MSY product:', error);
        return createEmptyProduct(ProductVendor.MSY);
    }
}

export const computerAllianceSearchProductHTMLNodeToProduct = (node: HTMLElement) => {
    try {
        const product: Product = {
            name: safeText(node.querySelector('.equalize')),
            info: [{
                originalPrice: parseFloat('0'),
                price: safeText(node.querySelector('.price')),
                url: createUrl('https://www.computeralliance.com.au', safeAttribute(node.querySelector('a'), 'href')),
                inStock: safeText(node.querySelector('.instock')).toLowerCase() === 'in stock',
                vendor: ProductVendor.COMPUTER_ALLIANCE,
                description: safeText(node.querySelector('.equalize')),
            }],
            image: safeAttribute(node.querySelector('.img-container')?.querySelector('img'), 'src'),
        }
        return product;
    } catch (error) {
        console.error('Error parsing Computer Alliance product:', error);
        return createEmptyProduct(ProductVendor.COMPUTER_ALLIANCE);
    }
}

export const pcCaseGearSearchProductHTMLNodeToProduct = (productItem: any) => {
    try {
        const product: Product = {
            name: productItem.products_name,
            info: [{
                originalPrice: parseFloat('0'),
                price: `$${productItem.products_price}`,
                url: `https://www.pccasegear.com/${productItem.Product_URL}`,
                inStock: productItem.indicator?.label === 'In stock',
                vendor: ProductVendor.PC_CASE_GEAR,
                description: productItem.products_description ?? '',
            }],
            image: productItem.Image_URL,
        }
        return product;
    } catch (error) {
        console.error('Error parsing PC Case Gear product:', error);
        return createEmptyProduct(ProductVendor.PC_CASE_GEAR);
    }
}

/**
 * Creates a fallback product when parsing fails
 */
const createEmptyProduct = (vendor: ProductVendor): Product => ({
    name: 'Error parsing product',
    info: [{
        originalPrice: 0,
        price: '$0',
        url: '',
        inStock: false,
        vendor,
        description: 'Failed to parse product data',
    }],
    image: '',
});
