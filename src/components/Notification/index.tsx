import { useCallback, useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';

let triggerNotification: Function = () => { };

interface Props {
    horizontal?: 'left' | 'right';
    vertical?: 'top' | 'bottom';

}

/***
 *  Notification is a component which needs to be places in Global App.js or alongside the Routes
 *  DisplayBrowserNotification triggers browser notification
 *  notify() is a helper function to trigger Notification Component
 *  @param notify -  params are message, callback, variant
 ***/
const NotificationComponent = (props: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [verticalPosition, setVerticalPosition] = useState<'top' | 'bottom'>('bottom');
    const [horizontalPosition, setHorizonPosition] = useState<'left' | 'right'>('right');

    const openNotification = useCallback((newMessage: string) => {
        setOpen(true);
        setMessage(newMessage);
    }, []);
    const closeNotification = useCallback(() => {
        setOpen(false);
        setMessage('');
    }, []);
    useEffect(() => {
        triggerNotification = openNotification;
    }, [openNotification]);
    useEffect(() => {
        if (props.horizontal !== undefined) {
            setHorizonPosition(props.horizontal);
        }
        if (props.vertical !== undefined) {
            setVerticalPosition(props.vertical);
        }
    }, [props]);
    const messageSpan = (<span id="snackbar-message-id" dangerouslySetInnerHTML={{ __html: message }} />);
    const content = (
        <Snackbar
            anchorOrigin={{ vertical: verticalPosition, horizontal: horizontalPosition }}
            message={messageSpan}
            autoHideDuration={3000}
            onClose={closeNotification}
            open={open}
            ContentProps={{
                'aria-describedby': 'snackbar-message-id',
            }}
        />
    );
    if (message === undefined) return null;
    if (message === '') return null;
    return content;
};

export const triggerBrowserNotification = (message: string) => {
    if (!('Notification' in window)) {
        alert(message);
    }
    else if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        new Notification(message);
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    }
};

export const notify = (message: string, variant: 'browser' | 'inapp' | 'both', callback?: Function) => {
    if (variant === 'browser')
        triggerBrowserNotification(message);
    else if (variant === 'both') {
        triggerNotification(message);
        triggerBrowserNotification(message);
    } else {
        triggerNotification(message);
    }
    if (callback) {
        callback();
    }
};


export default NotificationComponent;