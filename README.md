CircleGalleryJS
===================

### Description
Dynamically creates responsive round image galleries. Each image can open a specific link and may be added at runtime.

![Screenshot](https://raw.githubusercontent.com/Steppschuh/CircleGalleryJS/master/images/screenshot_1.jpg "CircleGalleryJS Demo")

### Usage
First of all, create a new circle object:
```javascript
var projectsCircle = createCircle("Projects", "http://sample.com/projects/");
```
Now add a number of links to the circle:
```javascript
var sampleLink = createLink("/images/sample.jpg", "http://sample.com");
addLinkToCircle(sampleLink, projectsCircle);
// more links...
```
Finally render the circle object in a container div:
```javascript
var container = document.getElementById("circleContainer");
showCircleInContainer(projectsCircle, container);
```
That's it. If you want the circles to resize themselves, add this to the `window.onresize` event:
```javascript
window.onresize = function() {
  requestCirclesUpdate();
}
```
