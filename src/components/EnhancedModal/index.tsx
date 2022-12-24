import { useState, useEffect, ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

/**
* Params to send are as follows:
* @isOpen : type<Boolean> : toggles the Modal
* @dialogTitle : type<String> : Title for the modal
* @dialogContent : type<Node/Component> : Component to be displayed as component
* @options : type <Object> : options for component controling
*          @submitButtonName : type<String> : Custom name for the submit button
*          @closeButtonName : type<String> : Custom name for cancel button
*          @disableSubmit : type<Boolean> : disable submit Button
*          @disableClose : type<Boolean> : disable close Button
*          @onClose : type<function> : function to perform onClose
*          @onSubmit : type<function> : function to perfrom onSubmit
*          @swapButtonColors : type<Boolean> : Swap Action Button Colors
*/

interface Props {
    isOpen: boolean;
    dialogTitle: ReactNode | string;
    dialogContent: any;
    options?: {
        submitButtonName?: string;
        closeButtonName?: string;
        disableSubmit?: boolean;
        disableClose?: boolean;
        onClose?: () => void;
        onSubmit?: () => void;
        swapButtonColors?: boolean;
    };
}

export const EnhancedModal = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (props.isOpen) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [props.isOpen]);
    const onClose = () => {
        setIsOpen(false);
        if (props.options !== undefined) {
            if (props.options.onClose !== undefined) {
                return props.options.onClose();
            }
        }
    };
    const onSubmit = () => {
        setIsOpen(false);
        if (props.options !== undefined) {
            if (props.options.onSubmit !== undefined) {
                return props.options.onSubmit();
            }
        }
    };
    let content = (
        <Dialog fullWidth={true} open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.dialogTitle}</DialogTitle>
            <DialogContent>{props.dialogContent}</DialogContent>
            <DialogActions>
                {!(props.options?.disableSubmit) && <Button variant="contained" onClick={onSubmit} color={props.options?.swapButtonColors ? 'secondary' : 'primary'}>{props.options?.submitButtonName ?? 'Submit'}</Button>}
                {!(props.options?.disableClose) && <Button variant="contained" onClick={onClose} color={props.options?.swapButtonColors ? 'primary' : 'secondary'}>{props.options?.closeButtonName ?? 'Cancel'}</Button>}
            </DialogActions>
        </Dialog>
    );
    return content;
};