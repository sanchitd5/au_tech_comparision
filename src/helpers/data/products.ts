import stringSimilarity from "string-similarity";
import { Product } from 'types';


export const combineProducts = (products: Product[]): Product[] => {
    products = products.map(p => {
        p.name = p.name.replace('\r\n', '')
        p.name = p.name.trim()
        return p;
    });
    for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
            const similarityScore = stringSimilarity.compareTwoStrings(products[i].name, products[j].name);
            if ((similarityScore > 0.60) && (products[i].info.find(i => i.vendor === products[j].info[0].vendor) === undefined)) {
                products[i].info.push(...products[j].info)
                products.splice(j, 1)
            }
        }
    }
    return products;
}

export const sortProductByAveragePrice = (a: Product, b: Product, searchTerm: string) => {
    const aPrice = a.info.reduce((acc, cur) => acc + parseFloat(cur.price.replace(`$`, '').replace(',', '')), 0) / a.info.length;
    const bPrice = b.info.reduce((acc, cur) => acc + parseFloat(cur.price.replace(`$`, '').replace(',', '')), 0) / b.info.length;
    if (
        (a.name.toLowerCase().includes(searchTerm.toLowerCase()) && b.name.toLowerCase().includes(searchTerm.toLowerCase()))
        || a.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
        return aPrice - bPrice;
    }
    if (b.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return 1;
    }
    return aPrice - bPrice;
}
