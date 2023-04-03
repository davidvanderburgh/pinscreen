import { Dispatch, ReactElement } from 'react';
import { Box, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Slider } from "@mui/material";
import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { setSettings } from '@/store/settings';
import { ClockPosition, Settings } from '@/types';
import { useFontFamilies } from '@/hooks/useFontFamilies';
import { useSettings } from '@/hooks/useSettings';
import { ColorChangeHandler, ColorResult, SketchPicker, SketchPickerProps } from 'react-color'
import rgbHex from "rgb-hex";

type UIProps = {
  open: boolean
  onClose?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined
}

export const UI = ({open, onClose}: UIProps): ReactElement => {
  const { settings } = useSettings()
  const { fontFamilies } = useFontFamilies()
  const dispatch: Dispatch<AnyAction> = useDispatch();

  const handleClockFormatChange = (event: SelectChangeEvent) => {
    dispatch(setSettings({ clockFormat: event.target.value as string }));
  };
  
  const handleClockFontFamilyChange = (event: SelectChangeEvent) => {
    dispatch(setSettings({ clockFontFamily: event.target.value as string }))
  }

  const handleClockPositionChange = (event: SelectChangeEvent) => {
    dispatch(setSettings({ clockPosition: event.target.value as ClockPosition }))
  }

  const handleClockFontSizeChange = (event: Event, value: number | number[]) => {
    dispatch(setSettings({ clockFontSize: value as number }))
  }
  
  const handleClockColorChange = (color: ColorResult) => {
    dispatch(setSettings({ clockColor: "#" + rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a) }))
  }
  
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <InputLabel>clock format</InputLabel>
          <Select
            value={settings?.clockFormat}
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
            value={settings?.clockFontFamily}
            onChange={handleClockFontFamilyChange}
          >
            {fontFamilies.map((fontFamily: string) => (
              <MenuItem key={fontFamily} value={fontFamily} style={{fontSize: '3rem', fontFamily}}>
                {fontFamily} 08:06:48pm
              </MenuItem>
            ))
            }
          </Select>
          <InputLabel>clock position</InputLabel>
          <Select
            value={settings?.clockPosition}
            onChange={handleClockPositionChange}
          >
            <MenuItem value={'center'}>center</MenuItem>
            <MenuItem value={'top'}>top</MenuItem>
            <MenuItem value={'bottom'}>bottom</MenuItem>
          </Select>
          <InputLabel>clock size</InputLabel>
          <Slider
            defaultValue={25}
            min={1}
            max={50}
            valueLabelDisplay="auto"
            value={settings?.clockFontSize}
            onChange={handleClockFontSizeChange}
          />
          <InputLabel>clock color and opacity</InputLabel>     
          <SketchPicker
            color={settings?.clockColor}
            onChange={handleClockColorChange}
          />
        </Box>
      </Modal>
    </>
  )}