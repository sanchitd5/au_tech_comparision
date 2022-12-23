import { CircularProgress, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        width: '100%'
    },
    loadingCircle: {

    },
    loadingText: {

    }
}));

interface Props {
    loadingText?: string;
}

export const LoadingCircle = (props: Props) => {
    let classes = useStyles();
    return (<Grid style={{
        height: '100vh',
        width: '100%',
        margin: 'auto auto'
    }} container spacing={0} direction={'column'} justifyContent="center" alignItems="center" className={classes.root}>
        < Grid item className={classes.loadingCircle}>
            <CircularProgress disableShrink />
        </Grid>
        {props.loadingText !== undefined ?
            < Grid item className={classes.loadingText}>
                <Typography variant="body1">
                    {props.loadingText}
                </Typography>
            </ Grid> : null}
    </Grid >);
};