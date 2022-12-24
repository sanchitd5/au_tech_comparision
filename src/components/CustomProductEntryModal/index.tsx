import { Grid, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useEffect, useState } from "react"
import { ProductVendor } from "types"

interface Props {
    onChange: (productName: string, productImage: string, productInfoVendor: ProductVendor, productInfoPrice: string, productInfoDescription: string, productInfoUrl: string) => void;
}

export const CustomProductEntryModalContent = ({ onChange }: Props) => {
    const [productName, setProductName] = useState<string>('');
    const [productImage, setProductImage] = useState<string>('');
    const [productInfoVendor, setProductInfoVendor] = useState<ProductVendor | undefined>();
    const [productInfoPrice, setProductInfoPrice] = useState<string>('');
    const [productInfoDescription, setProductInfoDescription] = useState<string>('');
    const [productInfoUrl, setProductInfoUrl] = useState<string>('');
    useEffect(() => {
        if (productInfoVendor) {
            onChange(productName, productImage, productInfoVendor!, productInfoPrice, productInfoDescription, productInfoUrl);
        }
    }, [productName, productImage, productInfoVendor, productInfoPrice, productInfoDescription, productInfoUrl, onChange,])
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <OutlinedInput fullWidth placeholder='Name' type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <OutlinedInput fullWidth placeholder='Image Url' type="text" value={productImage} onChange={(e) => setProductImage(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <Select fullWidth placeholder="Vendor" defaultValue={ProductVendor.CUSTOM} onChange={
                    (e) => {
                        setProductInfoVendor(ProductVendor[e.target.value as keyof typeof ProductVendor]);
                    }
                }>
                    {
                        Object.keys(ProductVendor).map((vendor) => {
                            return <MenuItem value={vendor}>{vendor}</MenuItem >
                        })
                    }
                </Select>
            </Grid>
            <Grid item xs={12}>
                <OutlinedInput fullWidth placeholder='Price' type="text" value={productInfoPrice} onChange={(e) => setProductInfoPrice(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <OutlinedInput fullWidth placeholder='Description' type="text" value={productInfoDescription} onChange={(e) => setProductInfoDescription(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <OutlinedInput fullWidth placeholder='Url' type="text" value={productInfoUrl} onChange={(e) => setProductInfoUrl(e.target.value)} />
            </Grid>
        </Grid >
    )

}