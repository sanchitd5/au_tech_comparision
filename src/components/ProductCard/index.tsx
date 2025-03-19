import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { Card, Chip, Divider, IconButton, Typography, Box, Paper } from '@mui/material';
import { Image } from 'components/Media/Media';
import _ from 'lodash';
import { Product, ProductInfo } from 'types';
import { CART_ACTIONS } from 'store/enums/cart';
import { TextHelper } from 'helpers';
import { AddShoppingCart } from '@mui/icons-material';

export const ProductInfoArea = ({ info, key, addProduct }: { info: _.Omit<ProductInfo, 'price'> & { price: number }, key: any, addProduct: Function }) => {
    return (
        <Grid item xs={12} key={key}>
            <Paper elevation={1} sx={{
                p: 2,
                mb: 1,
                transition: 'all 0.3s',
                '&:hover': {
                    boxShadow: 3,
                }
            }}>
                <Grid container alignItems='center' spacing={2}>
                    <Grid item xs={4}  >
                        <Typography
                            fontWeight="bold"
                            sx={{
                                color: 'black',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {TextHelper.titleCase(TextHelper.removeUnderscore(info.vendor))}&nbsp;
                            <Typography component={'a'} href={info.url} target={'_blank'} rel="noreferrer">
                                (view)
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Chip
                            sx={{
                                background: info.inStock ? 'teal' : 'darkred',
                                color: 'white',
                                width: '100%',
                                fontWeight: 'medium',
                            }}
                            label={info.inStock ? 'In Stock' : 'Out of Stock'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                            ${info.price}
                        </Typography>
                    </Grid>

                    <Grid item xs={2}>
                        <IconButton
                            disabled={!info.inStock}
                            onClick={() => addProduct()}
                            color="primary"
                            sx={{
                                backgroundColor: info.inStock ? 'action.hover' : 'transparent',
                                '&:hover': {
                                    backgroundColor: info.inStock ? 'primary.light' : 'transparent'
                                }
                            }}
                        >
                            <AddShoppingCart />
                        </IconButton>
                    </Grid>

                    {info.description && (
                        <Grid item xs={12} sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {info.description}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Grid>
    )
}

export const ProductCard = (props: { product: Product }) => {
    const dispatch = useDispatch();
    return (
        <Card component={Grid} container sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Grid item xs={12} sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ maxHeight: 200, width: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <Image src={props.product.image} />
                </Box>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography variant='h5' fontWeight="bold">{props.product.name}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
                <Divider />
            </Grid>
            <Grid container spacing={2}>
                {
                    props.product.info.map(info => ({
                        ...info,
                        price: parseFloat(info.price.replace('$', '').replace(',', ''))
                    }))
                        .sort((a, b) => a.price < b.price ? -1 : 1)
                        .sort((a, b) => a.inStock ? -1 : (b.inStock ? 1 : 0))
                        .map((info, index) => {
                            return <ProductInfoArea
                                addProduct={() => {
                                    dispatch({
                                        type: CART_ACTIONS.ADD_PRODUCT,
                                        product: props.product,
                                        vendor: info.vendor,
                                    })
                                }}
                                info={info}
                                key={index}
                            />
                        })
                }
            </Grid>
        </Card>
    )
}