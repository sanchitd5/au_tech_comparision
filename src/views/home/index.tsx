import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import WebScrapper from 'helpers/Scrapper/scrapper';
import { useCallback, useState } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReduxInitialStoreState from 'redux/baseStore';
import { API_ACTIONS } from 'redux/enums/login';
import { HTMLElement } from 'node-html-parser';
import { AppBar, Badge, Box, Card, Divider, Drawer, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, OutlinedInput, Toolbar, Typography } from '@mui/material';
import { Image } from 'components/Media/Media';
import axios from 'axios';
import _ from 'lodash';
import { Product, ProductInfo, ProductVendor } from 'types';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CART_ACTIONS } from 'redux/enums/cart';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextHelper } from 'helpers';
import { useKeyPress } from 'hooks';

function editDistance(s1: string, s2: string) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function similarity(s1: string, s2: string) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
}



const scorptecSearchProductHTMLNodeToProduct = (node: HTMLElement) => {
    const product: Product = {
        name: node.querySelector('.detail-product-title')?.querySelector('a')?.text ?? '',
        info: [{
            originalPrice: parseFloat(node.querySelector('.detail-product-before-price')?.text?.replace('$', '') ?? '0'),
            price: node.querySelector('.detail-product-price')?.innerText ?? '',
            url: node.querySelector('.detail-product-title')?.querySelector('a')?.getAttribute('href') ?? '',
            inStock: node.querySelector('.detail-product-stock')?.text?.trim().toLowerCase() === 'in stock' ? true : false,
            vendor: ProductVendor.SCORPTEC,
        }],
        image: node.querySelector('.detail-image-wrapper')?.querySelector('img')?.getAttribute('src') ?? '',
    }
    return product;
}

const centrecomSearchProductHTMLNodeToProduct = (productItem: any) => {
    const product: Product = {
        name: productItem.name,
        info: [{
            originalPrice: parseFloat('0'),
            price: `$${productItem.price}`,
            url: `https://www.centrecom.com.au/${productItem.seName}`,
            inStock: productItem.stockQuantity ? true : false,
            vendor: ProductVendor.CENTRECOM,

        }],
        image: productItem.imgUrl,
    }
    return product;
}

const msySearchProductHTMLNodeToProduct = (node: HTMLElement) => {
    const product: Product = {
        name: node.querySelector('.goods_name')?.querySelector('a')?.getAttribute('title') ?? '',
        info: [{
            originalPrice: parseFloat('0'),
            price: node.querySelector('.goods_price')?.text ?? '0',
            url: node.querySelector('.goods_name')?.querySelector('a')?.getAttribute('href') ?? '',
            inStock: node.querySelector('.goods_stock')?.text?.trim().toLowerCase() === 'in stock' ? true : false,
            vendor: ProductVendor.MSY,
        }],
        image: node.querySelector('.goods_img')?.querySelector('img')?.getAttribute('src') ?? '',
    }
    return product;
}

const pcCaseGearSearchProductHTMLNodeToProduct = (productItem: any) => {
    const product: Product = {
        name: productItem.products_name,
        info: [{
            originalPrice: parseFloat('0'),
            price: `$${productItem.products_price}`,
            url: `https://www.pccasegear.com/${productItem.Product_URL}`,
            inStock: productItem.indicator.label === 'In stock' ? true : false,
            vendor: ProductVendor.PC_CASE_GEAR,

        }],
        image: productItem.Image_URL,
    }
    return product;
}


const ProductInfoArea = ({ info, key, addProduct }: { info: _.Omit<ProductInfo, 'price'> & { price: number }, key: any, addProduct: Function }) => {
    return (
        <Grid item xs={12} spacing={1} container key={key}>
            <Grid item xs={3}>
                <Typography >
                    {TextHelper.titleCase(TextHelper.removeUnderscore(info.vendor))}
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography>
                    ${info.price}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography color={info.inStock ? 'green' : 'red'}>
                    {info.inStock ? 'In Stock' : 'Out of Stock'}
                </Typography>
            </Grid>
            <Grid item xs={2} padding={1}>
                <Button LinkComponent={'a'} variant='outlined' href={info.url} target={'_blank'} rel="noreferrer">View</Button>
            </Grid>
            <Grid item xs={2} padding={1}>
                <Button variant='contained' onClick={() => addProduct()}>Add To Cart</Button>
            </Grid>
        </Grid>
    )
}

const ProductCard = (props: { product: Product }) => {
    const dispatch = useDispatch();
    return (
        <Card component={Grid} container padding={2}>
            <Grid item xs={12}>
                <Image src={props.product.image} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6'>{props.product.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
                <br />
            </Grid>
            {
                props.product.info.map(info => ({
                    ...info,
                    price: parseFloat(info.price.replace('$', '').replace(',', ''))
                })).sort((a, b) => a.price < b.price ? -1 : 1).map((info, index) => {
                    return <ProductInfoArea addProduct={() => {
                        dispatch({
                            type: CART_ACTIONS.ADD_PRODUCT,
                            product: props.product,
                            vendor: info.vendor,
                        })
                    }} info={info} key={index} />
                })
            }
        </Card>
    )
}

const searchPcCaseGearProducts = async (searchTerm: string) => {
    const response = await axios.create({
        baseURL: 'https://hpd3dbj2io-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)&x-algolia-application-id=HPD3DBJ2IO&x-algolia-api-key=9559cf1a6c7521a30ba0832ec6c38499',
    }).post('', `{"requests":[{"indexName":"pccg_products","params":"query=${searchTerm}&maxValuesPerFacet=128&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%22manufacturers_name%22%2C%22indicator.filter%22%2C%22products_price%22%2C%22categories.lvl0%22%5D&tagFilters="}]}`);
    return response.data.results[0].hits.map((p: any) => pcCaseGearSearchProductHTMLNodeToProduct(p))
}

const searchScorptecProducts = async (searchTerm: string) => {
    let scorptecScrapper = new WebScrapper('https://computers.scorptec.com.au');
    const htmlContent = await scorptecScrapper.getHTMLFromPathWithParams(`/search`, {
        w: searchTerm
    }); // get the html content
    const content = htmlContent.querySelector('.content-wrapper'); // get the content wrapper
    const products = content?.querySelectorAll('.product-list-detail') ?? [];
    return products?.map(p => scorptecSearchProductHTMLNodeToProduct(p)) ?? []
}


const searchCentrecomProducts = async (searchTerm: string) => {
    const products = await axios.create({
        baseURL: 'https://computerparts.centrecom.com.au/api/search',
    }).get('', {
        params: {
            q: searchTerm,
            cid: '0ae1fd6a074947699fbe46df65ee5714',
            ps: 32
        }
    }).then((res) => res.data.p.map((p: any) => centrecomSearchProductHTMLNodeToProduct(p))).catch(e => console.error(e));
    return products;
}

const searchMSYProducts = async (searchTerm: string) => {
    let msyScrapper = new WebScrapper('https://www.msy.com.au');
    const htmlContent = await msyScrapper.getHTMLFromPathWithParams(`/search.php`, {
        cat_id: '',
        keywords: searchTerm
    }); // get the html content
    const products = htmlContent?.querySelectorAll('.goods_info') ?? [];
    return products?.map(p => msySearchProductHTMLNodeToProduct(p)) ?? []
}

const combineProducts = (products: Product[]): Product[] => {
    products = products.map(p => {
        p.name = p.name.replace('\r\n', '')
        p.name = p.name.trim()
        return p;
    });
    for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
            const similarityScore = similarity(products[i].name, products[j].name);
            if (similarityScore > 0.60 && (products[i].info.find(i => i.vendor === products[j].info[0].vendor) === undefined)) {
                products[i].info.push(...products[j].info)
                products.splice(j, 1)
            }
        }
    }
    return products;
}

const Header = () => {
    const cartState = useSelector((state: ReduxInitialStoreState) => state.cart ?? { cart: { totalItems: 0 } });
    const dispatch = useDispatch();
    const [cartOpen, setCartOpen] = useState<boolean>(false);
    const toggleCart = () => setCartOpen(!cartOpen);

    const cart = () => (
        <Box
            sx={{ width: '40vw' }}
            role="presentation"
            onKeyDown={() => toggleCart()}
        >
            <List>
                <ListItem>
                    <ListItemText primary="Cart" />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={(e) => {
                            e.stopPropagation();
                            dispatch({
                                type: CART_ACTIONS.CLEAR_CART,
                            });
                        }}>
                            Clear
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                {cartState.cart.products.map((cartProduct, index) => (
                    <ListItem href={cartProduct.url} target={'_blank'} rel="noreferrer" sx={{ backgroundColor: index % 2 === 0 ? 'whitesmoke' : null, color: 'black' }} key={'cartProduct_' + index} component={'a'} onClick={(e) => {
                        e.stopPropagation();
                    }}   >
                        <Grid container spacing={1}>
                            <Grid item xs={2}>
                                <Image src={cartProduct.image} style={{ width: '100%' }} />
                            </Grid>
                            <Grid item xs={6}>
                                <ListItemText primary={`${cartProduct.name}[${TextHelper.titleCase(TextHelper.removeUnderscore(cartProduct.vendor))}] ${cartProduct.quantity > 1 ? `(${cartProduct.quantity})` : ''}`} secondary={`$${cartProduct.price}`} />
                            </Grid>
                        </Grid>
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => {
                                dispatch({
                                    type: CART_ACTIONS.REMOVE_PRODUCT,
                                    product: cartProduct,
                                });
                            }} edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                        <Divider />
                    </ListItem>
                ))}
                {cartState.cart.totalItems ?
                    <ListItem sx={{ backgroundColor: 'black', color: 'white' }}>
                        <ListItemText primary={`Total: $${cartState.cart.total}`} />
                    </ListItem>
                    :
                    <ListItem
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}>
                        <ListItemText primary={`Cart is empty`} />
                    </ListItem>
                }
            </List>
        </Box>
    );

    return (
        <AppBar style={{ backgroundColor: 'black' }}>
            <Container maxWidth="xl">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Au Computer parts aggegator
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={() => toggleCart()}
                        >
                            <Badge badgeContent={cartState.cart.totalItems} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                    <Drawer
                        anchor={'right'}
                        open={cartOpen}
                        onClose={() => toggleCart()}
                    >
                        {cart()}
                    </Drawer>
                </Toolbar>
            </Container>
        </AppBar >
    );
}

const HomeScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[] | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);
    const useAuth = useSelector((state: ReduxInitialStoreState) => state.appConfig.useAuth)

    const dispatch = useDispatch();
    const searchAllVendors = useCallback(async (searchTerm: string) => {
        setSearching(true);
        setProducts(undefined);
        const values = await Promise.allSettled([
            searchScorptecProducts(searchTerm),
            searchCentrecomProducts(searchTerm),
            searchMSYProducts(searchTerm),
            searchPcCaseGearProducts(searchTerm)
        ])
        setSearching(false);
        let products: Product[] = [];
        values.forEach(v => {
            if (v.status === 'rejected') {
                console.error(v.reason)
            }
            if (v.status === 'fulfilled') {
                products.push(...v.value)
            }
        })
        setProducts(combineProducts(products))
    }, []);
    useKeyPress('Enter', () => searchTerm && searchAllVendors(searchTerm));
    return (
        <main>
            <Box><Header /></Box>
            <Container style={{ marginTop: '106px' }} >
                <Grid container spacing={3}>
                    <Grid item xs={10}>
                        <OutlinedInput fullWidth value={searchTerm} placeholder={'search a computer part'} onChange={(val) => {
                            if (!val.target.value) {
                                setProducts(undefined);
                            }
                            setSearchTerm(val.target.value);
                        }} />
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={() => searchTerm && searchAllVendors(searchTerm)} variant='contained'>Search</Button>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container component={'center'} spacing={2} >
                            {
                                !searchTerm && !searching && !products && 'Please enter a product to search'
                            }
                            {
                                searchTerm && searching && 'searching...'
                            }
                            {searchTerm && products && products.map((product, index) => {
                                return <Grid item padding={2} xs={12} key={index}>
                                    <ProductCard product={product} />
                                </Grid>
                            })}
                        </Grid>
                    </Grid>
                    {useAuth && <Grid item xs={12}>
                        <Button onClick={() => dispatch({ type: API_ACTIONS.LOGOUT_REQUEST })} variant="contained" color="primary">
                            Logout
                        </Button>
                    </Grid>}
                </Grid>
            </Container>
        </main>
    );
}

export default HomeScreen;