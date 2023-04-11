## Getting Started

```bash
install git 
git clone https://github.com/davidvanderburgh/pinscreen.git

install node
install yarn

yarn build
yarn start
```


Startup (Windows):
1. press windows key + r
2. type: `shell:startup`
3. put a shortcut to or copy `startup.bat` into this folder
4. go to bios settings during computer startup (press F12, DEL, or whatever your computer requires)
5. look for a setting called 'Power On by RTC Alarm' or something similar
6. set it to turn on at a specified time. Ex: 9AM would be `hour=9`, `minute=0`, `second=0`
7. set computer to shut off at a specified time... TBD 
8. auto-sign-in... TBD

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
