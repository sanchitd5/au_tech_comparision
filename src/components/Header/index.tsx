
import Container from '@mui/material/Container';
import { useState } from "react";
import { useSelector } from 'react-redux';
import ReduxInitialStoreState from 'store/baseStore';
import { AppBar, Badge, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DifferenceIcon from '@mui/icons-material/Difference';
import { EnhancedModal } from 'components/EnhancedModal';
import { CartComponent, CompareCartModelContent } from 'components/Cart';

export const Header = () => {
    const cartState = useSelector((state: ReduxInitialStoreState) => state.cart ?? { cart: { totalItems: 0 } });
    const [cartOpen, setCartOpen] = useState<boolean>(false);
    const [compartOpen, setCompareOpen] = useState<boolean>(false);
    const toggleCart = () => setCartOpen(!cartOpen);
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
                    <Box >
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="open cart"
                            sx={{ mr: 2 }}
                            onClick={() => toggleCart()}
                        >
                            <Badge badgeContent={cartState.cart.totalItems} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                    {!!cartState.prevCartSnapshots.length && <Box >
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="compare carts"
                            sx={{ mr: 2, }}
                            disabled={!cartState.prevCartSnapshots.length}
                            onClick={() => setCompareOpen(true)}
                        >
                            <Badge badgeContent={cartState.prevCartSnapshots.length} color="secondary">
                                <DifferenceIcon />
                            </Badge>
                        </IconButton>
                    </Box>}
                    <Drawer
                        anchor={'right'}
                        open={cartOpen}
                        onClose={() => toggleCart()}
                    >
                        <CartComponent cartState={cartState} toggleCart={toggleCart} />
                    </Drawer>
                </Toolbar>
            </Container>
            <EnhancedModal dialogTitle='Compare Carts' dialogContent={<CompareCartModelContent />} isOpen={compartOpen} options={{
                disableSubmit: true,
                onClose() {
                    setCompareOpen(false);
                },
            }} />
        </AppBar >
    );
}