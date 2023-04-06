import styles from '@/styles/ui.module.scss'

import { ChangeEvent, ReactElement, SyntheticEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  InputLabel,
  FormGroup,
  FormControlLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Slider,
  SxProps,
  Tooltip,
} from "@mui/material";
import { useDispatch } from 'react-redux';
import {
  setBalanceQueue,
  setClockColor,
  setClockFontFamily,
  setClockFontSize,
  setClockFormat,
  setClockPosition,
  setTimeBetweenVideos,
  setVideoFadeInOutTime,
} from '@/store/settings';
import { ClockPosition, VideoDetails } from '@/types';
import { useFontFamilies } from '@/hooks/useFontFamilies';
import { useSettings } from '@/hooks/useSettings';
import { ColorResult, SketchPicker } from 'react-color'
import rgbHex from "rgb-hex";
import { useVideoData } from '@/hooks/useVideoData';
import { RootDispatch } from '@/store';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Toast } from '@/components/Toast';

const modalSx: SxProps = {
  color: 'black',
  bgcolor: 'background.paper',
  border: '2px solid black',
  boxShadow: 24,
  p: 4,
}

const FileDetailsModal = () => {
  const [open, setOpen] = useState(false);
  const [videoDetails, setVideoDetails] = useState<VideoDetails[]>([])
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    (async () => {
      setVideoDetails((await axios.get('/api/getVideoDetails')).data)
    })()
  }, [])

  return (
    <>
      <Button onClick={handleOpen}>Open File Details</Button>
      <Modal
        className={styles.modal}
        open={open}
        onClose={handleClose}
      >
        <Box
          className={styles.modalBox}
          sx={modalSx}
        >
          {videoDetails.map((videoDetail: VideoDetails) => (
            <Accordion
              key={videoDetail.game}
              expanded={expanded === videoDetail.game}
              onChange={handleChange(videoDetail.game)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  {videoDetail.game}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {videoDetail.files.length} files detected
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {videoDetail.files.map((file: string) => (
                  <Typography overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis' key={file}>
                    {file}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
          <Button onClick={handleClose}>Close file details</Button>
        </Box>
      </Modal>
    </>
  );
}

type UIProps = {
  open: boolean
  onClose?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined
}

export const UI = ({open, onClose}: UIProps): ReactElement => {
  const { data: videoData, resync } = useVideoData()
  const { settings } = useSettings()
  const { fontFamilies } = useFontFamilies()
  const dispatch: RootDispatch = useDispatch();

  const [toastOpen, setToastOpen] = useState(false);

  const handleFileImport = async () => {
    console.log('tbd')
  }

  const handleResyncVideoList = async () => {
    await resync()
    setToastOpen(true)
  } 

  const handleBalanceQueueChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(setBalanceQueue(checked))
  }

  const handleVideoFadeInOutTimeChange = (event: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
    dispatch(setVideoFadeInOutTime(value as number))
  }
 
  const handleTimeBetweenVideosChange = (event: Event, value: number | number[]) => {
    dispatch(setTimeBetweenVideos(value as number))
  }

  const handleClockFormatChange = (event: SelectChangeEvent) => {
    dispatch(setClockFormat(event.target.value as string));
  };
  
  const handleClockFontFamilyChange = (event: SelectChangeEvent) => {
    dispatch(setClockFontFamily(event.target.value as string))
  }

  const handleClockPositionChange = (event: SelectChangeEvent) => {
    dispatch(setClockPosition(event.target.value as ClockPosition))
  }

  const handleClockFontSizeChange = (event: Event, value: number | number[]) => {
    dispatch(setClockFontSize(value as number))
  }
  
  const handleClockColorChange = (color: ColorResult) => {
    dispatch(setClockColor("#" + rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a)))
  }
  
  return (
    <>
      <Modal
        className={styles.modal}
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box
          className={styles.modalBox}
          sx={modalSx}
        >
          <Tooltip title='a new random queue is generated once alls files have been played through'>
            <InputLabel>{videoData.length} videos queued</InputLabel>
          </Tooltip>
          <Button onClick={handleFileImport}>import videos</Button>
          <Button onClick={handleResyncVideoList}>re-sync video list</Button>
          <FileDetailsModal />
          <FormGroup>
            <Tooltip title='allows up to 200 videos per game per queue cycle so that a game with more videos is not over-represented'>
              <FormControlLabel control={<Checkbox checked={settings?.balanceQueue} onChange={handleBalanceQueueChange} />} label="Balance video queue" />
            </Tooltip>
            <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
          </FormGroup>
          <InputLabel>video fade in/out time (ms)</InputLabel>
          <Slider
            defaultValue={200}
            min={0}
            step={50}
            max={1000}
            valueLabelDisplay="auto"
            value={settings?.videoFadeInOutTime}
            onChange={handleVideoFadeInOutTimeChange}
          />
          <InputLabel>time between videos (seconds)</InputLabel>
          <Slider
            defaultValue={3}
            min={0}
            step={1}
            max={60}
            valueLabelDisplay="auto"
            value={settings?.timeBetweenVideos}
            onChange={handleTimeBetweenVideosChange}
          />
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
            style={{ fontFamily: settings?.clockFontFamily}} 
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
      <Toast open={toastOpen} onFinish={() => setToastOpen(false)}>
        <>
          {videoData.length} files detected
        </>
      </Toast>
    </>
  )}