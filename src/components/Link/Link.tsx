import { Link as MaterialLink } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

interface Props {
    to: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export const Link = (props: Props) => {
    return (<MaterialLink
        to={props.to}
        className={props.className}
        style={props.style}
        component={RouterLink} >
        {props.children}
    </MaterialLink>);
};