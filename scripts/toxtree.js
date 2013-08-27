/* 
	ToxMan.js - ToxMan JavaScript query helper.
	Created by Ivan Georgiev, 2013.

*/

window.ToxMan = {
	currentQuery: null,
	currentDataset: null,
	models: null, // it gets filled from the listModels() query.
	queryParams: null,					// an associative array of parameters supplied on the query. Some things like 'language' can be retrieved from there.

	/* The following parametes can be passed in settings object to ToxMan.init() - with the same names
	*/
	prefix: 'ToxMan',										// the default prefix for elements, when they are retrieved from the DOM. Part of settings.
	jsonp: false,												// whether to use JSONP approach, instead of JSON. Part of settings.
	server: null,												// the server actually used for connecting. Part of settings. If not set - attempts to get 'server' parameter of the query, if not - get's current server.
	timeout: 5000,											// the timeout an call to the server should be wait before the attempt is considered error. Part of settings.
	
	// some handler functions that can be configured from outside. They are 
	onmodeladd: null,		// function (row, idx): called when each row for algorithm is added. idx is it's index in this.models. Part of settings.
	onrun: null,				// function (row, e): called within click hander for run prediction button. 'e' is the original event. Part of settings.
	onconnect: null,		// function (service): called when a server request is started - for proper visualization. Part of settings.
	onsuccess: null,		// function (code, mess): called on server request successful return. It is called along with the normal processing. Part of settings.
	onerror: null,			// function (code, mess): called on server reques error. Part of settings.
	
	// Some elements from the DOM which we use - remember them here upon init. Part of settings.
	elements: {
		featureList: null, 		// the whole container (table) for feature list
		featureRow: null,			// a single, template, row for filling the above
		featureHeader: null,  // a single row, as above, with textual header information
		diagramImage: null,		// the placeholder for the compund image
		modelList: null,				// the container (table) for algorithms list
		modelRow: null,				// a single, template, row for filling the above
	},
	
	/* A single place to hold all necessary queries. Parameters are marked with <XX> and formatString() (common.js) is used
	to prepare the actual URLs
	*/
	queries: {
		query: "/query/compound/search/all?search=<1>&page=0&pagesize=1",
		listModels: "/algorithm?search=ToxTree",
		taskPoll: "/task/<1>",
		getModel: "/model?algorithm=<1>",
		postModel: "",
		getPrediction: "/compound/<1>?feature_uris[]=<2>",
		postPrediction: ""
	},

	featurePrefix: 'http://www.opentox.org/api/1.1#',
	categoryRegex: /\^\^(\S+)Category/i,
		
	/* Initializes the ToxMan, setting up all elements, if not passed, that are going to be used, so it
	need to be called when the DOM is ready.
	*/
	init : function(settings) {
		if (!settings)
			settings = { elements: { } };
		else if (settings.elements === undefined)
			settings.elements = {};
			
		var prefix = this.prefix;
		if (settings.prefix)
			prefix = this.prefix = settings.prefix;
			
		var featureList = settings.elements.featureList;
		if (!featureList)
			featureList = document.getElementsByClassName(prefix + '-features')[0];
			
		if (featureList){
			this.elements.featureRow = featureList.getElementsByClassName('row-blank')[0];
			this.elements.featureHeader = featureList.getElementsByClassName('header-blank')[0];
			this.elements.featureList = featureList.classList.contains('body') ? featureList : featureList.getElementsByClassName('body')[0];
		}
		
		this.elements.diagramImage = settings.elements.diagramImage;
		if (!this.elements.diagramImage)
			this.elements.diagramImage = document.getElementsByClassName(prefix + '-diagram')[0];
		
		var modelList = settings.elements.modelList;
		if (!modelList)
			modelList = document.getElementsByClassName(prefix + '-models')[0];
		if (modelList){
			this.elements.modelRow = modelList.getElementsByClassName('row-blank')[0];
			this.elements.modelList = modelList.classList.contains('body') ? modelList : modelList.getElementsByClassName('body')[0];
		}
		
		this.onmodeladd = settings.onmodeladd;
		this.onrun = settings.onrun;
		this.initConnection(settings);
	},
	
	/* Clear all results that appera on the page - features, diagrams, prediction results - all.
	*/
	clearResults : function() {
		// clear features and diagrams first
		var elements = this.elements;
		if (elements.diagramImage)
			elements.diagramImage.style.visibility = 'hidden';
		if (elements.featureList)
			clearChildren(elements.featureList, elements.featureRow.parentNode == elements.featureList ? elements.featureRow : null);
		
		// TODO: now go with the predictions
	},
	
	/* Makes a query for dataset based on a needle - the starting point of all actions.
	*/
	query : function(needle) {
		if (needle.length < 1)
			return false;
		var self = this;
		this.call(formatString(this.queries.query, encodeURIComponent(needle)), function(dataset){
			// start with some clearing
			self.clearResults();
			if (!dataset || dataset.dataEntry.length < 1){
				if (self.onerror)
					self.onerror('notfound', localMessage.nothingFound);
				return false;
			}
			// now parse to see the compund ID
			dataset.dataEntry[0].compound.id = parseInt(dataset.dataEntry[0].compound.URI.replace(/.*compound\/(\d+)\/.*/, '$1'));
			self.currentDataset = dataset;
			
			// fills the feature list...
			self.addFeatures(self.buildFeatures(dataset, 0));
	
			// ... and setup the diagram image
			var image = self.elements.diagramImage;
			if (image){
				image.style.visibility = 'visible';
				image.src = dataset.dataEntry[0].compound.URI + '?media=image/png';
			}
			
			self.runAutos();
		});
	},
	
	/* Retrieves the model description for given algorithm. Used from both listModels() and runPrediction()
	*/
	getModel: function(algo, callback){
		var self = this;
		this.call(formatString(this.queries.getModel, encodeURIComponent(algo.uri)), function(model){
			if (!model || model.model.length < 1){
				self.call(self.queries.postModel, data, function(task){
					self.pollTask(task, function(ready){
						self.getModel(algo, callback);
					});					
				}, 'POST');
			}
			else { // OK, we have the model - attempt to get a prediction for our compound...
				callback(model);
			}
		});
	},
	
	/* Queries the server for list of all supported algorithms. The corresponding place in the UI is filled with the
	results, all necessary 'run', 'auto', etc. buttons are configured too.
	*/
	listModels : function() {
		var self = this;
		this.call(this.queries.listModels, function(algos){
			if (!algos) // i.e. error
				return false;
			var root = self.elements.modelList;
			var tempRow = self.elements.modelRow;
			
			algos = algos.algorithm;
			self.models = algos;
			if (!root || !tempRow)
				return false;
			
			clearChildren(root, tempRow.parentNode == root ? tempRow : null);
			for (var i = 0;i < algos.length; ++i) {
				var row = tempRow.cloneNode(true);
				algos[i].name = algos[i].name.substr(self.prefix.length + 2);
				fillTree(row, algos[i], self.prefix + '-algo-');
				
				// after the row is filled with data
				row.classList.remove('template');
				row.classList.remove('row-blank');
				root.appendChild(row);
				self.onmodeladd(row, i);

				// finally - attach the handler for running the prediction - create a new function each time so the proper index to be passed
				var run = row.querySelector('.run');
				run.onclick = (function(algoIdx, row){
					return function(e){
						self.runPrediction(algoIdx);
						if (self.onrun)
							self.onrun(row, e);
					}
				})(i, row);
			}
		});
	},
	
	/* Runs a prediction (algorithm) with given 'algo' (as reported upon listModels()) on the compound form the current dataset. 'algoId' is used to determine
		which element in the UI should be filled, so that results can be shown later.
	*/
	runPrediction : function (algoIndex) {
		var algo = this.models[algoIndex];
		
		// let's clean a bit - the trick is we've added class='<algo.id>' on every feature row concerning this algorithm
		var features = this.elements.featureList.getElementsByClassName(algo.id);
		while(features.length > 0)
			features[0].parentNode.removeChild(features[0]);
			
		// clear the previous prediction results.
		var mainRow = document.getElementById(ToxMan.prefix + '-algo-' + algo.id);
		var explain = mainRow.getElementsByClassName('explanation')[0];
		mainRow.classList.remove('predicted');
		explain.innerHTML = '';		
		
		var self = this;
		
		// the function that actually parses the results of predictions and fills up the UI
		var predictParser = function(prediction){
			var features = self.buildFeatures(prediction, 0);
			self.addFeatures(features, algo.name, algo.id, function(feature){
				return res = feature.name.indexOf('#explanation') == -1;
			});

			// now ask for categories, used as a summary ...
			var categories = self.buildCategories(features);
			
			// ... and fill them up in the interface.
			var resRoot = mainRow.getElementsByClassName('result')[0];
			var resTemp = resRoot.getElementsByClassName('row-blank')[0];
			clearChildren(resRoot, resTemp.parentNode == resRoot ? resTemp : null);
			var frag = document.createDocumentFragment();
			for (var i = 0;i < categories.length; ++i){
				var row = resTemp.cloneNode(true);
				fillTree(row, categories[i]);
				row.classList.remove('template');
				row.classList.remove('row-blank');
				row.classList.add(categories[i].toxicity);
				if (categories[i].active)
					row.classList.add('active');
				frag.appendChild(row);
			}
			resRoot.appendChild(frag);
			
			// now mark the whole stuff as predicted
			mainRow.classList.add('predicted');
			var expFeature = features.filter(function(feat){ return feat.name.indexOf('#explanation') > -1; })[0];
			if (expFeature)
				explain.innerHTML = expFeature.value;
		};
		
		// the prediction invoke trickery...
		self.getModel(algo, function(model){
			var q = formatString(self.queries.getPrediction, encodeURIComponent(self.currentDataset.dataEntry[0].compound.id), encodeURIComponent(model.model[0].predicted));
			self.call(q, predictParser);	
		});
	},
	
	/* Run predictions that are marked as 'auto'. Rely on the properly set id of each row in the algorithms list
	*/
	runAutos: function() {
		var autos = document.querySelectorAll('.' + this.prefix + '-models .auto');
		for (var i = 0;i < autos.length; ++i){
			if (autos[i].id.length > 0 && autos[i].checked){
				this.runPrediction(parseInt(autos[i].id.substr(this.prefix.length + 6)));
			}
		}	
	},
	
	/* Build a new array of features from 'values' and 'feature' arrays in the dataset. 
		The resulting array has {id, name, value} properties for each feature.
	*/
	buildFeatures : function(dataset, index) {
		var features = [];
		for (var i in dataset.dataEntry[index].values){
			var entry = new Object();
			entry.id = i;
			entry.value = dataset.dataEntry[index].values[i];
			entry.name = dataset.feature[i].title.replace(this.featurePrefix, "");
			entry.annotation = dataset.feature[i].annotation;
			features.push(entry);
		}
		
		return features;
	},
	
	/* This one build a category list from the feature list, built on the previous step. It returns a list, 
	which contains all possible categories along with their toxicity class, id, whether it's active, etc.
	*/
	buildCategories: function(features){
		var cats = [];
		features = features.filter(function(feat){
			return feat.annotation.length > 0 && feat.annotation[0].o !== undefined && feat.name.indexOf('#explanation') == -1;
		});
		
		if (features.length == 1){ // the "normal" case
			var anot = features[0].annotation;
			for (var i = 0; i < anot.length; ++i)
				cats.push({
					id: features[0].id,
					name: anot[i].o,
					toxicity: anot[i].type.replace(this.categoryRegex, '$1').toLowerCase(),
					active: anot[i].o == features[0].value
				});
		}
		else {
			for (var i = 0;i < features.length;++i){
				var anot = features[i].annotation;
				var toxic = "";
				for (var j = 0;j < anot.length; ++j)
					if (anot[j].o == features[i].value){
						toxic = anot[j].type.replace(this.categoryRegex, '$1').toLowerCase();
						break;
					}
				cats.push({
					id: features[i].id,
					name: features[i].name,
					toxicity: toxic,
					active: true,
				});
			}
		}
		
		return cats;
	},
	
	/* Adds given features (the result of buildFeatures call) to the feature list. If header is passed
	 one single header row is added with the given string
	*/
	addFeatures : function (features, header, classadd, filter) {
		// proceed on filling the feature windows
		var root = this.elements.featureList;
		var tempRow = this.elements.featureRow;

		if (!root || !tempRow)
			return false;
		
		var list = document.createDocumentFragment();
		
		// add a header row, if asked to do so.
		if (header){
			var hdr = this.elements.featureHeader.cloneNode(true);
			if (classadd)
				hdr.classList.add(classadd);
			fillTree(hdr, {"header": header});
			list.appendChild(hdr);
		}
		
		// now fill the features' key:value pairs.
		for (var i = 0;i < features.length; ++i) {
			if (filter && !filter(features[i]))
				continue;
			var row = tempRow.cloneNode(true);
			if (classadd)
				row.classList.add(classadd);
			fillTree(row, features[i]);
			row.classList.remove('template');
			row.classList.remove('row-blank');
			list.appendChild(row);
		}
		
		// finalize by adding this to the root.
		root.appendChild(list);
	},
	
	/* Poll a given taskId and calls the callback when a result from the server comes - 
	be it "running", "completed" or "error" - the callback is always called.
	*/
	pollTask : function(taskId, callback) {
		
	},
	
	/* Initialized the necessary connection data. Same settings as in ToxMan.init() are passed.
	*/
	initConnection: function(settings){
		if (!settings.server){
			var url = parseURL(document.location);
			this.queryParams = url.params;
			var server = url.params.server;
			if (!server)
				server = url.host;
			this.server = server;
		}
		
		if (settings.jsonp !== undefined)
			this.jsonp = settings.jsonp;
		if (settings.timeout !== undefined)
			this.timeout = settings.timeout;
			
		this.onerror = settings.onerror;
		this.onsuccess = settings.onsuccess;
		this.onconnect = settings.onconnect;
	},
	
	/* Makes a server call with the provided method. If none is given - the internally stored one is used
	*/
	call: function (service, callback, adata){
		var self = this;
		self.onconnect(service);
		var method = 'GET';
		if (adata !== undefined)
			method = 'POST';
		else 
			adata = {};

		adata.media = self.jsonp ? "application/x-javascript" : "application/json";
		$.ajax(self.server + service, {
			dataType: self.jsonp ? 'jsonp' : 'json',
			crossDomain: true,
			timeout: self.timeout,
			type: method,
			data: adata,
			jsonp: self.jsonp ? 'callback' : false,
			error: function(jhr, status, error){
				self.onerror(status, error);
				callback(null);
			},
			success: function(data, status, jhr){
				self.onsuccess(status, jhr.statusText);
				callback(data);
			}
		});
	}
};
/* End of ToxMan object */

window.languages = {
	en : {
		timeout: "Request timeout reached!",
		nothingFound: "No compound with this name is found!",
		ok: "Success",
		error: "Error: ",
		notfound: "Not found!",
		waiting: "Waiting for server response...",
	}
}

var localMessage = languages.en;

// some helper functions.
function setObjValue(obj, value){
	if ((value === undefined || value === null) && obj.dataset.default !== undefined)
		value = obj.dataset.default;

  if (obj.nodeName == "INPUT" || obj.nodeName == "SELECT")
    obj.value = value;
  else if (obj.nodeName == "IMG")
    obj.src = value;
  else if (obj.nodeName == "BUTTON")
		obj.dataset.value = value;
  else
    obj.innerHTML = value;
}

/*
Passed a HTML DOM element - it clears all children folowwing last one. Pass null for clearing all.
*/
function clearChildren(obj, last) {
  while (obj.lastChild && obj.lastChild != last) {
    obj.removeChild(obj.lastChild);
  }
}

/* formats a string, replacing [<number>] in it with the corresponding value in the arguments
*/
function formatString(format) {
  for (var i = 1;i < arguments.length; ++i) {
    format = format.replace('<' + i + '>', arguments[i]);
  }
  return format;
}

// given a root DOM element and an JSON object it fills all (sub)element of the tree
// which has class 'data-field' and their name corresponds to a property in json object.
// If prefix is given AND json has id property - the root's id set to to prefix + json.id
function fillTree(root, json, prefix, filter) {
	if (!filter)
		filter = 'data-field';
  var dataList = root.getElementsByClassName(filter);
  var dataCnt = dataList.length;
	
	var processFn = function(el, json){
    if (json[el.dataset.field] !== undefined) {
      var value = json[el.dataset.field];
      if ( el.dataset.filter !='' && (typeof window[el.dataset.filter] == 'function') ) {
        value = window[el.dataset.filter](value);
      }
      setObjValue(el, value);
    }
	}
	
	if (root.classList.contains(filter))
		processFn(root, json);

  for (var i = 0; i < dataCnt; ++i)
  	processFn(dataList[i], json);

  if (prefix && json.id !== undefined) {
    root.id = prefix + json.id;
  }
}

function parseURL(url) {
  var a =  document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':',''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function(){
      var ret = {},
        seg = a.search.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
      for (;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = (s.length>1)?decodeURIComponent(s[1].replace(/\+/g,  " ")):'';
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
    hash: a.hash.replace('#',''),
    path: a.pathname.replace(/^([^\/])/,'/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
    segments: a.pathname.replace(/^\//,'').split('/')
  };
}