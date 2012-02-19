Array.prototype.arrayIndex = function (variable) {
	for (i = 0; i < this.length; i++) {
		if (this[i] == variable) return i;
	}
	return -1;
}

function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}
String.prototype.contains = function (variable) {
	if (this.indexOf(variable) == -1) {
		return false;
	} else {
		return true;
	}
}
// get the HTML source of the video page for later use
var htmlSource = document.getElementsByTagName("html")[0].innerHTML;

// set array of format descriptions
var formatDescriptions = new Array();
formatDescriptions['5'] = [10, "Low quality FLV", "240p"];
formatDescriptions['36'] = [9, "Low quality MP4", "240p"];
formatDescriptions['43'] = [8, "Standard WebM", "360p"];
formatDescriptions['34'] = [7, "Standard FLV", "360p"];
formatDescriptions['18'] = [6, "Standard MP4", "360p"];
formatDescriptions['35'] = [5, "Large FLV", "480p"];
formatDescriptions['44'] = [4, "Large WebM", "480p"];
formatDescriptions['45'] = [3, "HD WebM (720p)", '720p'];
formatDescriptions['22'] = [2, "HD MP4 (720p)", '720p'];
formatDescriptions['37'] = [1, "Full HD MP4 (1080p)", '1080p'];
var not_allowed=new Array('46');

// get video title, URL-encode it
var encodedTitle = parent.document.getElementById('eow-title').title;
	// get the URL map for the formats
	formatURLMap = htmlSource.split('playerConfig')[1];
	// replace HTML encodings
	formatURLMap = unescape(formatURLMap);
	formatURLMap = formatURLMap.replace(/%2C/g, ",");
	formatURLMap = formatURLMap.replace(/%3A/g, ":");
	formatURLMap = formatURLMap.split("quality=");

	var formats = new Array();
	for(var i = 0; i < formatURLMap.length-1; i++) {
		//check to see if format contains the url tag
		if(formatURLMap[i].contains("url=")) {
			url=formatURLMap[i].split("url=")[1].split('\\')[0];

			quality=url.split("itag=")[1].split('&ip')[0];
			formats.push([quality, url + "&title=" + encodedTitle]);		
		}
	}
	
	// make base download string (see below)
	if (formats > 1) {
		var downloadString = "Downloads: ";
	} else {
		var downloadString = "Download: ";
	}
	// add other formats to array
	for (var i = 0; i < formats.length; i++) {
		var videoURL = formats[i][1];
		if (formats[i][0] in formatDescriptions) {
			var formatDescription = formatDescriptions[formats[i][0]][1];
		} else {
			var formatDescription = "Unknown format";
		}
		// add specific format specification, if available/needed


		if(!include(not_allowed, formats[i][0])) {
			if (formatDescriptions[formats[i][0]][2]) {
				var hoverTitle = "Download as " + formatDescription + " (" + formatDescriptions[formats[i][0]][2] + ")";
			} else {
				var hoverTitle = "Download as " + formatDescription;
			}
			// add link to downloadsString
			downloadString += '<a href="' + videoURL + '" title="' + hoverTitle + '">' + formatDescription + '</a>, ';
		}
	}
	downloadString = downloadString.substring(0, downloadString.length-2);
	// see if Standard MP4 should exist, if so, add link to page
	/*if (formatNumbers.contains("34") && !formatNumbers.contains("18") && document.URL.search("&fmt=18") == -1) {
		var extraDownloadsString = 'Standard MP4 format available <a href="' + document.URL + '&fmt=18">here</a>.'
	}*/
	// if &fmt=18 is there, show link to remove it
	if (document.URL.search("&fmt=18") != -1) {
		var extraDownloadsString = 'Higher resolution formats may be available <a href="' + document.URL.substring(0, document.URL.search("&fmt=18")) + document.URL.substring(document.URL.search("&fmt=18") + 7) + '">here</a>.';
	}

// defines the displayDownloadLinks() function

var downloadFunction = document.createElement("script");
downloadFunction.type = "text/javascript";
downloadFunction.textContent = "function displayDownloadLinks () { "
	+ "var divVisibility = document.getElementById('downloadDiv').style.display;"
	+ "if (divVisibility == 'none') { "
		+ "document.getElementById('downloadDiv').style.display = 'block'; "
		+ "document.getElementById('watch-headline-user-info').style.overflow = 'visible'; "
		+ "document.getElementById('watch-video-container').style.marginTop = '20px'; "
		+ "document.getElementById('downloadVideoButton').innerHTML = '<span class=\"yt-uix-button-content\">Hide Download Links</span>'; "
	+ "} else { "
		+ "document.getElementById('downloadDiv').style.display = 'none'; "
		+ "document.getElementById('watch-headline-user-info').style.overflow = 'hidden'; "
		+ "document.getElementById('watch-video-container').style.marginTop = '0px'; "
		+ "document.getElementById('downloadVideoButton').innerHTML = '<span class=\"yt-uix-button-content\">Download Video</span>'; "
	+ "} "
+ "}";
document.getElementsByTagName("head")[0].appendChild(downloadFunction);
// create the Download button
var downloadButton = document.createElement("button");
downloadButton.type = "button";
downloadButton.setAttribute("class", "start yt-uix-button yt-uix-button-default yt-uix-tooltip");
downloadButton.setAttribute("onclick", "displayDownloadLinks()");
downloadButton.setAttribute("title", "Click to view available file downloads");
downloadButton.setAttribute("data-tooltip-text", "Click to view available file downloads");
downloadButton.id = "downloadVideoButton";
downloadButton.innerHTML = '<span class="yt-uix-button-content">Download Video</span>';
// adds the links and some instructions to a DIV, adds the DIV to the YouTube page
var downloadDiv = document.createElement("div");
downloadDiv.id = "downloadDiv";
var finalDownloadString = "<p><strong>" + downloadString + "</strong></p>\n";
if (extraDownloadsString) finalDownloadString += "<p><em>" + extraDownloadsString + "</em></p>\n";
/* finalDownloadString += "<p>Option-click on a link to download the video in that format.</p>"; */
downloadDiv.innerHTML = finalDownloadString;
downloadDiv.style.marginBottom = "4px";
// if it's Vevo, give it a white background so it's more visible
if (htmlSource.search("vevo") != -1) {
	downloadDiv.style.backgroundColor = "#FFFFFF";
	downloadDiv.style.marginBottom = "10px";
	downloadDiv.style.padding = "4px";
}
downloadDiv.style.display = "none";
window.onload=function() {
	downloadDivInt=setInterval(function() {
		if(jQuery('#watch-headline-user-info').length>0){
			jQuery('#watch-headline-user-info').append(downloadButton);
			clearInterval(downloadDivInt);
		}
	}, 500);
	
	downloadButInt=setInterval(function() {
		if(jQuery('#watch-headline-user-info').length>0){
			jQuery(downloadDiv).insertAfter('#downloadVideoButton');
			clearInterval(downloadButInt);
		}
	}, 500);
};




























