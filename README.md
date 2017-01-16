# Quadcopter

Prerequisite:

$ sudo apt-get install npm

to install npm

$ npm install sleep-async

to install sleep-async

$ sudo apt-get install python-software-properties

$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

$ sudo apt-get install nodejs

to install nodejs

Run plotter in the Plotter folder

$ node ucla_plotter.js 8 9 100 
this would run plotter with the first flight path having 8 waypoints,
the second flight path having 9 waypoints,
and an attack circle radius of 100meters

### node ucla_plotter.js (maximum waypoints for first file) (maximum waypoints for second file)  (attack circle radius (meters)) 

in the fourth and fifth lines, change ORIGINAL_FP_PATH and FIX_FP_PATH to the paths of your two files

then open a browser ( Chrome, Firefox ) and type **127.0.0.1:8070** in the address bar.
