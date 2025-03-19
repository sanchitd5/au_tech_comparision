import stringSimilarity from "string-similarity";
import { Product } from 'types';

/**
 * Extract possible model/part numbers from product name
 * Most tech products have alphanumeric identifiers like "RTX 3080", "i7-12700K", etc.
 */
const extractModelNumbers = (name: string): string[] => {
    // Match patterns like: 
    // - Alphanumeric with dashes (i7-12700K)
    // - Letters followed by numbers (RTX3080, RX6800)
    // - Clean common prefixes/suffixes
    const patterns = [
        /([A-Za-z]+[\s-]?[0-9]+[A-Za-z0-9-]*)/g, // Matches "RTX 3080", "i7-12700K"
        /([0-9]+[A-Za-z]{1,2}[\s-]?[0-9]*)/g,    // Matches "3080 Ti", "980Ti"
        /([A-Z][0-9]{3,5})/g,                    // Matches model numbers like "X570", "B550"
    ];
    
    const resultsSet = new Set<string>();
    patterns.forEach(pattern => {
        const matches = name.match(pattern);
        if (matches) {
            matches.forEach(match => resultsSet.add(match.replace(/\s/g, '').toLowerCase()));
        }
    });
    
    // Convert Set to Array to avoid spread operator issues
    return Array.from(resultsSet);
}

/**
 * Extract manufacturer/brand from product name
 */
const extractManufacturer = (name: string): string => {
    // Common PC hardware manufacturers
    const manufacturers = [
        'ASUS', 'MSI', 'Gigabyte', 'EVGA', 'Corsair', 'Logitech', 'Kingston', 'Seagate', 
        'Western Digital', 'Samsung', 'Cooler Master', 'AMD', 'Intel', 'Nvidia', 'Crucial',
        'G.Skill', 'Thermaltake', 'SteelSeries', 'Razer', 'HyperX', 'NZXT', 'PNY', 'XFX',
        'Palit', 'Zotac', 'Sapphire', 'PowerColor', 'AsRock', 'BenQ', 'Acer', 'HP', 'Dell',
        'LG', 'AOC', 'ViewSonic', 'Fractal Design', 'Lian Li', 'be quiet!', 'Seasonic'
    ];
    
    // Look for manufacturer name at the beginning of product name
    const nameLower = name.toLowerCase();
    for (const brand of manufacturers) {
        if (nameLower.startsWith(brand.toLowerCase())) {
            return brand.toLowerCase();
        }
        
        // Also check for brand anywhere in the name with word boundaries
        const brandRegex = new RegExp(`\\b${brand.toLowerCase()}\\b`);
        if (brandRegex.test(nameLower)) {
            return brand.toLowerCase();
        }
    }
    return '';
}

/**
 * Extract model variant information (like SUPRIM X, VENTUS 3X, Gaming Trio)
 * These are typically found after the core model number
 */
const extractModelVariant = (name: string): string => {
    // Common GPU variant identifiers
    const variantIdentifiers = [
        'SUPRIM', 'VENTUS', 'GAMING', 'TRIO', 'VANGUARD', 'GAMEROCK', 
        'STRIX', 'TUF', 'AORUS', 'EAGLE', 'VISION', 'GAMING X', 
        'PHOENIX', 'DUAL', 'ROG', 'PULSE', 'NITRO+', 'FOUNDER', 
        'GAMING PRO', 'KINGPIN', 'FTW3', 'XC3', 'BLACK', 'OC'
    ];
    
    const nameLower = name.toLowerCase();
    
    // First try to isolate text after model number
    const models = extractModelNumbers(name);
    if (models.length > 0) {
        // Find the position of the core model in the original string
        const modelPos = nameLower.indexOf(models[0]);
        if (modelPos >= 0) {
            const afterModel = name.substring(modelPos + models[0].length).trim();
            
            // If there's text after the model, that's likely our variant
            if (afterModel) {
                return afterModel.toLowerCase().trim();
            }
        }
    }
    
    // Fallback: look for specific variant names
    for (const variant of variantIdentifiers) {
        if (nameLower.includes(variant.toLowerCase())) {
            return variant.toLowerCase();
        }
    }
    
    return '';
};

/**
 * Determine product category based on name
 */
const getProductCategory = (name: string): string => {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('ryzen') || 
        nameLower.includes('core i') || 
        nameLower.includes('processor') || 
        nameLower.includes('cpu')) {
        return 'cpu';
    }
    
    if (nameLower.includes('rtx') || 
        nameLower.includes('radeon') || 
        nameLower.includes('geforce') || 
        nameLower.includes('gpu')) {
        return 'gpu';
    }
    
    if (nameLower.includes('motherboard')) return 'motherboard';
    if (nameLower.includes('ram') || nameLower.includes('ddr')) return 'ram';
    if (nameLower.includes('ssd') || nameLower.includes('hdd') || nameLower.includes('nvme')) return 'storage';
    
    return 'other';
}

/**
 * Calculate similarity score between two products using multiple factors
 */
const calculateProductSimilarity = (product1: Product, product2: Product): number => {
    // Name similarity (base score)
    const nameSimilarity = stringSimilarity.compareTwoStrings(
        product1.name.toLowerCase(), 
        product2.name.toLowerCase()
    );
    
    // Extract and compare model numbers
    const models1 = extractModelNumbers(product1.name);
    const models2 = extractModelNumbers(product2.name);
    
    // Extract manufacturers
    const manufacturer1 = extractManufacturer(product1.name);
    const manufacturer2 = extractManufacturer(product2.name);
    
    // Extract model variants
    const variant1 = extractModelVariant(product1.name);
    const variant2 = extractModelVariant(product2.name);
    
    // Determine product categories
    const category1 = getProductCategory(product1.name);
    const category2 = getProductCategory(product2.name);
    
    // If manufacturers are different and both are identified, apply a strong penalty
    let manufacturerPenalty = 0;
    if (manufacturer1 && manufacturer2 && manufacturer1 !== manufacturer2) {
        manufacturerPenalty = -0.4;
    }
    
    // For variant penalties, be more lenient with CPUs
    let variantPenalty = 0;
    if (variant1 && variant2 && variant1 !== variant2) {
        // Apply different penalties based on product category
        if (category1 === 'gpu' && category2 === 'gpu') {
            variantPenalty = -0.35; // Keep strict for GPUs
        } else if (category1 === 'cpu' && category2 === 'cpu') {
            variantPenalty = -0.15; // More lenient for CPUs
        } else {
            variantPenalty = -0.25; // Medium penalty for other categories
        }
    }
    
    // Model number match is very important, especially for CPUs
    let modelMatchBoost = 0;
    let exactModelMatch = false; // Define outside the if block so it's available in wider scope
    
    if (models1.length > 0 && models2.length > 0) {
        // Check for exact model matches (case insensitive)
        exactModelMatch = models1.some(m1 => 
            models2.some(m2 => m1.toLowerCase() === m2.toLowerCase())
        );
        
        // Check for high similarity matches
        const similarModelMatch = !exactModelMatch && models1.some(m1 => 
            models2.some(m2 => stringSimilarity.compareTwoStrings(m1, m2) > 0.85)
        );
        
        if (exactModelMatch) {
            // Stronger boost for exact model match on CPUs
            modelMatchBoost = category1 === 'cpu' && category2 === 'cpu' ? 0.45 : 0.35;
        } else if (similarModelMatch) {
            modelMatchBoost = 0.25;
        } else {
            // Penalty for no model match
            modelMatchBoost = -0.2;
        }
    }
    
    // Special handling for product-specific identifiers like part numbers
    let partNumberBoost = 0;
    
    // Look for product codes in parentheses (common for CPUs)
    const partCodePattern = /\(([A-Za-z0-9-]+)\)/i;
    const partCode1 = product1.name.match(partCodePattern);
    const partCode2 = product2.name.match(partCodePattern);
    
    // If only one has a part code, no impact
    // If both have different part codes, penalty
    // If both have same part code, boost
    if (partCode1 && partCode2) {
        if (partCode1[1].toLowerCase() === partCode2[1].toLowerCase()) {
            partNumberBoost = 0.2; // Same part code = very likely same product
        } else {
            partNumberBoost = -0.2; // Different part codes = likely different products
        }
    }

    // Combine scores with weights
    let finalScore = nameSimilarity + modelMatchBoost + manufacturerPenalty + 
                     variantPenalty + partNumberBoost;
                     
    // For CPUs specifically, if the model numbers match exactly, give a significant boost
    // This helps ensure items like AMD Ryzen 9 9950X3D with different descriptions still merge
    if (category1 === 'cpu' && category2 === 'cpu' && exactModelMatch) {
        finalScore += 0.15;
    }
    
    return Math.min(1, Math.max(0, finalScore));
}

/**
 * Improved product combining algorithm
 */
export const combineProducts = (products: Product[]): Product[] => {
    // Clean product names
    products = products.map(p => ({
        ...p,
        name: p.name.replace(/\r\n/g, '').trim()
    }));
    
    // Track which products have been merged
    const merged = new Set<number>();
    const result: Product[] = [];
    
    // Group products by potential model numbers to reduce comparison space
    const productGroups = new Map<string, number[]>();
    
    // First pass - create initial groupings
    products.forEach((product, index) => {
        const models = extractModelNumbers(product.name);
        const key = models.length > 0 ? models[0] : `no-model-${index}`;
        
        if (!productGroups.has(key)) {
            productGroups.set(key, []);
        }
        productGroups.get(key)!.push(index);
    });
    
    // Second pass - merge similar products within groups
    productGroups.forEach((indices) => {
        for (let i = 0; i < indices.length; i++) {
            if (merged.has(indices[i])) continue;
            
            const mergedProduct = {...products[indices[i]]};
            const category = getProductCategory(mergedProduct.name);
            merged.add(indices[i]);
            
            // Check against other products in the same group
            for (let j = i + 1; j < indices.length; j++) {
                if (merged.has(indices[j])) continue;
                
                const similarity = calculateProductSimilarity(mergedProduct, products[indices[j]]);
                
                // Use category-specific thresholds
                let threshold = 0.85; // Default strict threshold
                
                // More lenient threshold for CPUs
                if (category === 'cpu') {
                    threshold = 0.78;
                }
                // Keep strict threshold for GPUs
                else if (category === 'gpu') {
                    threshold = 0.85;
                }
                
                if (similarity > threshold) {
                    // Additional checks for GPUs
                    let canMerge = true;
                    if (category === 'gpu') {
                        const variant1 = extractModelVariant(mergedProduct.name);
                        const variant2 = extractModelVariant(products[indices[j]].name);
                        
                        // Only merge if variants match or neither has a detected variant
                        canMerge = (!variant1 && !variant2) || (variant1 === variant2 && variant1 !== '');
                    }
                    
                    // Check if vendor already exists in merged product
                    const vendorExists = mergedProduct.info.some(info => 
                        products[indices[j]].info.some(otherInfo => 
                            otherInfo.vendor === info.vendor
                        )
                    );
                    
                    // Only merge if the vendor doesn't already exist AND our checks pass
                    if (!vendorExists && canMerge) {
                        mergedProduct.info.push(...products[indices[j]].info);
                        merged.add(indices[j]);
                    }
                }
            }
            
            result.push(mergedProduct);
        }
    });
    
    // Add any products that weren't merged - using standard loop to avoid Set iteration
    for (let i = 0; i < products.length; i++) {
        if (!merged.has(i)) {
            result.push(products[i]);
        }
    }
    
    return result;
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
