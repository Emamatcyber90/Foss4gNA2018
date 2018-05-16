# Foss4gNA2018
## Presentaton code for 2018 FOSS 4G NA 
### What makes a map terrible?

## Build
* `npm install`
* `npm watch-css`
* `npm start`

If you get errors about node-gpy check the steps here
https://github.com/boundlessgeo/sdk/blob/master/DEVELOPING.md


### Script
INTRO
Hi We are Willie Nordmann and Jeremy Mulenex.  
We work at Boundless here in st. Louis.  
We have been working together for over 4 years build web based mapping applications
Willie is primarily a Javascript developer
Jeremy is a UI/UX Engineer.
Today we are going to discuss some of our experiences build web maps, what we and learned and pit falls maybe you can avoid
We are using a web site instead of a Power Point slide deck, all of these maps are built using Boundless SDK, a react / redux implementation of OpenLayers
SDK
Boundless SDK is a React / Redux web mapping library we created at Boundless.  SDK useds openlayers and delivers a state manager and react components around openlayers to help speed up development time

UI/UX

This talk isn’t about the technology it’s so much about the technology is about the usability decision that we get to make.  
As a contractor we are often given direction on what the map should represent, what data to use and maybe what basemap to use.  As a developer I get to determine the usability of the map.
We want to talk about the Human interaction, the user experience the overall usability of the map.
You need to think about who your user is, is your user a GIS expert working on a high end desktop that attends a conference like this or is your user a general public user that works off a 3 year old smart phone.  A first responder with limited data access trying to map a disaster or forward deployed soldier working off a custom network mapping IEDs.  
Every user has different skills and access levels, consider your user, they matter. 
ZOOM
Simple first map
Here is our first example map, it shows a base map, it pans, left, it pans right and it zooms in.  Who can spot a usibility problem with this map?  I have a few giveaways to anyone that can help point out the problem with the map or offer a solution
Problem - Zoom buttons

MAP With ZOOM
I was told by a developer on a project that my map didn’t work on a laptop, after some investigation I realized he disable most function on his touchpad and couldn’t scroll out.  

What is going on here?
2 - Next map, we have some data loaded in, who wants to guess the problem this time?
No legend
No Layer List
No Labels
Colors tell nothing
Add in a layer list and a legend isn’t always required.  Legends can be tricky because you can have a lot or a little info to relay with each layer.  A layer list can help, and allows for reordering, are hiding and maybe restyling.  
Coffee Shops Near….
3 - A newish map, what's wrong this time
Stupid huge icons, blocking the data
Ugly Color
Non-descriptive shape


St. Louis and Tax Districts
Popups
Look these popups are useful… unless they overlap or don't close automatically. You can however move the popup content to another space on the page that is static. It makes for a predictable experience with selecting content. 
Problem
Overlap
Content can become hidden
Unpredictable behavior

