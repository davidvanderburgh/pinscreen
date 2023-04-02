import { Dispatch, ReactElement, useEffect, useState } from 'react';
import { Box, InputLabel, MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { setSettings } from '@/store/settings';
import { RooteState } from '@/store';
import { Settings } from '@/types';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type UIProps = {
  open: boolean
  onClose?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined
}

export const UI = ({open, onClose}: UIProps): ReactElement => {
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const settings: Settings =
    useSelector((state: RooteState) => state.settings.value);

  const handleClockFormatChange = (event: SelectChangeEvent) => {
    dispatch(setSettings({ clockFormat: event.target.value as string }));
  };
  
  const handleClockFontFamilyChange = (event: SelectChangeEvent) => {
    dispatch(setSettings({ clockFontFamily: event.target.value as string}))
  }

  const handleClockFontSizeChange = (event: SelectChangeEvent) => {
    dispatch(setSettings({ clockFontSize: event.target.value as string}))
  }
  
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <InputLabel>clock format</InputLabel>
          <Select
            value={settings.clockFormat}
            onChange={handleClockFormatChange}
          >
            <MenuItem value={'h:mm'}>h:mm (8:06)</MenuItem>
            <MenuItem value={'h:mm:ss'}>h:mm:ss (8:06:48)</MenuItem>
            <MenuItem value={'h:mm:ssa'}>h:mm:ssa (8:06:48pm)</MenuItem>
            <MenuItem value={'hh:mm'}>hh:mm (08:06)</MenuItem>
            <MenuItem value={'hh:mm:ss'}>hh:mm:ss (08:06:48)</MenuItem>
            <MenuItem value={'hh:mm:ssa'}>hh:mm:ssa (08:06:48pm)</MenuItem>
            <MenuItem value={'HH:mm'}>HH:mm (20:06)</MenuItem>
            <MenuItem value={'HH:mm:ss'}>HH:mm:ss (20:06:48)</MenuItem>
          </Select>
          <InputLabel>clock font</InputLabel>
          <Select
            value={settings.clockFontFamily}
            onChange={handleClockFontFamilyChange}
          >
            {/* todo: get font list dynamically? */}
            {['arcade', 'arcade-alternate'].map((fontFamily: string) => (
              <MenuItem key={fontFamily} value={fontFamily} style={{fontSize: '3rem', fontFamily}}>
                {fontFamily} 08:06:48pm
              </MenuItem>
            ))
            }
          </Select>
          <InputLabel>clock size</InputLabel>
          <Select
            value={settings.clockFontSize}
            onChange={handleClockFontSizeChange}
          >
            {['3rem', '4rem', '5rem', '6rem', '7rem', '8rem', '9rem', '10rem', '11rem', '12rem', '13rem', '14rem', '15rem', '16rem'].map((fontSize: string) => (
              <MenuItem key={fontSize} value={fontSize} style={{fontSize, fontFamily: settings.clockFontFamily}}>
                08:06:48pm
              </MenuItem>
            ))}
          </Select>
          
        </Box>
      </Modal>
    </>
  )}