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
        <>
            {
                cart.products.map((cartProduct, index) => (
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
                        <Divider />
                    </ListItem>
                ))
            }
            {cart.totalItems ?
                <ListItem sx={{ backgroundColor: 'black', color: 'white' }}>
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
        </>);
}

export const CartComponent = ({ cartState, toggleCart }: { cartState: CartState, toggleCart: Function }) => {
    const dispatch = useDispatch();
    return (<Box
        sx={{ width: '40vw' }}
        role="presentation"
        onKeyDown={() => toggleCart()}
    >
        <List>
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
                    <Grid item xs={prevCartSnapshots.length % 2 === 0 ? 6 : 12} key={'cart_' + index}>
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
