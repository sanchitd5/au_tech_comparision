import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { Card, Chip, Divider, IconButton, Typography } from '@mui/material';
import { Image } from 'components/Media/Media';
import _ from 'lodash';
import { Product, ProductInfo } from 'types';
import { CART_ACTIONS } from 'store/enums/cart';
import { TextHelper } from 'helpers';
import { AddShoppingCart, Launch } from '@mui/icons-material';

export const ProductInfoArea = ({ info, key, addProduct }: { info: _.Omit<ProductInfo, 'price'> & { price: number }, key: any, addProduct: Function }) => {
    return (
        <Grid item xs={12} spacing={1} key={key} >
            <Grid container padding={1} alignContent='center' alignItems='center' sx={{
                border: '1px solid #e0e0e0',

            }}>
                <Grid item xs={4}>
                    <Typography component={'a'}
                        sx={{
                            color: 'black',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }} href={info.url} target={'_blank'} rel="noreferrer" >
                        {TextHelper.titleCase(TextHelper.removeUnderscore(info.vendor))}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Chip sx={{ background: info.inStock ? null : 'darkred', color: info.inStock ? null : 'white', width: '100%', }} label={info.inStock ? 'In Stock' : 'Out of Stock'} />
                </Grid>
                <Grid item xs={3}>
                    <Typography>
                        ${info.price}
                    </Typography>
                </Grid>

                <Grid item xs={2} padding={1}>
                    <IconButton disabled={!info.inStock} onClick={() => addProduct()}>
                        <AddShoppingCart />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        {info.description}
                    </Typography>
                </Grid>
            </Grid>
        </Grid >
    )
}

export const ProductCard = (props: { product: Product }) => {
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