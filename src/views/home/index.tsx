import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch } from 'react-redux';
import {
    Box, FormControlLabel, OutlinedInput, InputAdornment, Typography, Paper, IconButton,
    Fade, Slider, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import _ from 'lodash';
import { Product } from 'types';
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
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';

const HomeScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[] | undefined>(undefined);
    const [customProduct, setCustomProduct] = useState<Product | undefined>(undefined);
    const [sortOption, setSortOption] = useState<string>("relevance");
    const [customModalOpen, setCustomModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);

    // Filter states
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState<boolean>(false);

    const dispatch = useDispatch();

    // Find min and max prices and unique vendors in products
    const { minPrice, maxPrice, vendors } = useMemo(() => {
        if (!products || products.length === 0) {
            return { minPrice: 0, maxPrice: 1000, vendors: [] };
        }

        let min = Number.MAX_SAFE_INTEGER;
        let max = 0;
        const uniqueVendors = new Set<string>();

        products.forEach(product => {
            product.info.forEach(info => {
                if (info.price) {
                    // Parse price string properly by removing $ and commas
                    const parsedPrice = parseFloat(info.price.replace(/[$,]/g, ''));
                    if (!isNaN(parsedPrice)) {
                        min = Math.min(min, parsedPrice);
                        max = Math.max(max, parsedPrice);
                    }
                }
                if (info.vendor) {
                    uniqueVendors.add(info.vendor);
                }
            });
        });

        return {
            minPrice: min === Number.MAX_SAFE_INTEGER ? 0 : Math.floor(min),
            maxPrice: max === 0 ? 1000 : Math.ceil(max) + 100,
            vendors: Array.from(uniqueVendors)
        };
    }, [products]);

    // Update price range when products change
    useEffect(() => {
        if (products && products.length > 0) {
            setPriceRange([minPrice, maxPrice]);
        }
    }, [minPrice, maxPrice, products]);

    // Filter products based on current filters
    const filteredProducts = useMemo(() => {
        if (!products) return undefined;

        return products.filter(product => {
            // Filter by price - fix the price parsing
            const hasProductInPriceRange = product.info.some(info => {
                if (!info.price) return false;
                const parsedPrice = parseFloat(info.price.replace(/[$,]/g, ''));
                return !isNaN(parsedPrice) && parsedPrice >= priceRange[0] && parsedPrice <= priceRange[1];
            });

            if (!hasProductInPriceRange) return false;

            // Filter by selected vendors
            if (selectedVendors.length > 0) {
                const hasSelectedVendor = product.info.some(info =>
                    selectedVendors.includes(info.vendor)
                );
                if (!hasSelectedVendor) return false;
            }

            // Filter by in-stock status
            if (inStockOnly) {
                const isInStock = product.info.some(info =>
                    info.inStock === true || info.inStock === undefined
                );
                if (!isInStock) return false;
            }

            return true;
        });
    }, [products, priceRange, selectedVendors, inStockOnly]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setPriceRange([minPrice, maxPrice]);
        setSelectedVendors([]);
        setInStockOnly(false);
    }, [minPrice, maxPrice]);

    const searchAllVendors = useCallback(async (searchTerm: string) => {
        if (!searchTerm?.trim()) return;

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

    const onCustomProductChange = useCallback((product: Product) => {
        setCustomProduct(product);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm(undefined);
        setProducts(undefined);
        resetFilters();
    }, [resetFilters]);

    const handleSearch = () => searchTerm && searchAllVendors(searchTerm);

    useKeyPress('Enter', handleSearch);

    // Add a helper function to format price displays for consistency
    const formatPrice = (price: number) => {
        return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    // Function to sort products by availability (in-stock first)
    const sortByAvailability = useCallback((products: Product[]) => {
        return [...products].sort((a, b) => {
            // Check if product A has any in-stock items
            const aHasInStock = a.info.some(info => info.inStock === true);
            // Check if product B has any in-stock items
            const bHasInStock = b.info.some(info => info.inStock === true);

            if (aHasInStock && !bHasInStock) return -1; // A is in stock, B is not
            if (!aHasInStock && bHasInStock) return 1;  // B is in stock, A is not
            return 0; // Both have the same stock status
        });
    }, []);

    // Function to apply selected sorting option
    const applySorting = useCallback((products: Product[]) => {
        const sorted = [...products];
        
        switch(sortOption) {
            case 'averagePrice':
                return sorted.sort((a, b) => sortProductByAveragePrice(a, b, searchTerm || ''));
            case 'priceLowToHigh':
                return sorted.sort((a, b) => {
                    // Find lowest price among in-stock items for each product
                    const aInStockItems = a.info.filter(info => info.inStock === true || info.inStock === undefined);
                    const bInStockItems = b.info.filter(info => info.inStock === true || info.inStock === undefined);
                    
                    // If one product has in-stock items and the other doesn't, prioritize the in-stock one
                    if (aInStockItems.length && !bInStockItems.length) return -1;
                    if (!aInStockItems.length && bInStockItems.length) return 1;
                    
                    // If both have in-stock items or both don't, compare by price
                    const aItems = aInStockItems.length ? aInStockItems : a.info;
                    const bItems = bInStockItems.length ? bInStockItems : b.info;
                    
                    const aPrice = Math.min(...aItems.map(info => 
                        parseFloat(info.price?.replace(/[$,]/g, '') || '999999')).filter(p => !isNaN(p)));
                    const bPrice = Math.min(...bItems.map(info => 
                        parseFloat(info.price?.replace(/[$,]/g, '') || '999999')).filter(p => !isNaN(p)));
                    
                    return aPrice - bPrice;
                });
            case 'priceHighToLow':
                return sorted.sort((a, b) => {
                    // Find highest price among in-stock items for each product
                    const aInStockItems = a.info.filter(info => info.inStock === true || info.inStock === undefined);
                    const bInStockItems = b.info.filter(info => info.inStock === true || info.inStock === undefined);
                    
                    // If one product has in-stock items and the other doesn't, prioritize the in-stock one
                    if (aInStockItems.length && !bInStockItems.length) return -1;
                    if (!aInStockItems.length && bInStockItems.length) return 1;
                    
                    // If both have in-stock items or both don't, compare by price
                    const aItems = aInStockItems.length ? aInStockItems : a.info;
                    const bItems = bInStockItems.length ? bInStockItems : b.info;
                    
                    const aPrice = Math.max(...aItems.map(info => 
                        parseFloat(info.price?.replace(/[$,]/g, '') || '0')).filter(p => !isNaN(p)));
                    const bPrice = Math.max(...bItems.map(info => 
                        parseFloat(info.price?.replace(/[$,]/g, '') || '0')).filter(p => !isNaN(p)));
                    
                    return bPrice - aPrice;
                });
            case 'relevance':
            default:
                return sorted; // Default sorting by relevance (search results order)
        }
    }, [sortOption, searchTerm]);

    return (
        <main>
            <Box><Header /></Box>
            <Container maxWidth="lg" sx={{ mt: '106px', pb: 4 }}>
                <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
                        Search for Computer Parts
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <OutlinedInput
                                fullWidth
                                value={searchTerm || ''}
                                placeholder='Search for a computer part...'
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton onClick={clearSearch} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                                sx={{ borderRadius: 1.5 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                onClick={handleSearch}
                                fullWidth
                                variant='contained'
                                disabled={!searchTerm || searching}
                                startIcon={<SearchIcon />}
                                sx={{ height: '56px', borderRadius: 1.5 }}
                            >
                                Search
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                onClick={() => setCustomModalOpen(true)}
                                fullWidth
                                variant='outlined'
                                color="secondary"
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{ height: '56px', borderRadius: 1.5 }}
                            >
                                Add Custom
                            </Button>
                        </Grid>
                        <Grid item xs={12} container alignItems="center" spacing={2}>
                            <Grid item xs>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel id="sort-select-label">Sort By</InputLabel>
                                    <Select
                                        labelId="sort-select-label"
                                        value={sortOption}
                                        label="Sort By"
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <MenuItem value="relevance">Relevance</MenuItem>
                                        <MenuItem value="averagePrice">Average Price</MenuItem>
                                        <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                                        <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {searchTerm && products && (
                                <Grid item>
                                    <Button
                                        onClick={() => setShowFilters(!showFilters)}
                                        startIcon={<TuneIcon />}
                                        variant={showFilters ? "contained" : "outlined"}
                                        color="primary"
                                        size="small"
                                    >
                                        Filters {filteredProducts && products && filteredProducts.length !== products.length && `(${filteredProducts.length}/${products.length})`}
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    {/* Filter section */}
                    {showFilters && searchTerm && products && (
                        <Fade in={showFilters}>
                            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Grid container spacing={4}>
                                    {/* Price range filter */}
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                                            Price Range
                                        </Typography>
                                        <Box sx={{ px: 1 }}>
                                            <Slider
                                                value={priceRange}
                                                onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
                                                valueLabelDisplay="auto"
                                                min={minPrice}
                                                max={maxPrice}
                                                step={10}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="body2">{formatPrice(priceRange[0])}</Typography>
                                                <Typography variant="body2">{formatPrice(priceRange[1])}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Vendor filter */}
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                                            Vendors
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="vendors-select-label">Select Vendors</InputLabel>
                                            <Select
                                                labelId="vendors-select-label"
                                                multiple
                                                value={selectedVendors}
                                                onChange={(e) => setSelectedVendors(e.target.value as string[])}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} size="small" />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {vendors.map((vendor) => (
                                                    <MenuItem key={vendor} value={vendor}>
                                                        {vendor}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Stock filter */}
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                                            Availability
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={inStockOnly}
                                                    onChange={() => setInStockOnly(prev => !prev)}
                                                />
                                            }
                                            label={'In Stock Only'}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                onClick={resetFilters}
                                                variant="text"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            >
                                                Reset Filters
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Fade>
                    )}
                </Paper>

                <Box sx={{ minHeight: '200px' }}>
                    {!searchTerm && !searching && !products && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            height: '200px',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            p: 3
                        }}>
                            <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Enter a product name to begin searching
                            </Typography>
                        </Box>
                    )}

                    {searching && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px'
                        }}>
                            <LoadingCircle />
                        </Box>
                    )}

                    {searchTerm && products && (
                        <Fade in={!searching}>
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3 }}>
                                    Search Results {filteredProducts &&
                                        `(${filteredProducts.length}${filteredProducts.length !== products.length ? ` of ${products.length}` : ''})`}
                                </Typography>

                                <Grid container spacing={3}>
                                    {applySorting(sortByAvailability(_.cloneDeep(filteredProducts || [])))
                                        .map((product, index) => (
                                            <Grid item xs={12} md={6} key={index}>
                                                <ProductCard product={product} />
                                            </Grid>
                                        ))
                                    }
                                </Grid>

                                {filteredProducts && filteredProducts.length === 0 && (
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '200px',
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                        p: 3,
                                        flexDirection: 'column'
                                    }}>
                                        <FilterListIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No products match your filters
                                        </Typography>
                                        <Button
                                            onClick={resetFilters}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        >
                                            Reset Filters
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Container>

            <EnhancedModal
                isOpen={customModalOpen}
                dialogTitle={'Add Custom Product'}
                dialogContent={
                    <CustomProductEntryModalContent onChange={onCustomProductChange} />
                }
                options={{
                    onClose: () => setCustomModalOpen(false),
                    onSubmit: () => {
                        if (!customProduct) {
                            notify('Please fill out all fields', 'inapp');
                            return;
                        }
                        try {
                            const _Product = customProduct;
                            addProduct(_Product);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setCustomProduct(undefined);
                            setCustomModalOpen(false);
                        }
                    }
                }}
            />
        </main>
    );
}

export default HomeScreen;