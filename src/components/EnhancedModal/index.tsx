import { useState, useEffect } from 'react';
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
    dialogTitle: string;
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
    const [_DialogTitle, _setDialogTitle] = useState('');
    const [_DialogContent, _setDialogContent] = useState('');
    const [submitButtonName, setSubmitButtonName] = useState('Submit');
    const [cancelButtonName, setCancelButtonName] = useState('Close');
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [disableClose, setDisableClose] = useState(false);
    const [swapButtonColors, setSwapButtonColors] = useState(false);
    useEffect(() => {
        if (props.isOpen) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [props.isOpen]);
    useEffect(() => {
        if (props.dialogTitle)
            _setDialogTitle(props.dialogTitle);
        if (props.dialogContent)
            _setDialogContent(props.dialogContent);
        if (props.options) {
            if (props.options.submitButtonName)
                setSubmitButtonName(props.options.submitButtonName);
            if (props.options.closeButtonName)
                setCancelButtonName(props.options.closeButtonName);
            if (props.options.disableSubmit)
                setDisableSubmit(true);
            if (props.options.disableClose)
                setDisableClose(true);
            if (props.options.swapButtonColors)
                setSwapButtonColors(props.options.swapButtonColors);
        }
    }, [props]);
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
        <Dialog fullWidth={true} open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title"  >
            <DialogTitle id="form-dialog-title">{_DialogTitle}</DialogTitle>
            <DialogContent>{_DialogContent}</DialogContent>
            <DialogActions>
                {disableSubmit !== true && <Button variant="contained" onClick={onSubmit} color={swapButtonColors ? 'secondary' : 'primary'}>{submitButtonName}</Button>}
                {disableClose !== true && <Button variant="contained" onClick={onClose} color={swapButtonColors ? 'primary' : 'secondary'}>{cancelButtonName}</Button>}
            </DialogActions>
        </Dialog>
    );
    return content;
};