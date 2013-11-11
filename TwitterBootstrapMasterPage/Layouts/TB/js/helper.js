var EFA = {
    log: [],

    /*
     Prevent backspace being used as back button in infopath form in modal.
     Source: http://johnliu.net/blog/2012/3/27/infopath-disabling-backspace-key-in-browser-form.html
     grab a reference to the modal window object in SharePoint 
     */
    OpenPopUpPage: function( url ){

	var options = SP.UI.$create_DialogOptions();
	options.url = url;
	var w = SP.UI.ModalDialog.showModalDialog(options);
	

	/* Attempt to prevent backspace acting as navigation key on read only input - Doesn't currently work.
	if (w) { 
	    // get the modal window's iFrame element 
	    var f = w.get_frameElement();
	    EFA.f = f;
	    // watch frame's readyState change - when page load is complete, re-attach keydown event 
	    // on the new document        
	    $(f).ready(function(){
		var fwin = this.contentWindow || this.contentDocument;
		$(fwin.document).on('focus',"input[readonly]",function(){ $(this).blur(); });
	    });
	 
	}*/

    },

    // get current user
    checkCurrentUser: function (callback){
	ExecuteOrDelayUntilScriptLoaded(checkCurrentUserLoaded, "sp.js");
	function checkCurrentUserLoaded() {
	    var context = SP.ClientContext.get_current();
	    var siteColl = context.get_site();
	    var web = siteColl.get_rootWeb();
	    this._currentUser = web.get_currentUser(); 
	    context.load(this._currentUser);
	    context.executeQueryAsync(Function.createDelegate(this, callback),Function.createDelegate(this, callback));
	}
    },
    CheckUserSucceeded: function(){
	EFA['User'] = this._currentUser;
    },
    CheckUserfailed: function(){
	//console.log('Failed to get user');
    },
    DoesUserHaveCreatePermissions: function(url, callback) {
	var Xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\
	    <soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\
		<soap:Body>\
		<DoesCurrentUserHavePermissionsToList xmlns=\"http://tempuri.org/\">\
		<url>"+ url  +"</url>\
		</DoesCurrentUserHavePermissionsToList>\
	    </soap:Body>\
	    </soap:Envelope>";
	$.ajax({
	    url: "/_layouts/EFA/EFAWebServices.asmx",
	    type: "POST",
	    dataType: "xml",
	    data: Xml,
	    complete: function(xData, Status){
		if(Status != 'success')
		    throw "Failed to determine user permissions for " + url;
		callback(xData);
	    },
	    contentType: "text/xml; charset=\"utf-8\""
	});
	
    }

};
/*
 To access the mapping need to uses keys, therefore need to check if its available for browser and add it if not.
 Then we can loop through the mapping like so:
 
 $.each(keys(config.mapping), function(){ console.log(config.mapping[this.toString()]) });

 using this to build the query and create the resultant html

 */ 
// SOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function () {
	var hasOwnProperty = Object.prototype.hasOwnProperty,
	    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
	    dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	    ],
	    dontEnumsLength = dontEnums.length;

	return function (obj) {
	    if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

	    var result = [];

	    for (var prop in obj) {
		if (hasOwnProperty.call(obj, prop)) result.push(prop);
	    }

	    if (hasDontEnumBug) {
		for (var i=0; i < dontEnumsLength; i++) {
		    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
		}
	    }
	    return result;
	};
    })();
}
/*
 Array.indexOf for IE
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
*/
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    var n, k, t = Object(this),
        len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}
/*
 Test for Canvas Suppport 
 Source: http://stackoverflow.com/questions/2745432/best-way-to-detect-that-html5-canvas-is-not-supported/2746983#2746983
*/
function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
/*
 Console.log() for IE 8
*/
(function() {
  if (!window.console) {
    window.console = {};
  }
  // union of Chrome, FF, IE, and Safari console methods
  var m = [
    "log", "info", "warn", "error", "debug", "trace", "dir", "group",
    "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
    "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
  ];
  // define undefined methods as noops to prevent errors
  for (var i = 0; i < m.length; i++) {
    if (!window.console[m[i]]) {
      window.console[m[i]] = function() {};
    }    
  } 
})();
