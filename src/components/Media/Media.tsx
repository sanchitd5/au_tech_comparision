import React, { FunctionComponent } from 'react'; 
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
    responsiveImage: {
        height: 'auto',
        maxWidth: '100%'
    }
}));

export const Image: FunctionComponent<ImageComponentModel> = (props) => {
    const classes = useStyles();
    return (<img style={props.style !== undefined ? props.style instanceof Object ? props.style : {} : {}} className={classes.responsiveImage} src={props.src} alt={props.alt !== undefined ? props.alt : String(props.src)} />);
};

interface ImageComponentModel {
    style?: React.CSSProperties; src?: string; alt?: string
}