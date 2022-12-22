import { Link as RouterLink } from 'react-router-dom';
import MaterialLink from '@mui/material/Link';

export const Link = (props: any) => {
    return <MaterialLink {...props} component={RouterLink} />;
};