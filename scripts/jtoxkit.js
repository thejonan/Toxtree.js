window.jT = window.jToxKit = {
	templateRoot: null,

	/* A single place to hold all necessary queries. Parameters are marked with {id} and formatString() (common.js) is used
	to prepare the actual URLs
	*/
	queries: {
		taskPoll: { method: 'GET', service: "/task/{id}" },
	},
	
	templates: { },        // html2js routine will fill up this variable
	tools: { },        // additional, external tools added with html2js

	/* SETTINGS. The following parametes can be passed in settings object to jT.init(), or as data-XXX - with the same names. Values set here are the defaults.
	*/
	settings: {
	  plainText: false,               // whether to expect result as plain text, and not JSON. Used in special cases like ketcher.
  	jsonp: false,                   // whether to use JSONP approach, instead of JSON.
  	crossDomain: false,             // should it expect cross-domain capabilities for the queries.
  	baseUrl: null,                  // the baseUrl for the server that loaded the page.
  	fullUrl: null,                  // the url as it is on loading the page - this is parsed one, i.e. parseUrl() processed.
  	timeout: 15000,                 // the timeout an call to the server should be wait before the attempt is considered error.
  	pollDelay: 200,                 // after how many milliseconds a new attempt should be made during task polling.
  	onConnect: function(s){ },		  // function (service): called when a server request is started - for proper visualization. Part of settings.
  	onSuccess: function(s, c, m) { },	// function (code, mess): called on server request successful return. It is called along with the normal processing. Part of settings.
  	onError: function (s, c, m) { if (!!console && !!console.log) console.log("jToxKit call error (" + c + "): " + m + " from request: [" + s + "]"); },		// function (code, mess): called on server reques error. Part of settings.
  },
	
	// form the "default" baseUrl if no other is supplied
	formBaseUrl: function(url) {
    return !!url.host ? url.protocol + "://" + url.host + (url.port.length > 0 ? ":" + url.port : '') + '/' + url.segments[0] : null;
	},
    
  // initializes one kit, based on the kit name passed, either as params, or found within data-XXX parameters of the element
  initKit: function(element) {
    var self = this;

  	var dataParams = self.$(element).data();
    
  	if (!dataParams.manualInit) {
    	var kit = dataParams.kit;
    	var topSettings = self.$.extend(true, {}, self.settings);

    	// we need to traverse up, to collect some parent's settings...
    	self.$(self.$(element).parents('.jtox-toolkit').toArray().reverse()).each(function(){
      	if (!self.$(this).hasClass('jtox-widget')) {
        	topSettings = self.$.extend(true, topSettings, self.$(this).data());
      	}
    	});
    	
      dataParams = self.$.extend(true, topSettings, dataParams);

  	  // the real initialization function
      var realInit = function (params) {
      	if (!kit)
      		return null;
        // add jTox if it is missing AND there is not existing object/function with passed name. We can initialize ketcher and others like this too.
      	if (!window[kit] && kit.indexOf('jTox') != 0)
    	  	kit = 'jTox' + kit.charAt(0).toUpperCase() + kit.slice(1);
    
      	var fn = window[kit];
      	if (typeof fn == 'function') {
      	  var obj = new fn(element, params);
          if (fn.kits === undefined)
            fn.kits = [];
          fn.kits.push(obj);
          return obj;
      	}
        else if (typeof fn == "object" && typeof fn.init == "function")
          return fn.init(element, params);
        else
          console.log("jToxError: trying to initialize unexistend jTox kit: " + kit);

        return null;
      };

  	  // first, get the configuration, if such is passed
  	  if (!ccLib.isNull(dataParams.configFile)) {
  	    // we'll use a trick here so the baseUrl parameters set so far to take account... thus passing 'fake' kit instance
  	    // as the first parameter of jT.call();
    	  self.call({ settings: dataParams}, dataParams.configFile, function(config){
      	  if (!!config)
      	    dataParams['configuration'] = self.$.extend(true, dataParams['configuration'], config);
          jT.$(element).data('jtKit', realInit(dataParams));
    	  });
  	  }
  	  else {
  	    if (!ccLib.isNull(dataParams.configuration) && typeof dataParams.configuration == "string" && !ccLib.isNull(window[dataParams.configuration]))
  	      dataParams.configuration = window[dataParams.configuration];
    	  
        jT.$(element).data('jtKit', realInit(dataParams));
  	  }
    }
  },
  
  // the jToxKit initialization routine, which scans all elements, marked as 'jtox-toolkit' and initializes them
	init: function(root) {
  	var self = this;
  	
  	if (!root) {
    	self.initTemplates();
  
      // make this handler for UUID copying. Once here - it's live, so it works for all tables in the future
      self.$(document).on('click', '.jtox-toolkit span.ui-icon-copy', function () { ccLib.copyToClipboard(self.$(this).data('uuid')); return false;});
      // install the click handler for fold / unfold
      self.$(document).on('click', '.jtox-foldable>.title', function() { self.$(this).parent().toggleClass('folded'); });

      // scan the query parameter for settings
  		var url = self.settings.fullUrl = ccLib.parseURL(document.location);
  		var queryParams = url.params;
  		if (!queryParams.baseUrl)
  		  queryParams.baseUrl = self.formBaseUrl(url);
  	
      self.settings = self.$.extend(true, self.settings, queryParams); // merge with defaults
      root = document;
  	}

  	// now scan all insertion divs
  	self.$('.jtox-toolkit', root).each(function(i) { self. initKit(this); });
	},
	
	kit: function (element) {
  	return $(element).data('jtKit');
	},
	
	parentKit: function(name, element) {
    var query = null;
    if (typeof name == 'string')
      name = window[name];
    self.$(element).parents('.jtox-toolkit').each(function() {
      var kit = jT.kit(this);
      if (!kit)
        return;
      if (kit instanceof name)
        query = kit;
    });
    
    return query;
  },
	
	initTemplates: function() {
	  var self = this;

    var root = jT.$('.jtox-template')[0];
    if (!root) {
    	root = document.createElement('div');
    	root.className = 'jtox-template';
    	document.body.appendChild(root);
    }
    
	  var html = root.innerHTML;
  	for (var t in self.templates) {
    	html += self.templates[t];
  	}
  	
  	root.innerHTML = html;
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
	  if (!ccLib.isNull(html)) {
  	  root.innerHTML = html;
  	  this.init(root); // since we're pasting as HTML - we need to make re-traverse and initiazaltion of possible jTox kits.
    }
    return root;
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
      return this.settings.baseUrl;
	},

  /* Grab the paging information from the given URL and place it into the settings of passed
  kit, as <kit>.settings.pageStart and <kit>.settings.pageSize. Pay attention that it is 'pageStart' 
  and not 'pageNo'.
  */
  grabPaging: function (kit, url) {
    var urlObj = ccLib.parseURL(url);
    if (urlObj.params['pagesize'] !== undefined) {
      var sz = parseInt(urlObj.params['pagesize']);
      if (sz > 0)
        kit.settings.pageSize = sz;
      url = ccLib.removeParameter(url, 'pagesize');
    }
    
    if (urlObj.params['page'] !== undefined) {
      var beg = parseInt(urlObj.params['page']);
      if (beg >= 0)
        kit.settings.pageStart = beg * kit.settings.pageSize;
      url = ccLib.removeParameter(url, 'page');
    }
    
    return url;
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
		else if (params == null)
		  params = {};
		
	  var settings = jT.$.extend({}, this.settings, params);
		if (kit == null)
		  kit = this;
		else 
  		settings = jT.$.extend(settings, kit.settings);

		ccLib.fireCallback(settings.onConnect, kit, service);
		  
		var accType = settings.plainText ? "text/plain" : (settings.jsonp ? "application/x-javascript" : "application/json");
		
		if (!params.data){
			params.data = {};
			if (settings.jsonp)
				params.data.media = accType;
				
			if (!params.method)
				params.method = 'GET';
		}
		else if (!params.method)
				params.method = 'POST';

		// on some queries, like tasks, we DO have baseUrl at the beginning
		if (service.indexOf("http") != 0)
			service = settings.baseUrl + service;
			
		// now make the actual call
		jT.$.ajax(service, {
			dataType: params.dataType || (settings.plainText ? "text": (settings.jsonp ? 'jsonp' : 'json')),
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

/* UI related functions of jToxKit are put here for more convenient usage
*/
window.jT.ui = {
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
    if (col.sTitle === undefined || col.sTitle == null)
      return null;
      
	  var name = col.sTitle.toLowerCase();
	  
	  // helper function for retrieving col definition, if exists. Returns empty object, if no.          
	  var getColDef = function (cat) {
	    var catCol = kit.settings.configuration.columns[cat];
	    if (!ccLib.isNull(catCol)) {
	      if (!!group) {
	        catCol = catCol[group];
  	      if (!ccLib.isNull(catCol))
  	        catCol = catCol[name];
        }
        else
	        catCol = catCol[name];
	    }
	
	    if (ccLib.isNull(catCol))
	      catCol = {};
	    return catCol;
	  };
	  // now form the default column, if existing and the category-specific one...
	  // extract column redefinitions and merge them all.
	  col = jT.$.extend(col, (!!group ? getColDef('_') : {}), getColDef(category));
	  return ccLib.isNull(col.bVisible) || col.bVisible ? col : null;
  },
  
  sortColDefs: function (colDefs) {
	  colDefs.sort(function(a, b) {
	    var valA = ccLib.isNull(a.iOrder) ? 0 : a.iOrder;
	    var valB = ccLib.isNull(b.iOrder) ? 0 : b.iOrder;
	    return valA - valB;
	  });
  },
  
  processColumns: function (kit, category) {
    var colDefs = [];
    var catList = kit.settings.configuration.columns[category];
    for (var name in catList) {
      var col = this.modifyColDef(kit, catList[name], category);
      if (col != null)
        colDefs.push(col);
    }
      
    this.sortColDefs(colDefs);
    return colDefs;
  },
  
  queryInfo: function (aoData) {
    var info = {};
    for (var i = 0, dl = aoData.length; i < dl; ++i)
      info[aoData[i].name] = aoData[i].value;
  
    if (info.iSortingCols > 0) {
      info.iSortDirection = info.sSortDir_0.toLowerCase();
      info.sSortData = info["mDataProp_" + info.iSortCol_0];
    }
    else {
      info.iSortDirection = 0;
      info.sSortData = "";
    }
    
    return info;
  },
  
  putStars: function (kit, stars, title) {
    if (!kit.settings.shortStars) {
      var res = '<div title="' + title + '">';
      for (var i = 0;i < kit.settings.maxStars;++i) {
        res += '<span class="ui-icon ui-icon-star jtox-inline';
        if (i >= stars)
          res += ' transparent';
        res += '"></span>';
      }
      return res + '</div>';
    }
    else { // i.e. short version
      return '<span class="ui-icon ui-icon-star jtox-inline" title="' + title + '"></span>' + stars;
    }
  },
  
  addSelection: function (kit, oldFn) {
    return function (data, type, full) {
      var oldRes = oldFn(data, type, full);
      if (type != 'display')
        return oldRes;
      
      var html = '<input type="checkbox" value="' + (full.URI || full.uri) + '"' +
              (!!kit.settings.selectionHandler ? ' class="jtox-handler" data-handler="' + kit.settings.selectionHandler + '"' : '') +
              '/>';
              
      return html + oldRes;
    }
  },
  
  putControls: function (kit, handlers) {
    var pane = jT.$('.jtox-controls', kit.rootElement)[0];
    if (kit.settings.showControls) {
      ccLib.fillTree(pane, { "pagesize": kit.settings.pageSize });
      jT.$('.next-field', pane).on('click', handlers.nextPage);
      jT.$('.prev-field', pane).on('click', handlers.prevPage);
      jT.$('select', pane).on('change', handlers.sizeChange)
      var pressTimeout = null;
      jT.$('input', pane).on('keydown', function(e) {
        var el = this;
        if (pressTimeout != null)
          clearTimeout(pressTimeout);
        pressTimeout = setTimeout(function () { handlers.filter.apply(el, [e]); }, 350);
      });
    }
    else // ok - hide me
      pane.style.display = "none";
  }
};

// we need to do this here - because other tools/libraries could have scheduled themselves on 'ready',
// so it'll be too late to make this assignment then. Also - we can use jT.$ from now on :-)
jT.$ = jQuery; // .noConflict();

  	
jT.$(document).ready(function(){
  jT.init();
});
