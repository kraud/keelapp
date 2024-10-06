import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {useTranslation} from "react-i18next";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal = (props: ConfirmationDialogProps) => {
    const { t } = useTranslation(['common'])
    const {open, title, message, onClose, onConfirm} = props;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('buttons.cancel', {ns: 'common'})}
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    {t('buttons.confirm', {ns: 'common'})}
                </Button>
            </DialogActions>
        </Dialog>
    );
}