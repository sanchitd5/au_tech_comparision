import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useCallback, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReduxInitialStoreState from 'store/baseStore';
import { API_ACTIONS } from 'store/enums/login';
import { Box, FormControlLabel, OutlinedInput } from '@mui/material';
import _ from 'lodash';
import { Product, ProductVendor } from 'types';
import { useKeyPress } from 'hooks';
import Checkbox from '@mui/material/Checkbox';
import SearchIntegrations from 'helpers/searchUtils';
import { combineProducts, sortProductByAveragePrice } from 'helpers/data/products';
import { Header } from 'components/Header';
import { ProductCard } from 'components/ProductCard';
import { LoadingCircle } from 'components/Loading';
import { notify } from 'components/Notification';
import { EnhancedModal } from 'components/EnhancedModal';
import { CustomProductEntryModalContent } from 'components/CustomProductEntryModal';
import { CART_ACTIONS } from 'store/enums/cart';

const HomeScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[] | undefined>(undefined);
    const [customProduct, setCustomProduct] = useState<Product | undefined>(undefined);
    const [sortUsingAveragePrice, setSortUsingAveragePrice] = useState<boolean>(false);
    const [customModalOpen, setCustomModalOpem] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);
    const useAuth = useSelector((state: ReduxInitialStoreState) => state.appConfig.useAuth);
    const dispatch = useDispatch();
    const searchAllVendors = useCallback(async (searchTerm: string) => {
        setSearching(true);
        setProducts(undefined);
        const values = await Promise.allSettled(SearchIntegrations.map((i) => i(searchTerm)))
        setSearching(false);
        let products: Product[] = [];
        values.forEach(v => {
            if (v.status === 'rejected') {
                console.error(v.reason);
                notify(v.reason, 'inapp');
            }
            if (v.status === 'fulfilled') {
                products.push(...v.value)
            }
        })
        setProducts(combineProducts(products))
    }, []);

    const addProduct = useCallback((
        product: Product,
    ) => {
        if (product) {
            dispatch({ type: CART_ACTIONS.ADD_PRODUCT, product, vendor: product.info[0].vendor });
        }
    }, [dispatch]);

    useKeyPress('Enter', () => searchTerm && searchAllVendors(searchTerm));
    return (
        <main>
            <Box><Header /></Box>
            <Container style={{ marginTop: '106px' }} >
                <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <OutlinedInput fullWidth value={searchTerm} placeholder={'search a computer part'} onChange={(val) => {
                            if (!val.target.value) {
                                setProducts(undefined);
                            }
                            setSearchTerm(val.target.value);
                        }} />
                    </Grid>
                    <Grid item xs={1}>
                        <Button onClick={() => searchTerm && searchAllVendors(searchTerm)} fullWidth variant='contained'>Search</Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button onClick={() => setCustomModalOpem(true)} fullWidth variant='contained'>Add Custom</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControlLabel control={<Checkbox value={sortUsingAveragePrice} onChange={(e) => setSortUsingAveragePrice((prev) => !prev)} />} label={'Sort by average price'} />
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container component={'center'} spacing={2} >
                            {
                                !searchTerm && !searching && !products && 'Please enter a product to search'
                            }
                            {
                                searchTerm && searching && <LoadingCircle />
                            }
                            {searchTerm && products && _.cloneDeep(products).sort((a, b) => sortUsingAveragePrice ? sortProductByAveragePrice(a, b, searchTerm) : 0).map((product, index) => {
                                return <Grid item padding={2} xs={12} md={6} lg={6} key={index}>
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
            <EnhancedModal
                isOpen={customModalOpen}
                dialogTitle={'Add Custom Product'}
                dialogContent={
                    <CustomProductEntryModalContent onChange={(product) => {
                        console.info('product', product)
                        setCustomProduct(product);
                    }} />
                }
                options={{
                    onClose: () => setCustomModalOpem(false),
                    onSubmit: () => {
                        if (!customProduct) {
                            notify('Please fill out all fields', 'inapp');
                            return;
                        }
                        addProduct(customProduct);
                        setCustomModalOpem(false);
                    }
                }}
            />
        </main >
    );
}

export default HomeScreen;