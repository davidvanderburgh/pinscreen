import { ReactElement, forwardRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type ToastProps = {
  open: boolean,
  onFinish: () => void,
  children: JSX.Element,
}

export const Toast = ({ open, onFinish, children}: ToastProps) => {
  
  const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
  
    onFinish();
  };
  
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleToastClose}>
      <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  )
}