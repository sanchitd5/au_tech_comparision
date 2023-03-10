
import _ from "lodash";
import { CART_ACTIONS } from "store/enums/cart";
import { CartProduct, Product, ProductVendor } from "types";
import { CartState, INITIAL_CART_STATE } from "../../baseStore";

const calculateTotal = (products: CartProduct[]) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0)
}

const isProduct = (product: Product | CartProduct): product is Product => {
    return (product as Product).info !== undefined;
}

const isCartProduct = (product: Product | CartProduct): product is CartProduct => {
    return (product as CartProduct).quantity !== undefined;
}

const cartReducer = (state: CartState = INITIAL_CART_STATE, action: { product: Product | CartProduct, type: CART_ACTIONS, vendor?: ProductVendor, cartIndex?: number }) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_PRODUCT: {
            const products = state.cart.products;
            const product = action.product;
            if (isProduct(product)) {
                const productIndex = products.findIndex((p) => p.name === product.name && p.vendor === action.vendor);
                const productInfo = product.info.find((p) => p.vendor === action.vendor);
                if (!productInfo) {
                    throw new Error('Product Vendor not found');
                }
                if (!productInfo.inStock) {
                    throw new Error('Product out of stock');
                }
                if (productIndex === -1) {
                    const newProduct: CartProduct = {
                        name: product.name,
                        image: product.image,
                        price: parseFloat(productInfo.price.replace('$', '').replace(',', '')),
                        vendor: productInfo.vendor,
                        url: productInfo.url,
                        quantity: 1
                    }
                    products.push(newProduct);
                } else {
                    products[productIndex].quantity += 1;
                }
                return _.cloneDeep({
                    ...state,
                    cart: {
                        products: products,
                        total: calculateTotal(products),
                        totalItems: products.reduce((total, product) => total + product.quantity, 0)
                    }
                });
            }
            throw new Error('Incorrect paramerters');
        }
        case CART_ACTIONS.REMOVE_PRODUCT: {
            const products = state.cart.products;
            const product = action.product;
            if (isCartProduct(product)) {
                const productIndex = products.findIndex((p) => p.name === product.name && p.vendor === product.vendor);
                if (productIndex === -1) {
                    throw new Error('Product not found');
                }
                products[productIndex].quantity -= 1;
                if (products[productIndex].quantity === 0) {
                    products.splice(productIndex, 1);
                }
                return _.cloneDeep({
                    ...state,
                    cart: {
                        products: products,
                        total: calculateTotal(products),
                        totalItems: products.reduce((total, product) => total + product.quantity, 0)
                    }
                });
            }
            throw new Error('Incorrect paramerters');
        }
        case CART_ACTIONS.SAVE_CART_SNAPSHOT: {
            const prevCartSnapshots = state.prevCartSnapshots;
            prevCartSnapshots.push(state.cart);
            return _.cloneDeep({
                ...state,
                cart: {
                    products: [],
                    total: 0,
                    totalItems: 0
                },
                prevCartSnapshots: _.cloneDeep(prevCartSnapshots)
            });
        }
        case CART_ACTIONS.RESTORE_CART_SNAPSHOT: {
            const prevCartSnapshots = state.prevCartSnapshots;
            if (!prevCartSnapshots.length) {
                throw new Error('No cart snapshots');
            }
            if (action.cartIndex === undefined) {
                throw new Error('No cart index');
            }
            const cart = _.cloneDeep(prevCartSnapshots[action.cartIndex]);
            prevCartSnapshots.splice(action.cartIndex, 1)
            return _.cloneDeep({
                ...state,
                cart: cart,
                prevCartSnapshots: prevCartSnapshots,
            });
        }
        case CART_ACTIONS.COPY_CART_SNAPSHOT: {
            const prevCartSnapshots = state.prevCartSnapshots;
            if (!prevCartSnapshots.length) {
                throw new Error('No cart snapshots');
            }
            if (action.cartIndex === undefined) {
                throw new Error('No cart index');
            }
            const cart = _.cloneDeep(prevCartSnapshots[action.cartIndex]);
            return _.cloneDeep({
                ...state,
                cart: cart,
                prevCartSnapshots: _.cloneDeep(prevCartSnapshots),
            });
        }
        case CART_ACTIONS.CLEAR_CART: {
            return _.cloneDeep({
                ...state,
                cart: {
                    products: [],
                    total: 0,
                    totalItems: 0
                },
            });
        }
        default:
            return state;
    }
}

export default cartReducer;