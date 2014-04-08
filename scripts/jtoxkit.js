window.jT = window.jToxKit = {
	templateRoot: null,

	/* A single place to hold all necessary queries. Parameters are marked with <XX> and formatString() (common.js) is used
	to prepare the actual URLs
	*/
	queries: {
		taskPoll: "/task/<1>",
	},
	
	templates: { },        // html2js routine will fill up this variable
	tools: { },        // additional, external tools added with html2js

	/* SETTINGS. The following parametes can be passed in settings object to jT.init(), or as data-XXX - with the same names. Values set here are the defaults.
	*/
	settings: {
  	jsonp: false,                   // whether to use JSONP approach, instead of JSON.
  	crossDomain: false,             // should it expect cross-domain capabilities for the queries.
  	host: null,                     // same as above, but for the calling server, i.e. - the one that loaded the page.        
  	timeout: 15000,                 // the timeout an call to the server should be wait before the attempt is considered error.
  	pollDelay: 200,                 // after how many milliseconds a new attempt should be made during task polling.
  	onConnect: function(s){ },		  // function (service): called when a server request is started - for proper visualization. Part of settings.
  	onSuccess: function(s, c, m) { },	// function (code, mess): called on server request successful return. It is called along with the normal processing. Part of settings.
  	onError: function (s, c, m) { if (!!console && !!console.log) console.log("jToxKit call error (" + c + "): " + m + " from request: [" + s + "]"); },		// function (code, mess): called on server reques error. Part of settings.
  },
	
	// form the "default" baseUrl if no other is supplied
	formBaseUrl: function(url) {
    return url.protocol + "://" + url.host + (url.port.length > 0 ? ":" + url.port : '') + '/' + url.segments[0] + '/';	
	},
    
  // the jToxKit initialization routine, which scans all elements, marked as 'jtox-toolkit' and initializes them
	init: function() {
  	var self = this;
  	
  	self.initTemplates();

    // make this handler for UUID copying. Once here - it's live, so it works for all tables in the future
    jT.$(document).on('click', '.jtox-toolkit span.ui-icon-copy', function (e) { ccLib.copyToClipboard(jT.$(this).data('uuid')); return false;});
  
    // scan the query parameter for settings
		var url = ccLib.parseURL(document.location);
		var queryParams = url.params;
		queryParams.host = self.formBaseUrl(url);
	
    self.settings = jT.$.extend(self.settings, queryParams); // merge with defaults
    
	  // initializes the kit, based on the passed kit name
	  var initKit = function(element, params) {
	  	var kit = params.kit;
	  	if (kit.indexOf('jTox') != 0)
		  	kit = 'jTox' + kit.charAt(0).toUpperCase() + kit.slice(1);

	  	var fn = window[kit];
	  	return (typeof fn == 'function') ? new fn(element, params) : null;
	  };
	  
  	// now scan all insertion divs
  	jT.$('.jtox-toolkit').each(function(i) {
    	var dataParams = jT.$.extend(true, self.settings, jT.$(this).data());
    	if (!dataParams.manualInit){
    	  var el = this;
    	  // first, get the configuration, if such is passed
    	  if (!ccLib.isNull(dataParams.configFile)) {
    	    // we'll use a trick here so the baseUrl parameters set so far to take account... thus passing 'fake' kit instance
    	    // as the first parameter of jT.call();
      	  self.call({ settings: dataParams}, dataParams.configFile, function(config){
        	  if (!!config)
        	    dataParams['configuration'] = config;
            initKit(el, dataParams);
      	  });
    	  }
    	  else
    	    initKit(el, dataParams);
      }
  	});
	},
	
	initTemplates: function() {
	  var self = this;

    var root = jT.$('.jtox-template')[0];
    if (root === undefined) {
  	  var html = '';
    	for (var t in self.templates) {
      	html += self.templates[t];
    	}
    	
    	root = document.createElement('div');
    	root.className = 'jtox-template';
    	root.innerHTML = html;
    	document.body.appendChild(root);
    }
    
  	self.templateRoot = root;
	},
	
	getTemplate: function(selector) {
  	var el = jT.$(selector, this.templateRoot)[0];
  	if (!!el){
    	var el = el.cloneNode(true);
      el.removeAttribute('id');
    }
    return el;
	},
	
	insertTool: function (name, root) {
	  var html = this.tools[name];
	  if (!ccLib.isNull(html))
  	  root.innerHTML = html;
  	 return root;
	},
		
  changeTabsIds: function (root, suffix) {
    jT.$('ul li a', root).each(function() {
      var id = jT.$(this).attr('href').substr(1);
      var el = document.getElementById(id);
      id += suffix;
      el.id = id;
      jT.$(this).attr('href', '#' + id);
    })  
  },
  
  modifyColDef: function (kit, col, category, group) {
	  if (group == null)
	    group = "main";
	  var name = col.sTitle.toLowerCase();
	  
	  // helper function for retrieving col definition, if exists. Returns empty object, if no.          
	  var getColDef = function (cat) {
	    var catCol = kit.settings.configuration.columns[cat];
	    if (!ccLib.isNull(catCol)) {
	      catCol = catCol[group];
	      if (!ccLib.isNull(catCol))
	        catCol = catCol[name];
	    }
	
	    if (ccLib.isNull(catCol))
	      catCol = {};
	    return catCol;
	  };
	  // now form the default column, if existing and the category-specific one...
	  // extract column redefinitions and merge them all.
	  col = this.$.extend(col, getColDef('_'), getColDef(category));
	  return ccLib.isNull(col.bVisible) || col.bVisible ? col : null;
  },
  
  sortColDefs: function (colDefs) {
	  colDefs.sort(function(a, b) {
	    var valA = ccLib.isNull(a.iOrder) ? 0 : a.iOrder;
	    var valB = ccLib.isNull(b.iOrder) ? 0 : b.iOrder;
	    return valA - valB;
	  });
  },
  
  shortenedData: function (data, message, deflen) {
    var res = '';
    
    if (ccLib.isNull(deflen))
      deflen = 5;
    if (data.toString().length <= deflen) {
      res += data;
    }
    else {
      res += '<div class="shortened">' + data + '</div>';
      if (message != null)
        res += '<span class="ui-icon ui-icon-copy" title="' + message + '" data-uuid="' + data + '"></span>';
    }
    return res;
  },
		
	/* Poll a given taskId and calls the callback when a result from the server comes - 
	be it "running", "completed" or "error" - the callback is always called.
	*/
	pollTask : function(kit, task, callback) {
		var self = this;
		if (task === undefined || task.task === undefined || task.task.length < 1){
			console.log("Wrong task passed for polling: " + JSON.stringify(task));
			return;
		}
		task = task.task[0];
		ccLib.fireCallback(callback, kit, task);
		if (task.completed == -1){ // i.e. - running
			setTimeout(function(){
				self.call(kit, task.result, function(newTask){
					self.pollTask(newTask, callback);
				});
			}, self.pollDelay);
		}
		else if (task.error){ // additionally call the error handler
		  ccLib.fireCallback(self.settings.onError, self, '-1', task.error);
		}
	},
	
	/* Deduce the baseUrl from a given Url - either if it is full url, of fallback to jToxKit's if it is local
	Passed is the first "non-base" component of the path...
	*/
	grabBaseUrl: function(url){
    if (!ccLib.isNull(url) && url.indexOf('http') == 0)
      return this.formBaseUrl(ccLib.parseURL(url));
    else
      return this.settings.host;
	},
	
	/* Makes a server call for provided service, with settings form the given kit and calls 'callback' at the end - always.
	The 'params', if passed, can have following attributes:
		'method': the HTTP method to be used
		'data': the data to be passed to the server with the request.
	*/
	call: function (kit, service, params, callback){
		if (typeof params != 'object') {
			callback = params; // the params parameters is obviously omitted
			params = {};
		}
		
	  var settings = jT.$.extend({"baseUrl" : this.settings.host}, this.settings, params);
		if (kit == null)
		  kit = this;
		else 
  		settings = jT.$.extend(settings, kit.settings);

		ccLib.fireCallback(settings.onConnect, kit, service);
		  
		var accType = settings.jsonp ? "application/x-javascript" : "application/json";
		
		if (params.data === undefined){
			params.data = {};
			if (settings.jsonp)
				params.data.media = accType;
				
			if (params.method === undefined)
				params.method = 'GET';
		}
		else if (params.method === undefined)
				params.method = 'POST';

		// on some queries, like tasks, we DO have baseUrl at the beginning
		if (service.indexOf("http") != 0)
			service = settings.baseUrl + service;
			
		// now make the actual call
		jT.$.ajax(service, {
			dataType: settings.jsonp ? 'jsonp' : 'json',
			headers: { Accept: accType },
			crossDomain: settings.crossDomain || settings.jsonp,
			timeout: settings.timeout,
			type: params.method,
			data: params.data,
			jsonp: settings.jsonp ? 'callback' : false,
			error: function(jhr, status, error){
			  ccLib.fireCallback(settings.onError, kit, service, status, error);
				callback(null, jhr);
			},
			success: function(data, status, jhr){
			  ccLib.fireCallback(settings.onSuccess, kit, service, status, jhr.statusText);
				callback(data, jhr);
			}
		});
	}
};

// we need to do this here - because other tools/libraries could have scheduled themselves on 'ready',
// so it'll be too late to make this assignment then. Also - we can use jT.$ from now on :-)
jT.$ = jQuery; // .noConflict();

  	
jT.$(document).ready(function(){
  jT.init();
});
