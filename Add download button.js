Array.prototype.indexOf = function (variable) {
	for (i = 0; i < this.length; i++) {
		if (this[i] == variable) return i;
	}
	return -1;
}
Array.prototype.contains = function (variable) {
	if (this.indexOf(variable) == -1) {
		return false;
	} else {
		return true;
	}
}
// get the HTML source of the video page for later use
var htmlSource = document.getElementsByTagName("html")[0].innerHTML;
// determine if page is using HTML5 beta
var htmlFive = false;
if (htmlSource.search("html5-player") != -1) htmlFive = true;
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
// get video title, URL-encode it
var encodedTitle = parent.document.getElementById('eow-title').title;
if (!htmlFive) {
	// get the URL map for the formats
	formatURLMap = htmlSource.split('PLAYER_CONFIG')[1];
	// replace HTML encodings
	formatURLMap = unescape(formatURLMap);
	formatURLMap = formatURLMap.replace(/%2C/g, ",");
	formatURLMap = formatURLMap.replace(/%3A/g, ":");
	formatURLMap = formatURLMap.split("quality=");


	var formats = new Array();
	for(var i = 0; i < formatURLMap.length-1; i++) {
		//check to see if format contains the url tag
		if(formatURLMap[i].indexOf("url=")) {
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

		formatString=formats[i][0].toString();
		if (formatDescriptions[formats[i][0]][2]) {
			var hoverTitle = "Download as " + formatDescription + " (" + formatDescriptions[formats[i][0]][2] + ")";
		} else {
			var hoverTitle = "Download as " + formatDescription;
		}
		// add link to downloadsString
		downloadString += '<a href="' + videoURL + '" title="' + hoverTitle + '">' + formatDescription + '</a>, ';
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
	
} else {
/*
	// isolate the HTML5 player script and get its source
	var scripts = document.getElementsByTagName("script");
	var scriptSource = scripts[scripts.length - 4].innerHTML;
	// find where format function is, split into parts
	var formats = scriptSource.split('videoPlayer.setAvailableFormat("');
	// remove first piece, doesn't relate to formats
	formats.splice(0, 1);
	if (formats.length > 1) {
		var downloadString = "Downloads: ";
	} else {
		var downloadString = "Download: ";
	}
	// clean up formats
	for (var i = 0; i < formats.length; i++) {
		formats[i] = formats[i].split('");')[0];
		formats[i] = formats[i].split('", "');
	}
	// sort them
	formats.sort(formatSorterHTMLFive);
	// add them to the download string
	for (var i = 0; i < formats.length; i++) {
		var videoURL = formats[i][0] + "&title=" + encodedTitle;
		if (formats[i][3] in formatDescriptions) {
			var formatDescription = formatDescriptions[formats[i][3]][1];
		} else {
			var formatDescription = "Unknown format";
		}
		// add specific format specification, if available/needed
		if (formatDescriptions[formats[i][3]][2]) {
			var hoverTitle = "Download as " + formatDescription + " (" + formatDescriptions[formats[i][3]][2] + ") by Option-clicking";
		} else {
			var hoverTitle = "Download as " + formatDescription + " by Option-clicking";
		}
		downloadString += '<a href="' + videoURL + '" title="' + hoverTitle + '">' + formatDescription + '</a>, ';
	}
	downloadString = downloadString.substring(0, downloadString.length-2);
*/	
}

// defines the displayDownloadLinks() function

var downloadFunction = document.createElement("script");
downloadFunction.type = "text/javascript";
downloadFunction.textContent = "function displayDownloadLinks () { "
	+ "var divVisibility = document.getElementById('downloadDiv').style.display;"
	+ "if (divVisibility == 'none') { "
		+ "document.getElementById('downloadDiv').style.display = 'block'; "
		+ "document.getElementById('downloadVideoButton').innerHTML = '<span class=\"yt-uix-button-content\">Hide Download Links</span>'; "
	+ "} else { "
		+ "document.getElementById('downloadDiv').style.display = 'none'; "
		+ "document.getElementById('downloadVideoButton').innerHTML = '<span class=\"yt-uix-button-content\">Download Video</span>'; "
	+ "} "
+ "}";
document.getElementsByTagName("head")[0].appendChild(downloadFunction);
// create the Download button
var downloadButton = document.createElement("button");
downloadButton.type = "button";
downloadButton.setAttribute("class", "yt-uix-button yt-uix-tooltip");
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
	downloadDiv.style.marginBottom = "8px";
	downloadDiv.style.padding = "4px";
}
downloadDiv.style.display = "none";
window.onload=function() {
	downloadDivInt=setInterval(function() {
		if(jQuery('.subscription-container').length>0){
			jQuery(downloadButton).insertAfter('.subscription-container');
			clearInterval(downloadDivInt);
		}
	}, 500);
	
	downloadButInt=setInterval(function() {
		if(jQuery('#watch-headline-user-info').length>0){
			jQuery(downloadDiv).insertAfter('#watch-headline-user-info');
			clearInterval(downloadButInt);
		}
	}, 500);
};




























