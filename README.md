# IPMI apps
Apps built for the IPMI system.

This repository contains all the available applications for the Interactive Projection Mapping Installation system. 
These can be used within the system or as examples for new applications. 

Within Wirelab you can connect to our TSPS server on  `192.168.1.241`, port is `7681`. Be sure to read the [FAQ](Example%20Application/FAQ.md) that can be found in the [Example Application](Example%20Application). Also checkout the code that is posted in there as it can *really* help you get started!

```
var tsps = new TSPS.Connection('192.168.1.241', '7681');
tsps.connect();
```
_Code snippet of how to connect with our TSPS, for more information see the FAQ_

---

## Example Application
This application is an empty shell that contains all the functions you can use within the IPMI system. It also contains a small guide to get you started.

## Lifting Tiles
This is a small application which flips tiles when you walk over them revealing images of certain companies.

## Lifting Tiles - GOG
This application contains an edited version of Lifting Tiles as screen one. All the images have been replaced with the GOG image.

## Enschede - Fietsenstalling
This application contains an edited version of Lifting Tiles as screen one and a video for the bicycle storage at Willem Wilminkplein.

## Grolsch Catapult
This is a two screen application which shows a catapult on screen one and Grolsch bottles with monsters on screen two. 

## Happy Italy
This is a application which shows a plate for Happy Italy which shows a meatball that follows you when you walk over the plate.

## Painting
This application will draw lines based on where the person is currently walking.

## Pokemon - Smash Them All
Our most advanced application as of right now. It shows Digletts on screen one which you can smash. Highscore and a screensaver video is shown on screen two.
