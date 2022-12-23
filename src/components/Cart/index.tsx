import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReduxInitialStoreState, { Cart, CartState } from 'store/baseStore';
import { Box, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Typography } from '@mui/material';
import { Image } from 'components/Media/Media';
import { CART_ACTIONS } from 'store/enums/cart';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextHelper } from 'helpers';
import { RemoveShoppingCartOutlined, Save } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { useCallback, useRef, useState } from 'react';


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
                            <IconButton sx={{ color: 'darkred' }} onClick={(e) => {
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
                <ListItem sx={{ backgroundColor: 'black', color: 'white', bottom: 0, }}>
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
            <ListSubheader component="div" id="nested-list-subheader">
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant='h6'>
                            {`Cart (${cartState.cart.totalItems})`}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton disabled={!cartState.cart.products.length} onClick={(e) => {
                            e.stopPropagation();
                            dispatch({
                                type: CART_ACTIONS.SAVE_CART_SNAPSHOT,
                            });
                        }}>
                            <Save />
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton disabled={!cartState.cart.products.length} onClick={(e) => {
                            e.stopPropagation();
                            dispatch({
                                type: CART_ACTIONS.CLEAR_CART,
                            });
                        }}>
                            <RemoveShoppingCartOutlined />
                        </IconButton>
                    </Grid>

                </Grid>
            </ListSubheader>
            <CartList cart={cartState.cart} useAddProduct={true} />

        </List>
    </Box>);
}

export const CompareCartModelContent = () => {
    const [printing, setPrinting] = useState<boolean>(false);
    const prevCartSnapshots = useSelector((state: ReduxInitialStoreState) => state.cart.prevCartSnapshots);
    const dispatch = useDispatch();
    const ref = useRef();
    const handlePrint = useReactToPrint({
        content: () => ref.current!,
    });

    const printCart = useCallback(() => {
        setPrinting(true);
        setTimeout(() => {
            handlePrint();
            setTimeout(() => {
                setPrinting(false);
            }, 200);
        }, 200);
    }, [handlePrint])

    return (<>
        <Button variant='contained' onClick={printCart}>Print</Button>
        <Box ref={ref}>
            <Grid container padding={printing ? 2 : 0} spacing={printing ? 2 : 0}>
                <Grid hidden={!printing} item xs={12}>
                    <Typography variant='h6'>
                        {`Cart comparision`}
                    </Typography>
                </Grid>
                {
                    prevCartSnapshots.map((cart, index) => (
                        <Grid item xs={prevCartSnapshots.length % 2 === 0 ? 6 : (prevCartSnapshots.length % 3 === 0 ? 4 : 12)} key={'cart_' + index}>
                            <Container>
                                {!printing && <>
                                    <Button onClick={() => {
                                        dispatch({
                                            type: CART_ACTIONS.RESTORE_CART_SNAPSHOT,
                                            cartIndex: index,
                                        })
                                    }}>
                                        Edit
                                    </Button>
                                    <Button onClick={() => {
                                        dispatch({
                                            type: CART_ACTIONS.COPY_CART_SNAPSHOT,
                                            cartIndex: index,
                                        })
                                    }}>
                                        Copy To Cart
                                    </Button>
                                </>}
                                <CartList cart={cart} useAddProduct={false} />
                            </Container>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    </>
    )
}
