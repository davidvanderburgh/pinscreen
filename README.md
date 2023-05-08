## Getting Started

```bash
install git 
git clone https://github.com/davidvanderburgh/pinscreen.git

install node
install yarn

yarn build
yarn start
```

Adding video files:
* Video files go in the `public/videos` folder and should be organized by game folder OR if you edit the `.env` file (follow directions there), you can have them on a thumb drive or any other directory that your computer can see
** Example: 
public
|-videos
  |-Elvira House of Horrors
    |-video file A
    |-video file B
    |-...
  |-TMNT
    |-video file X
    |-video file Y
    |-...
*  After adding video files, a fresh `yarn start` should refresh the queue. You can check detected files in the on-screen-display under `FILE DETAILS`

Adding fonts:
* download your font in .ttf format
* make a folder with your font name in `styles/fonts/` and put your font there
* edit the `font-definitions.scss` in `styles` to register your font (copy how other fonts are done)

Startup (Windows):
1. press windows key + r
2. type: `shell:startup`
3. put a shortcut to `startup.bat` into the `shell:startup` folder

Optional (if bios supported):
4. go to bios settings during computer startup (press F12, DEL, or whatever your computer requires)
5. look for a setting called 'Power On by RTC Alarm' or something similar
6. set it to turn on at a specified time. Ex: 9AM would be `hour=9`, `minute=0`, `second=0`
7. set computer to shut off at a specified time: https://www.wintips.org/how-to-auto-shutdown-windows-10-11-schedule-automatic-shutdown/

8. auto-sign-in: https://learn.microsoft.com/en-us/sysinternals/downloads/autologon

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
