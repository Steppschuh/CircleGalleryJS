
var circleTitlePosition = 0.9; // show the title div at X % of the circle
var circlePadding = 10;
var linkOpacityNormal = 0.7;
var linkOpacityActive = 1;
var nameOpacityNormal = 0.6;
var nameOpacityActive = 0.8;
var randomizeLinks = true;

var circles = new Array();
var lastUpdate = 0;

function getCircleByName(name) {
	for (var i = 0; i < circles.length; i++) {
		if (circles[i].name == name) {
			return circles[i];
		}
	}
	return null;
}

function createCircle(name, destinationUrl) {
	var circle = new Object();
	circle.name = name;
	circle.url = destinationUrl;
	circle.links = new Array();
	return circle;
}

function showCircleInContainer(circle, containerDiv) {
	containerDiv.appendChild(getCircleDOM(circle, containerDiv));
	if (getCircleByName(circle.name) == null) {
		circles.push(circle);
	}
	updateCircleDivs();
}

function getCircleDOM(circle, containerDiv) {
	// this will return the complete DOM for a given circle object

	// create container & wrapper
	var containerWidth = containerDiv.offsetWidth;
	var containerHeight = containerDiv.offsetHeight;
	var circleDiameter = Math.min(containerWidth, containerHeight) - (2 * circlePadding);

	var circleContainer = document.createElement("div");
	circleContainer.id = "circle_" + circle.name;
	circleContainer.className = "circle";

	var circleCenterWrapper = document.createElement("div");
	circleCenterWrapper.className = "circleCenterWrapper";
	circleCenterWrapper.style.width = circleDiameter + "px";
	circleCenterWrapper.style.height = circleDiameter + "px";
	circleCenterWrapper.style.borderRadius =  (circleDiameter / 2) + "px";
	circleCenterWrapper.style.marginLeft =  (0 - (circleDiameter / 2)) + "px";
	circleCenterWrapper.style.marginTop =  (0 - (circleDiameter / 2)) + "px";

	var circleCenter = document.createElement("div");
	circleCenter.className = "circleCenter";
	circleCenter.style.borderRadius =  (circleDiameter / 2) + "px";

	// create name div
	var circleNameContainer = document.createElement("div");
	circleNameContainer.className = "circleNameContainer";
	circleNameContainer.style.bottom = ((1 - circleTitlePosition) * circleDiameter) - (circleNameContainer.offsetHeight / 2) + "px";
	circleNameContainer.style.backgroundColor = "rgba(0,0,0," + nameOpacityNormal + ")";

	circleNameContainer.onclick = function() {
		openLinkUrl(circle.url);
	};
	circleNameContainer.onmouseover = function() {
		this.style.backgroundColor = "rgba(0,0,0," + nameOpacityActive + ")";
	};

	circleNameContainer.onmouseout = function() {
		this.style.backgroundColor = "rgba(0,0,0," + nameOpacityNormal + ")";
	};

	var circleNameValue = document.createElement("div");
	circleNameValue.className = "circleNameValue";
	circleNameValue.innerHTML = circle.name;

	circleNameContainer.appendChild(circleNameValue);
	

	// create link container
	var circleLinksContainer = document.createElement("div");
	circleLinksContainer.className = "circleLinksContainer";

	// add links to the link container
	// calculate number of rows & cols
	var currentLinkIndex = 0;
	var linkRows = Math.floor(circle.links.length / 2);
	var linkCollumns = Math.floor(circle.links.length / linkRows);
	var rowHeight = circleDiameter / linkRows;

	// add rows to the container
	for (var rowIndex = 0; rowIndex < linkRows; rowIndex++) {
		var linkRow = document.createElement("div");
		linkRow.className = "linkRow";
		linkRow.style.top = (rowIndex * rowHeight) + "px";
		linkRow.style.height = rowHeight + "px";

		var linkRowCollumns;
		if (rowIndex < linkRows - 1) {
			linkRowCollumns = linkCollumns;
			if (randomizeLinks) {
				if (randomBoolean() && (circle.links.length - currentLinkIndex) > linkRowCollumns + 1) {
					// show one more link
					linkRowCollumns++;
				} else if (randomBoolean() && linkRowCollumns > 1) {
					// show one less link
					linkRowCollumns--;
				}
			}
		} else {
			// this is the last row, add all left over links
			linkRowCollumns = circle.links.length - currentLinkIndex;
		}
		
		var colWidth = circleDiameter / linkRowCollumns;

		// add collumns for this row
		for (var colIndex = 0; colIndex < linkRowCollumns; colIndex++) {
			var currentLink = circle.links[currentLinkIndex];

			var linkCol = document.createElement("div");
			linkCol.className = "linkCol";
			linkCol.style.left = (colIndex * colWidth) + "px"
			linkCol.style.width = colWidth + "px"
			linkCol.style.opacity = linkOpacityNormal;
			linkCol.style.backgroundImage = "url('" + currentLink.imageSrc + "')";
			
			linkCol.onclick = function() {
				openLinkUrl(currentLink.destinationUrl);
			};

			linkCol.onmouseover = function() {
				this.style.opacity = linkOpacityActive;
			};

			linkCol.onmouseout = function() {
				this.style.opacity = linkOpacityNormal;
			};

			linkRow.appendChild(linkCol);

			currentLinkIndex++;
		}

		circleLinksContainer.appendChild(linkRow);
	}

	circleCenter.appendChild(circleLinksContainer);
	circleCenter.appendChild(circleNameContainer);

	circleCenterWrapper.appendChild(circleCenter);
	circleContainer.appendChild(circleCenterWrapper);
	return circleContainer;
}

function createLink(imageSrc, destinationUrl) {
	var link = new Object();
	link.imageSrc = imageSrc;
	link.destinationUrl = destinationUrl;
	return link;
}

function addLinkToCircle(link, circle) {
	circle.links.push(link)
}

function openLinkUrl(destinationUrl) {
	top.location = destinationUrl;
}

function requestCirclesUpdate() {
	setTimeout(function() {
		var now = (new Date()).getTime();
		if (lastUpdate + 250 > now) {
			return;			
		}

		updateCircleDivs();
	}, 250);
}

function updateCircleDivs() {
	var circleDivs = document.getElementsByClassName("circle");
	if (circleDivs.length == 0) {
		return;
	}
	
	lastUpdate = (new Date()).getTime();

	for (var i = 0; i < circleDivs.length; i++) {
		updateCircleDiv(circleDivs[i])
	};
}

function updateCircleDiv(circleDiv) {
	var name = circleDiv.id.replace("circle_", "");
	var circle = getCircleByName(name);
	if (circle == null) {
		console.log("Unable to update circle: " + name);
		return;
	}

	var containerDiv = circleDiv.parentElement;
	containerDiv.innerHTML = "";
	containerDiv.appendChild(getCircleDOM(circle, containerDiv));
}

function randomBoolean() {
	return (Math.random() < 0.5);
}