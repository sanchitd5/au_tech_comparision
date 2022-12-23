import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReduxInitialStoreState, { Cart, CartState } from 'store/baseStore';
import { Box, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import { Image } from 'components/Media/Media';
import { CART_ACTIONS } from 'store/enums/cart';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextHelper } from 'helpers';

export const CartList = ({ cart, useAddProduct }: { cart: Cart, useAddProduct: boolean }) => {
    const dispatch = useDispatch();
    return (
        <div >
            {
                cart.products.map((cartProduct, index) => (
                    <ListItem sx={{ backgroundColor: index % 2 === 0 ? 'whitesmoke' : null, color: 'black' }} key={'cartProduct_' + index} onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <Grid href={cartProduct.url} sx={{ color: 'black' }} target={'_blank'} rel="noreferrer" container component={'a'} spacing={1}>
                            <Grid item xs={2}>
                                <Image src={cartProduct.image} style={{ width: '100%' }} />
                            </Grid>
                            <Grid item xs={6}>
                                <ListItemText primary={`${cartProduct.name}[${TextHelper.titleCase(TextHelper.removeUnderscore(cartProduct.vendor))}] ${cartProduct.quantity > 1 ? `(${cartProduct.quantity})` : ''}`} secondary={`$${cartProduct.price}`} />
                            </Grid>
                            <Divider />
                        </Grid>
                        {useAddProduct && <ListItemSecondaryAction>
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                dispatch({
                                    type: CART_ACTIONS.REMOVE_PRODUCT,
                                    product: cartProduct,
                                });
                            }} edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>}
                    </ListItem>
                ))
            }
            {cart.totalItems ?
                <ListItem sx={{ backgroundColor: 'black', color: 'white', bottom: 0,}}>
                    <ListItemText primary={`Total: $${cart.total}`} />
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
        </ div>);
}

export const CartComponent = ({ cartState, toggleCart }: { cartState: CartState, toggleCart: Function }) => {
    const dispatch = useDispatch();
    return (<Box
        sx={{ width: '40vw' }}
        role="presentation"
        onKeyDown={() => toggleCart()}
    >
        <List sx={{ height: '98.3vh' }}>
            <ListItem>
                <ListItemText primary="Cart" />
                <ListItemSecondaryAction>
                    <Grid container>
                        <Grid item xs={4}>
                            <Button hidden={!cartState.cart.products.length} disabled={!cartState.cart.products.length} onClick={(e) => {
                                e.stopPropagation();
                                dispatch({
                                    type: CART_ACTIONS.SAVE_CART_SNAPSHOT,
                                });
                            }}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button disabled={!cartState.cart.products.length} onClick={(e) => {
                                e.stopPropagation();
                                dispatch({
                                    type: CART_ACTIONS.CLEAR_CART,
                                });
                            }}>
                                Clear
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                                Total Items: {cartState.cart.totalItems}
                            </Typography>
                        </Grid>
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
            <CartList cart={cartState.cart} useAddProduct={true} />

        </List>
    </Box>);
}

export const CompareCartModelContent = () => {
    const prevCartSnapshots = useSelector((state: ReduxInitialStoreState) => state.cart.prevCartSnapshots);
    const dispatch = useDispatch();
    return (
        <Grid container>
            {
                prevCartSnapshots.map((cart, index) => (
                    <Grid item xs={prevCartSnapshots.length % 2 === 0 ? 6 : (prevCartSnapshots.length % 3 === 0 ? 4 : 12)} key={'cart_' + index}>
                        <Container>
                            <Button onClick={() => {
                                dispatch({
                                    type: CART_ACTIONS.RESTORE_CART_SNAPSHOT,
                                    cartIndex: index,
                                })
                            }}>Edit</Button>
                            <CartList cart={cart} useAddProduct={false} />
                        </Container>
                    </Grid>
                ))
            }
        </Grid>
    )
}
