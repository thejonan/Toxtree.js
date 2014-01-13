var ccLib = {
  extendArray: function (base, arr) {
    // initialize, if needed
    if (base === undefined || base == null)
      base = [];
    else if (!$.isArray(base))
      base = [base];
    
    // now proceed with extending
    if (arr !== undefined && arr !== null){
      for (var i = 0, al = arr.length; i < al; ++i){
        var v = arr[i];
        if (base.indexOf(v) < 0 && v !== undefined && v != null)
          base.push(v);
      }
    }
    return base;
  },

  fireCallback: function (callback, self) {
    if (typeof callback != 'function')
      callback = window[callback];
    callback.apply((self !== undefined && self != null) ? self : document, Array.prototype.slice.call(arguments, 2));
  },
  
  /* Function setObjValue(obj, value)Set a given to the given element (obj) in the most appropriate way - be it property - the necessary one, or innetHTML
  */
  setObjValue: function (obj, value){
  	if ((value === undefined || value === null) && $(obj).data('default') !== undefined)
  		value = $(obj).data('default');
  
    if (obj.nodeName == "INPUT" || obj.nodeName == "SELECT")
      obj.value = value;
    else if (obj.nodeName == "IMG")
      obj.src = value;
    else if (obj.nodeName == "BUTTON")
  		$(obj).data('value', value);
    else
      obj.innerHTML = value;      
  },

  isNull: function(obj) {
    return obj === undefined || obj == null;
  },
  
  isEmpty: function(obj) {
    var empty = true;
    if (obj !== undefined || obj != null) {
      if (typeof obj == 'object') {
        for (var i in obj) {
          if (obj[i] != null) {
            empty = false;
            break;
          }
        } 
      }
      else if (typeof obj == 'string')
        empty = obj.trim().length == 0;
      else if ($.isArray(obj))
        empty = obj.length == 0;
      else
        empty = false;
    }
    return empty;
  },
  
  setJsonValue: function (json, field, val) {
    if (field !== undefined){
      try {
        eval("json." + field + " = val");
      }
      catch(e){
        ;
      }
    }  
  },
  
  getJsonValue: function (json, field){
    var value = undefined;
    if (field !== undefined) {
      try {
        eval("value = json." + field);
      } 
      catch(e){
        ;
      }
    }
    return value;
  },
  
  // given a root DOM element and an JSON object it fills all (sub)element of the tree
  // which has class 'data-field' and their name corresponds to a property in json object.
  // If prefix is given AND json has id property - the root's id set to to prefix + json.id
  fillTree: function (root, json, prefix, filter) {
    var self = this;
  	if (!filter)
  		filter = 'data-field';
  	
  	var processFn = function(el, json){
  	  var value = self.getJsonValue(json, $(el).data('field'));
      if (value !== undefined) {
        var format = $(el).data('format');
        if ( !!format && (typeof window[format] == 'function') ) {
          value = window[format](value, json);
        }
        self.setObjValue(el, value);
      }
  	}
	
  	if ($(root).hasClass(filter))
  		processFn(root, json);
  
    $(root.getElementsByClassName(filter)).each(function (i) { processFn($(this)[0], json); } );
  
    if (prefix && json.id !== undefined) {
      root.id = prefix + json.id;
    }
  },
  
  /*
  Passed a HTML DOM element - it clears all children folowwing last one. Pass null for clearing all.
  */
  clearChildren: function(obj, last) {
    while (obj.lastChild && obj.lastChild != last) {
      obj.removeChild(obj.lastChild);
    }
  },
    
	/* formats a string, replacing [<number>] in it with the corresponding value in the arguments
  */
  formatString: function(format) {
    for (var i = 1;i < arguments.length; ++i) {
      format = format.replace('<' + i + '>', arguments[i]);
    }
    return format;
  },
  
  trim: function(obj) {
    if (obj === undefined || obj == null)
      return obj;
    if (typeof obj == "string")
      return obj.trim();
    else
      return obj;
  },
  
  copyToClipboard: function(text, prompt) {
    if (!prompt) {
      prompt = "Press Ctrl-C (Command-C) to copy and then Enter.";
    }
    window.prompt(prompt, text);
  },
  
  equalizeHeights: function() {
    var tabs = [];
    for (var i = 0;i < arguments.length; ++i) {
      tabs[i] = arguments[i].firstElementChild;
    }    
    
    for (;;) {
      var height = 0;
      for (i = 0;i < tabs.length ; ++i) {
        if (tabs[i] != null && tabs[i].offsetHeight > height)
          height = tabs[i].offsetHeight;
      }
      
      if (height == 0)
        break;
        
      for (i = 0;i < tabs.length ; ++i) {
        if (tabs[i] != null && tabs[i].offsetHeight < height)
          tabs[i].style.height = height + "px";
        tabs[i] = tabs[i].nextElementSibling;
      }
    }
  },
  
  addParameter: function (url, param) {
    return url + (url.indexOf('?') > 0 ? "&" : "?") + param;
  },
  
  parseURL: function(url) {
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
};

function ccNonEmptyFilter(v) {
  return v !== undefined && v != null && v != '';  
}
/* toxdataset.js - General, universal dataset visualizer.
 *
 * Copyright 2012-2013, IDEAconsult Ltd. http://www.ideaconsult.net/
 * Created by Ivan Georgiev
**/

var jToxDataset = (function () {
  var defaultSettings = { // all settings, specific for the kit, with their defaults. These got merged with general (jToxKit) ones.
    "showExport": true,
    "groups": {
      "Identifiers" : function(name, features) { return [
        "http://www.opentox.org/api/1.1#Diagram", 
        "http://www.opentox.org/api/1.1#CASRN", 
        "http://www.opentox.org/api/1.1#EINECS"
      ];},
      
      "Names": function (name, features) { return [
        "http://www.opentox.org/api/1.1#ChemicalName",
        "http://www.opentox.org/api/1.1#TradeName",
        "http://www.opentox.org/api/1.1#IUPACName",
        "http://www.opentox.org/api/1.1#SMILES",
        "http://www.opentox.org/api/1.1#InChI",
        "http://www.opentox.org/api/1.1#REACHRegistrationDate"
      ];},
      
      "Calculated": function (name, features) {
        var arr = [];
        for (var f in features) {
          if (!ccLib.isNull(features[f].source) && !ccLib.isNull(features[f].source.type) && !features[f].source.type.toLowerCase() == "algorithm")
            arr.push(f);
        }
        return arr;
      },
      
      "Other": function (name, features) {
        var arr = [];
        for (var f in features) {
          if (!features[f].used)
            arr.push(f);
        }
        return arr;
      }
    },
    "exports": [
      {type: "chemical/x-mdl-sdfile", icon: "images/sdf.jpg"},
      {type: "chemical/x-cml", icon: "images/cml.jpg"},
      {type: "chemical/x-daylight-smiles", icon: "images/smi.png"},
      {type: "chemical/x-inchi", icon: "images/inchi.png"},
      {type: "text/uri-list", icon: "images/link.png"},
      {type: "application/pdf", icon: "images/pdf.png"},
      {type: "text/csv", icon: "images/excel.png"},
      {type: "text/plain", icon: "images/excel.png"},
      {type: "text/x-arff", icon: "images/weka.png"},
      {type: "text/x-arff-3col", icon: "images/weka.png"},
      {type: "application/rdf+xml", icon: "images/rdf.gif"},
      {type: "application/json", icon: "images/json.png"}
    ]
  };
  var instanceCount = 0;

  /* define the standard features-synonymes, working with 'sameAs' property. Beside the title we define the 'accumulate' property
  as well which is used in processEntry() to accumulate value(s) from given (synonym) properties into specific property of the compound entry itself.
  'accumulate' can be an array, which results in adding value to several places.
  */
  var baseFeatures = {
    "http://www.opentox.org/api/1.1#REACHRegistrationDate" : { title: "REACH Date", accumulate: "compound.reachdate", used: true},
    "http://www.opentox.org/api/1.1#CASRN" : { title: "CAS", accumulate: "compound.cas", used: true},
  	"http://www.opentox.org/api/1.1#ChemicalName" : { title: "Name", accumulate: "compound.name", used: true},
  	"http://www.opentox.org/api/1.1#TradeName" : {title: "Trade Name", accumulate: "compound.tradename", used: true},
  	"http://www.opentox.org/api/1.1#IUPACName": {title: "IUPAC Name", accumulate: ["compound.name", "compound.iupac"], used: true},
  	"http://www.opentox.org/api/1.1#EINECS": {title: "EINECS", accumulate: "compound.einecs", used: true},
    "http://www.opentox.org/api/1.1#InChI": {title: "InChI", accumulate: "compound.inchi", used: true},
  	"http://www.opentox.org/api/1.1#InChI_std": {title: "InChI", accumulate: "compound.inchi", used: true},
    "http://www.opentox.org/api/1.1#InChIKey": {title: "InChI Key", accumulate: "compound.inchikey", used: true},
  	"http://www.opentox.org/api/1.1#InChIKey_std": {title: "InChI Key", accumulate: "compound.inchikey", used: true},
    "http://www.opentox.org/api/1.1#InChI_AuxInfo": {title: "InChI Aux", accumulate: "compound.inchi", used: true},
  	"http://www.opentox.org/api/1.1#InChI_AuxInfo_std": {title: "InChI Aux", accumulate: "compound.inchi", used: true},
  	"http://www.opentox.org/api/1.1#IUCLID5_UUID": {title: "IUCLID5 UUID", accumulate: "compound.i5uuid", used: true},
  	"http://www.opentox.org/api/1.1#SMILES": {title: "SMILES", accumulate: "compound.smiles", used: true},
  	"http://www.opentox.org/api/dblinks#CMS": {title: "CMS", used: true},
  	"http://www.opentox.org/api/dblinks#ChEBI": {title: "ChEBI", used: true},
  	"http://www.opentox.org/api/dblinks#Pubchem": {title: "Public Chem", used: true},
  	"http://www.opentox.org/api/dblinks#ChemSpider": {title: "Chem Spider", used: true},
  	"http://www.opentox.org/api/dblinks#ChEMBL": {title: "ChEMBL", used: true},
  	"http://www.opentox.org/api/dblinks#ToxbankWiki": {title: "Toxban Wiki", used: true},
  	// and one for unified way of processing diagram
  	"http://www.opentox.org/api/1.1#Diagram": {title: "Diagram", accumulate: "compound.URI", used: true}
  };

  // constructor
  var cls = function (root, settings) {
    var self = this;
    self.rootElement = root;
    self.settings = $.extend({}, defaultSettings, jToxKit.settings, settings); // i.e. defaults from jToxDataset
    self.features = null; // features, as downloaded from server, after being processed.
    self.groups = null; // computed groups, i.e. 'groupName' -> array of feature list, prepared.
    self.fixTable = self.varTable = null; // the two tables - to be initialized in prepareTables.
    
    root.appendChild(jToxKit.getTemplate('#jtox-dataset'));
    instanceCount++;
  };
  
  // now follow the prototypes of the instance functions.
  cls.prototype = {
    /* make a tab-based widget with features and grouped on tabs. It relies on filled and processed 'self.features' as well
    as created 'self.groups'.
    */
    prepareTabs: function (root, isMain, nodeFn) {
      var self = this;
      
      var fr = document.createDocumentFragment();
      var all = document.createElement('div');
      fr.appendChild(all);
      ulEl = document.createElement('ul');
      all.appendChild(ulEl);

      var featNames = {};
      var createATab = function(grId, name) {
        var liEl = document.createElement('li');
        ulEl.appendChild(liEl);
        var aEl = document.createElement('a');
        aEl.href = "#" + grId;
        aEl.innerHTML = name;
        liEl.appendChild(aEl);
        return liEl;
      };
      
      for (var gr in self.groups) {
        var grId = "jtox-ds-" + gr + "-" + instanceCount;
        createATab(grId, gr.replace(/_/g, " "));
        
        // now prepare the content...
        var divEl = document.createElement('div');
        divEl.id = grId;
        // ... and fill it.
        for (var i = 0, glen = self.groups[gr].length;i < glen; ++i) {
          var fId = self.groups[gr][i];
          divEl.appendChild(nodeFn(fId, self.features[fId].title));
          self.features[fId].used = true;
        }
        
        all.appendChild(divEl);
      }
      
      if (isMain && self.settings.showExport) {
        var tabId = "jtox-ds-export-" + instanceCount;
        var liEl = createATab(tabId, "Export");
        $(liEl).addClass('jtox-ds-export');
        var divEl = jToxKit.getTemplate('#jtox-ds-export')
        divEl.id = tabId;
        all.appendChild(divEl);
        divEl = divEl.getElementsByClassName('jtox-exportlist')[0];
        
        var base = jToxKit.grabBaseUrl(self.datasetUri, "dataset");
        for (var i = 0, elen = self.settings.exports.length; i < elen; ++i) {
          var expo = self.settings.exports[i];
          var el = jToxKit.getTemplate('#jtox-ds-download');
          divEl.appendChild(el);
          
          el.getElementsByTagName('a')[0].href = ccLib.addParameter(self.datasetUri, "media=" + expo.type);
          var img = el.getElementsByTagName('img')[0];
          img.alt = img.title = expo.type;
          img.src = base + expo.icon;
        }
      }
      
      // now append the prepared document fragment and prepare the tabs.
      root.appendChild(fr);
      return $(all).tabs({ collapsible: isMain });
    },
    
    prepareTables: function() {
      var self = this;
      var fixedCols = [];
      var varCols = [];
      
      var colList = fixedCols;
      // enter the first column - the number.
      fixedCols.push({
            "mData": "index",
            "sClass": "middle"
      });

      // prepare the function for column switching...      
      var fnShowColumn = function(sel, idx) {
        return function() {
          $(sel + ' table', self.rootElement).dataTable().fnSetColumnVis(idx, this.checked);
          ccLib.equalizeHeights(self.fixTable.tHead, self.varTable.tHead);
          ccLib.equalizeHeights(self.fixTable.tBodies[0], self.varTable.tBodies[0]);
        }
      };
      
      // make a query for all checkboxes in the main tab, so they can be traversed in parallel with the features and 
      // a change handler added.
      var checkList = $('.jtox-ds-features .jtox-checkbox', self.rootElement);
      var checkIdx = 0;
      
      // now proceed to enter all other columns
      for (var gr in self.groups){
        for (var i = 0, glen = self.groups[gr].length; i < glen; ++i) {
          var fId = self.groups[gr][i];
          var feature = self.features[fId];
          var col = {
            "sTitle": feature.title + (ccLib.isNull(feature.units) ? "" : feature.units),
            "sDefaultContent": "-",
            "mData": feature.accumulate !== undefined ? feature.accumulate : "values." + fId
          };
          
          // some special cases, like diagram
          if (cls.shortFeatureId(fId) == "Diagram") {
            col["mRender"] = function(data, type, full) {
              return (type != "display") ? "-" : '<img src="' + full.compound.diagramUri + '" class="jtox-ds-smalldiagram"/>';  
            }
            col["sClass"] = "paddingless";
            col["sWidth"] = "125px";
          }
          
          // finally - assign column switching to the checkbox of main tab.
          $(checkList[checkIdx++]).on('change', fnShowColumn(colList == fixedCols ? '.jtox-ds-fixed' : '.jtox-ds-variable', colList.length))
          
          // and push it into the proper list.
          colList.push(col);
        }
        
        // after the first one we switch to variable table's columns.
        colList = varCols;
      }
      
      // now - create the tables - they have common options, except the aoColumns (i.e. column definitions), which are added later.
      self.varTable = ($(".jtox-ds-variable table", self.rootElement).dataTable({
        "bPaginate": false,
        "bProcessing": false,
        "bLengthChange": false,
				"bAutoWidth": true,
        "sDom" : "rt",
        "bSort": false,
        "aoColumns": varCols
      }))[0];
      
      self.fixTable = ($(".jtox-ds-fixed table", self.rootElement).dataTable({
        "bPaginate": true,
        "bProcessing": true,
        "bLengthChange": false,
				"bAutoWidth": false,
        "sDom" : "rt<Fip>",
        "aoColumns": fixedCols,
        "bServerSide": true,
        "bSort": false,
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
          var info = {};
          for (var i = 0, dl = aoData.length; i < dl; ++i)
            info[aoData[i].name] = aoData[i].value;

          var page = info.iDisplayStart / info.iDisplayLength;
/*
          theForm.Order = tableCols[info.iSortCol_0].mData;
          theForm.Direction = info.sSortDir_0;
*/
          var qUri = ccLib.addParameter(self.datasetUri, "page=" + page + "&pagesize=" + info.iDisplayLength);
          jToxKit.call(self, qUri, function(dataset){
            if (!!dataset){
              cls.processDataset(dataset, self.features, function(oldVal, newVal) {
                if (ccLib.isNull(oldVal) || newVal.toLowerCase().indexOf(oldVal.toLowerCase()) >= 0)
                  return newVal;
                if (oldVal.toLowerCase().indexOf(newVal.toLowerCase()) >= 0)
                  return oldVal;
                return oldVal + ", " + newVal;
              });
              $(self.varTable).dataTable().fnClearTable();
              $(self.varTable).dataTable().fnAddData(dataset.dataEntry);
              
              fnCallback({
                "sEcho": info.sEcho,
                "iTotalRecords": dataset.query.total,
                "iTotalDisplayRecords": dataset.dataEntry.length,
                "aaData": dataset.dataEntry
              });
              
              ccLib.equalizeHeights(self.fixTable.tHead, self.varTable.tHead);
              ccLib.equalizeHeights(self.fixTable.tBodies[0], self.varTable.tBodies[0]);
            }
          });
        }
      }))[0];
      
      ccLib.equalizeHeights(self.fixTable.tHead, self.varTable.tHead);
    },

    /* Process features as reported in the dataset. Works on result of standalone calls to <datasetUri>/feature
    */
    prepareGroups: function () {
      var self = this;
      
      var grps = self.settings.groups;
      self.groups = {};
      for (var i in grps){
        self.groups[i] = (grps[i])(i, self.features);
      }
    },
    
    /* Clears the page from any dataset fillings, so a new call can be made.
    */
    clearDataset: function () {
      var self = this;
    },
    
    /* Makes a query to the server for particular dataset, asking for feature list first, so that the table(s) can be 
    prepared.
    */
    queryDataset: function (datasetUri) {
      var self = this;
      
      self.clearDataset();
      self.datasetUri = datasetUri;
      jToxKit.call(self, datasetUri + '/feature', function (feature) {
        if (!!feature) {
          self.features = feature.feature;
          cls.processFeatures(self.features);
          self.prepareGroups();
          self.prepareTabs($('.jtox-ds-features', self.rootElement)[0], true, function (id, name){
            var fEl = jToxKit.getTemplate('#jtox-ds-feature');
            ccLib.fillTree(fEl, {title: name});
            $(fEl).data('feature-id', id);
            return fEl;
          });
          self.prepareTables(); // prepare and add the tables - they will make certain queries to fill up with data.
        }
      });
    },
    
  }; // end of prototype
  
  // some public, static methods
  cls.shortFeatureId = function(fId) {
    return fId.substr(fId.indexOf('#') + 1); // a small trick - 'not-found' returns -1, and adding 1 results in exactly what we want: 0, i.e. - start, i.e. - no change.
  };
  
  cls.processEntry = function (entry, features, fnValue) {
    for (var fid in entry.values) {
      var feature = features[fid];
      
      // if applicable - accumulate the feature value to a specific location whithin the entry
      if (feature.accumulate !== undefined) {
        var accArr = feature.accumulate;
        if (!$.isArray(accArr))
          accArr = [accArr];
        
        for (var v = 0; v < accArr.length; ++v){
          var oldVal = ccLib.getJsonValue(entry, accArr[v]);
          var newVal = entry.values[fid];
          if (typeof fnValue === "function")
            ccLib.setJsonValue(entry, accArr[v], fnValue(oldVal, newVal));
          else if (!$.isArray(oldVal))
            ccLib.setJsonValue(entry, accArr[v], ccLib.isNull(oldVal) ? newVal : oldVal + newVal);
          else
            oldVal.push(newVal);
        }
      }
    }
    
    return entry;
  };
  
  cls.processFeatures = function(features) {
    features = $.extend(features, baseFeatures);
    for (var fid in features) {
      // starting from the feature itself move to 'sameAs'-referred features, until sameAs is missing or points to itself
      // This, final feature should be considered "main" and title and others taken from it.
      var feature = features[fid];
      var base = fid.replace(/(http.+\/feature\/).*/g, "$1");
      
      for (;;){
        if (feature.sameAs === undefined || feature.sameAs == null || feature.sameAs == fid || fid == base + feature.sameAs)
          break;
        if (features[feature.sameAs] !== undefined)
          feature = features[feature.sameAs];
        else {
          if (features[base + feature.sameAs] !== undefined)
            feature = features[base + feature.sameAs];
          else
            break;
        }
      }

      // now merge with this one... it copies everything that we've added, if we've reached to it. Including 'accumulate'
      features[fid] = $.extend(features[fid], feature);
    }
    
    return features;
  };
  
  cls.processDataset = function(dataset, features, fnValue) {
    if (ccLib.isNull(features)) {
      cls.processFeatures(dataset.feature);
      features = dataset.feature;
    }
    
    for (var i = 0, dl = dataset.dataEntry.length; i < dl; ++i) {
      cls.processEntry(dataset.dataEntry[i], features, fnValue);
      dataset.dataEntry[i].index = i + 1;
      var uri = dataset.dataEntry[i].compound.URI;
      uri = uri.replace(/(.+)(\/conformer.*)/, "$1");
      dataset.dataEntry[i].compound.diagramUri = uri + "?media=image/png";
    }
  };
  
  return cls;
})();
/* toxstudy.js - Study-related functions from jToxKit.
 *
 * Copyright 2012-2013, IDEAconsult Ltd. http://www.ideaconsult.net/
 * Created by Ivan Georgiev
**/

var jToxStudy = (function () {
  var defaultSettings = { };    // all settings, specific for the kit, with their default. These got merged with general (jToxKit) ones.
  var instanceCount = 0;
  
  // make this handler for UUID copying. Once here - it's live, so it works for all tables in the future
  $(document).on('click', '.jtox-toolkit span.ui-icon-copy', function (e) { ccLib.copyToClipboard($(this).data('uuid'), "Press Ctrl-C (Command-C) to copy UUID:"); return false;});
  
  var fnDatasetValue = function (old, value){
		return ccLib.extendArray(old, value != null ? value.trim().toLowerCase().split("|") : [value]).filter(ccNonEmptyFilter);
  };
  
  // constructor
  var cls = function (root, settings) {
    var self = this;
    self.rootElement = root;
    self.suffix = '_' + instanceCount++;
    
    self.settings = $.extend({}, defaultSettings, jToxKit.settings, settings); // i.e. defaults from jToxStudy
    // now we have our, local copy of settings.

    // get the main template, add it (so that jQuery traversal works) and THEN change the ids.
    // There should be no overlap, because already-added instances will have their IDs changed already...
    var tree = jToxKit.getTemplate('#jtox-studies');
    root.appendChild(tree);
    jToxKit.changeTabsIds(tree, self.suffix);
    
    // keep on initializing...
    var loadPanel = function(panel){
      if (panel){
        $('.jtox-study.unloaded', panel).each(function(i){
          var table = this;
          jToxKit.call(self, $(table).data('jtox-uri'), function(study){
            $(table).removeClass('unloaded folded');  
            $(table).addClass('loaded');
            self.processStudies(panel, study.study, false);
            $('.dataTable', table).dataTable().fnAdjustColumnSizing();
          });  
        });
      }
    };
    
    // initialize the tab structure for several versions of dataTables.
    $(tree).tabs({
      "select" : function(event, ui) {
        loadPanel(ui.panel);
      },
      "beforeActivate" : function(event, ui) {
        if (ui.newPanel)
          loadPanel(ui.newPanel[0]);
      }
    });
    
    // when all handlers are setup - make a call, if needed.    
    if (self.settings['substanceUri'] !== undefined){
      self.querySubstance(self.settings['substanceUri']);
    }
  };
  
  // now follow the prototypes of the instance functions.
  cls.prototype = {
    getFormatted: function (data, type, format) {
      var value = null;
      if (typeof format === 'function' )
        value = format.call(this, data, type);
      else if (typeof format === 'string' || typeof format === 'number')
        value = data[format];
      else
        value = data[0];
      
      return value;
    },
    
    renderMulti: function (data, type, full, format) {
      var self = this;
      var dlen = data.length;
      if (dlen < 2)
        return self.getFormatted(data[0], type, format);
  
      var height = 100 / dlen;
      var df = '<table>';
      for (var i = 0, dlen = data.length; i < dlen; ++i) {
        df += '<tr class="' + (i % 2 == 0 ? 'even' : 'odd') + '"><td class="center" style="height: ' + height + '%">' + self.getFormatted(data[i], type, format) + '</td></tr>';
      }
      
      df += '</table>';
      return df;
    },
    
    createCategory: function(tab, category) {
      var self = this;
  
      var theCat = $('.' + category + '.jtox-study', tab)[0];
      if (!theCat) {
        theCat = jToxKit.getTemplate('#jtox-study');
        tab.appendChild(theCat);
        $(theCat).addClass(category);
        
        // install the click handler for fold / unfold
        $('.jtox-study-title', theCat).click(function() {
          $(theCat).toggleClass('folded');
        });
      }
      
      return theCat;
    },
  
    updateCount: function(str, count) {
      if (count === undefined)
        count = 0;
      return str.replace(/(.+)\s\(([0-9]+)\)/, "$1 (" + count + ")");
    },
    
    
    ensureTable: function (tab, study) {
      var self = this;
  
      var theTable = $('.' + study.protocol.category.code + ' .jtox-study-table', tab)[0];
      if (!$(theTable).hasClass('dataTable')) {
  
        var colDefs = [
          { "sClass": "center", "sWidth": "20%", "mData": "protocol.endpoint" } // The name (endpoint)
        ];
        
        // start filling it
        var headerRow = theTable.getElementsByClassName('jtox-header')[0];
        var before = headerRow.firstElementChild;
        var parCount = 0;
  
        // this function takes care to add as columns all elements from given array
        var putAGroup = function(group, fProcess) {
          var count = 0;
          var skip = [];
          for (var p in group) {
            if (skip.indexOf(p) > -1)
              continue;
            if (group[p + " unit"] !== undefined)
              skip.push(p + " unit");
            var val = fProcess(p);
            if (val === undefined)
              continue;
            colDefs.push(val);
            
            var th = document.createElement('th');
            th.innerHTML = p;
            headerRow.insertBefore(th, before);
            before = th.nextElementSibling;
            count++;
          }
          return count;
        }
  
        // some value formatting functions
        var formatLoHigh = function (data, type) {
          var out = "";
          data.loValue = ccLib.trim(data.loValue);
          data.upValue = ccLib.trim(data.upValue);
          if (!ccLib.isEmpty(data.loValue) && !ccLib.isEmpty(data.upValue)) {
            out += (data.loQualifier == ">=") ? "[" : "(";
            out += data.loValue + ", " + data.upValue;
            out += (data.upQualifier == "<=") ? "]" : ") ";
          }
          else // either of them is non-undefined
          {
            var fnFormat = function (q, v) {
              return (!!q ? q : "=") + " " + v;
            };
            
            if (!ccLib.isEmpty(data.loValue))
              out += fnFormat(data.loQualifier, data.loValue);
            else if (!ccLib.isEmpty(data.upValue))
              out += fnFormat(data.upQualifier, data.upValue);
            else
              out += '-';
          }
          
          data.unit = ccLib.trim(data.unit);
          if (!!data.unit)
            out += data.unit;
          return out.replace(/ /g, "&nbsp;");
        };
        
        var formatUnits = function(data, unit) {
          data = ccLib.trim(data);
          unit = ccLib.trim(unit);
          return !ccLib.isNull(data) ? (data + (!!unit ? "&nbsp;" + unit : "")) : "-";
        };

        // use it to put parameters...
        parCount += putAGroup(study.parameters, function(p) {
          if (study.effects[0].conditions[p] !== undefined  || study.effects[0].conditions[p + " unit"] !== undefined)
            return undefined;
          
          var col = {
            "sClass" : "center middle", 
            "mData" : "parameters." + p,
            "sDefaultContent": "-"
          };
          
          if (study.parameters[p] !== undefined && study.parameters[p] != null){
            col["mRender"] = study.parameters[p].loValue === undefined ?
              function (data, type, full) { return formatUnits(data, full[p + " unit"]); } : 
              function (data, type, full) { return formatLoHigh(data.parameters[p], type); };
          }
          
          return col;
        });
        // .. and conditions
        parCount += putAGroup(study.effects[0].conditions, function(c){
          var rnFn = null;
          if (study.effects[0].conditions[c] !== undefined && study.effects[0].conditions[c] != null)
            rnFn = study.effects[0].conditions[c].loValue === undefined ? 
              function(data, type) { return formatUnits(data.conditions[c],  data.conditions[c + " unit"]); } : 
              function(data, type) { return formatLoHigh(data.conditions[c], type); }
          else
            rnFn = function(data, type) { return "-"; }
            
          return { 
            "sClass" : "center middle jtox-multi", 
            "mData" : "effects", 
            "mRender" : function(data, type, full) { return self.renderMulti(data, type, full, rnFn); } 
          };
        });
        
        // now fix the colspan of 'Conditions' preheader cell
        var preheaderCell = theTable.getElementsByClassName('jtox-preheader')[0].firstElementChild.nextElementSibling;
        if (parCount > 0)
          preheaderCell.setAttribute('colspan', parCount);
        else
          preheaderCell.parentNode.removeChild(preheaderCell);
        
        // add also the "default" effects columns
        colDefs.push(
          { "sClass": "center middle jtox-multi", "sWidth": "15%", "mData": "effects", "mRender": function (data, type, full) { return self.renderMulti(data, type, full, "endpoint");  } },   // Effects columns
          { "sClass": "center middle jtox-multi", "sWidth": "15%", "mData" : "effects", "mRender": function (data, type, full) { return self.renderMulti(data, type, full, function (data, type) { return formatLoHigh(data.result, type) }) } }
        );
  
        // jump over those two - they are already in the DOM      
        before = before.nextElementSibling.nextElementSibling;
        
        // now is time to put interpretation columns..
        parCount = putAGroup(study.interpretation, function(i){
          return { "sClass" : "center middle jtox-multi", "mData" : "interpretation." + i, "sDefaultContent": "-"};
        });
  
        // jump over Effects preheader-column      
        preheaderCell = preheaderCell.nextElementSibling.nextElementSibling;
        if (parCount > 0)
          preheaderCell.setAttribute('colspan', parCount);
        else
          preheaderCell.parentNode.removeChild(preheaderCell);
        
        // finally put the protocol entries
        colDefs.push(
          { "sClass": "center", "sWidth": "15%", "mData": "protocol.guideline", "mRender" : "[,]", "sDefaultContent": "?"  },    // Protocol columns
          { "sClass": "center", "sWidth": "50px", "mData": "owner.company.name", "mRender" : function(data, type, full) { return type != "display" ? '' + data : '<div class="shortened">' + data + '</div>'; }  }, 
          { "sClass": "center", "sWidth": "50px", "mData": "uuid", "bSearchable": false, "mRender" : function(data, type, full) { return type != "display" ? '' + data : '<div class="shortened">' + data + '</div><span class="ui-icon ui-icon-copy" title="Press to copy the UUID in the clipboard" data-uuid="' + data + '"></span>'; } }
        );
        
        // READYY! Go and prepare THE table.
        $(theTable).dataTable( {
          "bPaginate": true,
          "bProcessing": true,
          "bLengthChange": false,
  				"bAutoWidth": false,
          "sDom" : "rt<Fip>",
          "aoColumns": colDefs,
          "fnInfoCallback": function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
            var el = $('.jtox-study-title .data-field', $(this).parents('.jtox-study'))[0];
            el.innerHTML = self.updateCount(el.innerHTML, iTotal);
            return sPre;
          },
  				"oLanguage": {
            "sProcessing": "<img src='" + self.baseUrl + "images/24x24_ambit.gif' border='0'>",
            "sLoadingRecords": "No studies found.",
            "sZeroRecords": "No studies found.",
            "sEmptyTable": "No studies available.",
            "sInfo": "Showing _TOTAL_ study(s) (_START_ to _END_)",
            "sLengthMenu": 'Display <select>' +
              '<option value="10">10</option>' +
              '<option value="20">20</option>' +
              '<option value="50">50</option>' +
              '<option value="100">100</option>' +
              '<option value="-1">all</option>' +
              '</select> studies.'
          }
        });
      }
      else
        $(theTable).dataTable().fnClearTable();
        
      return theTable;
    },
    
    processSummary: function (summary) {
      var self = this;
      var typeSummary = [];
      
      // first - clear all existing tabs
      var catList = self.rootElement.getElementsByClassName('jtox-study');
      while(catList.length > 0) {
        catList[0].parentNode.removeChild(catList[0]);
      }
      
      // create the groups on the corresponding tabs
      for (var s in summary) {
        var sum = summary[s];
        var top = sum.topcategory.title;
        if (!top)
          continue;
        var top = top.replace(/ /g, "_");
        var tab = $('.jtox-study-tab.' + top, self.rootElement)[0];
        
        var catname = sum.category.title;
        if (!catname) {
          typeSummary[top] = sum.count;
        }
        else {
          var cat = self.createCategory(tab, catname);
          $(cat).data('jtox-uri', sum.category.uri);
        }
      }
      
      // update the number in the tabs...
      $('ul li a', self.rootElement).each(function (i){
        var data = $(this).data('type');
        if (!!data){
          var cnt = typeSummary[data];
          var el = $(this)[0];
          el.innerHTML = (self.updateCount(el.innerHTML, cnt));
        }
      });
      
      // now install the filter box handler. It delays the query a bit and then spaws is to all tables in the tab.
      var filterTimeout = null;
      var fFilter = function (ev) {
        if (!!filterTimeout)
          clearTimeout(filterTimeout);
    
        var field = ev.currentTarget;
        var tab = $(this).parents('.jtox-study-tab')[0];
        
        filterTimeout = setTimeout(function() {
          var tabList = tab.getElementsByClassName('jtox-study-table');
          for (var t = 0, tlen = tabList.length; t < tlen; ++t) {
            $(tabList[t]).dataTable().fnFilter(field.value);
          }
        }, 300);
      };
      
      var tabList = document.getElementsByClassName('jtox-study-tab');
      for (var t = 0, tlen = tabList.length;t < tlen; t++){
        var filterEl = tabList[t].getElementsByClassName('jtox-study-filter')[0].onkeydown = fFilter;
      }
    },
    
    processStudies: function (tab, study, map) {
      var self = this;
      var cats = [];
      
      // first swipe to map them to different categories...
      if (!map){
        // add this one, if we're not remapping. map == false assumes that all passed studies will be from
        // one category.    
        cats[study[0].protocol.category.code] = study;
      }
      else{
        for (var i = 0, slen = study.length; i < slen; ++i) {
          var ones = study[i];
          if (map) {
            if (cats[ones.protocol.category] === undefined) {
              cats[ones.protocol.category.code] = [ones];
            }
            else {
              cats[ones.protocol.category.code].push(ones);
            }
          }
        }
      }
  
      // now iterate within all categories (if many) and initialize the tables
      for (var c in cats) {
        var onec = cats[c];
        var aStudy = $('.' + c + '.jtox-study', tab)[0];
        if (aStudy === undefined)
          continue;
  
        ccLib.fillTree(aStudy, {title: onec[0].protocol.category.title + " (0)"});
        
        // now swipe through all studyies to build a "representative" one with all fields.
        var study = {};
        for (var i = 0, cl = onec.length; i < cl; ++i) {
          $.extend(true, study, onec[i]);
          if (!ccLib.isEmpty(study.parameters) && !ccLib.isEmpty(study.effects[0].conditions))
            break;
        }

        var theTable = self.ensureTable(tab, study);
        $(theTable).dataTable().fnAddData(onec);
      }
      
      // we need to fix columns height's because of multi-cells
      $('#' + theTable.id + ' .jtox-multi').each(function(index){
        this.style.height = '' + this.offsetHeight + 'px';
      });
    },
    
    formatConcentration: function (precision, val, unit) {
    	return ((precision === undefined || precision === null || "=" == precision ? "" : precision) + val + " " + (unit == null || unit == '' ? "% (w/w)" : unit)).replace(/ /g, "&nbsp;");
    },
    
    processComposition: function(json){
      var self = this;
      var tab = $('.jtox-composition', self.rootElement)[0];
      
      // clear the old tabs, if any.
      if ($(tab).hasClass('unloaded')){
        $(tab).removeClass('unloaded');
        $(tab).empty();
      }
      
      var prepareFillTable = function (json, panel) {
        var theTable = $('.substances-table', panel);
        // prepare the table...
        $(theTable).dataTable({
  				"bSearchable": true,
  				"bProcessing" : true,
  				"bPaginate" : true,
          "sDom" : "rt<Fip>",
/*   				"sDom" : '<"help remove-bottom"i><"help"p>Trt<"help"lf>', */
/* 				  "sPaginationType": "full_numbers", */
  				"sPaginate" : ".dataTables_paginate _paging",
  				"bAutoWidth": false,
  				"oLanguage": {
            "sProcessing": "<img src='" + self.baseUrl + "images/24x24_ambit.gif' border='0'>",
            "sLoadingRecords": "No substances found.",
            "sZeroRecords": "No substances found.",
            "sEmptyTable": "No substances available.",
            "sInfo": "Showing _TOTAL_ substance(s) (_START_ to _END_)",
          },
  		    "aoColumns": [
            {  //1
    					"sClass" : "left",
    					"sWidth" : "10%",
    					"mData" : "relation",
    					"mRender" : function(val, type, full) {
    					  if (type != 'display')
    					    return '' + val;
    					  var func = ("HAS_ADDITIVE" == val) ? full.proportion.function_as_additive : "";
    					  return '<span class="camelCase">' +  val.replace("HAS_", "").toLowerCase() + '</span>' + ((func === undefined || func === null || func == '') ? "" : " (" + func + ")");
              }
            },	    
    				{ //2
    					"sClass" : "camelCase left",
    					"sWidth" : "15%",
    					"mData" : "component.compound.name",
    					"mRender" : function(val, type, full) {
    						return (type != 'display') ? '' + val : 
    						  '<a href="' + full.component.compound.URI + '" target="_blank" title="Click to view the compound"><span class="ui-icon ui-icon-link" style="float: left; margin-right: .3em;"></span></a>' + val;
    					}
    				},	    	
    				{ //3
    					"sClass" : "left",
    					"sWidth" : "10%",
    					"mData" : "component.compound.einecs",
    				},
    				{ //4
    					"sClass" : "left",
    					"sWidth" : "10%",
    					"mData" : "component.compound.cas",
    				},
    				{ //5
    					"sClass" : "center",
    					"sWidth" : "15%",
    					"mData" : "proportion.typical",
    					"mRender" : function(val, type, full) { return type != 'display' ? '' + val.value : self.formatConcentration(val.precision, val.value, val.unit); }
    				},
    				{ //6
    					"sClass" : "center",
    					"sWidth" : "15%",
    					"mData" : "proportion.real",
    					"mRender" : function(val, type, full) { return type != 'display' ? '' + val.lowerValue : self.formatConcentration(val.lowerPrecision, val.lowerValue, val.unit); }
    				},
    				{ //7
    					"sClass" : "center",
    					"sWidth" : "15%",
    					"mData" : "proportion.real",
    					"mRender" : function(val, type, full) { return type != 'display' ? '' + val.upperValue : self.formatConcentration(val.upperPrecision, val.upperValue, val.unit); }
    				}
  		    ]
  		  });

        // and fill up the table.
        $(theTable).dataTable().fnAddData(json);
        return theTable;
      };
      
      var substances = {};

      jToxDataset.processFeatures(json.feature);
      // proprocess the data...
      for (var i = 0, cmpl = json.composition.length; i < cmpl; ++i) {
        var cmp = json.composition[i];
        
        jToxDataset.processEntry(cmp.component, json.feature, fnDatasetValue);

        // now prepare the subs        
        var theSubs = substances[cmp.compositionUUID];
        if (theSubs === undefined)
          substances[cmp.compositionUUID] = theSubs = { name: "", purity: "", maxvalue: 0, uuid : cmp.compositionUUID, composition : [] };
        
        theSubs.composition.push(cmp);
        var val = cmp.proportion.typical;
        if (cmp.relation == 'HAS_CONSTITUENT' && (theSubs.maxvalue < val.value || theSubs.name == '')) {
          theSubs.name = cmp.component.compound['name'] + ' ' + self.formatConcentration(val.precision, val.value, val.unit);
          theSubs.maxvalue = val.value;
          val = cmp.proportion.real;
          theSubs.purity = (val.lowerValue + '-' + val.upperValue + ' ' + (val.unit == null || val.unit == '' ? "% (w/w)" : val.unit)).replace(/ /g, "&nbsp;");
        }
      }
      
      // now make the actual filling
      for (var i in substances) {
        var panel = jToxKit.getTemplate('#jtox-compoblock');
        tab.appendChild(panel);
        ccLib.fillTree($('.composition-info', panel)[0], substances[i]);
        prepareFillTable(substances[i].composition, panel);
      }
    },
    
    querySummary: function(substanceURI) {
      var self = this;
      
      jToxKit.call(self, substanceURI + "/studysummary", function(summary) {
        if (!!summary && !!summary.facet)
          self.processSummary(summary.facet);
      });
    },
    
    queryComposition: function(substanceURI) {
      var self = this;
      
      jToxKit.call(self, substanceURI + "/composition", function(composition) {
        if (!!composition && !!composition.composition)
          self.processComposition(composition);
        });
    },
    
    querySubstance: function(substanceURI) {
      var self = this;
      
      // re-initialize us on each of these calls.
      self.baseUrl = jToxKit.grabBaseUrl(substanceURI, 'substance');
      
      var rootTab = $('.jtox-substance', self.rootElement)[0];
      jToxKit.call(self, substanceURI, function(substance){
         if (!!substance && !!substance.substance && substance.substance.length > 0){
           substance = substance.substance[0];
           ccLib.fillTree(rootTab, substance);
           // go and query for the reference query
           jToxKit.call(self, substance.referenceSubstance.uri, function (dataset){
             if (!!dataset) {
              jToxDataset.processDataset(dataset, null, fnDatasetValue);
              ccLib.fillTree(rootTab, dataset.dataEntry[0]);
             }
           });
           
           // query for the summary and the composition too.
           self.querySummary(substance.URI);
           self.queryComposition(substance.URI);
         }
      });
    }
  }; // end of prototype
  
  return cls;
})();
window.jToxKit = {
	templateRoot: null,

	/* A single place to hold all necessary queries. Parameters are marked with <XX> and formatString() (common.js) is used
	to prepare the actual URLs
	*/
	queries: {
		taskPoll: "/task/<1>",
	},
	
	templates: { },        // html2js routine will fill up this variable

	/* SETTINGS. The following parametes can be passed in settings object to jToxKit.init(), or as data-XXX - with the same names. Values set here are the defaults.
	*/
	settings: {
  	jsonp: false,					// whether to use JSONP approach, instead of JSON.
  	baseUrl: null,					// the server actually used for connecting. Part of settings. If not set - attempts to get 'baseUrl' parameter of the query, if not - get's current server.
  	timeout: 15000,				// the timeout an call to the server should be wait before the attempt is considered error.
  	pollDelay: 200,				// after how many milliseconds a new attempt should be made during task polling.
  	onConnect: function(s){ },		    // function (service): called when a server request is started - for proper visualization. Part of settings.
  	onSuccess: function(c, m) { },		// function (code, mess): called on server request successful return. It is called along with the normal processing. Part of settings.
  	onError: function (c, m) { },			// function (code, mess): called on server reques error. Part of settings.
  },
	
	// some handler functions that can be configured from outside with the settings parameter.
    
	init: function() {
  	var self = this;
  	
  	self.initTemplates();

    // scan the query parameter for settings
		var url = ccLib.parseURL(document.location);
		var queryParams = url.params;
		queryParams.host = url.host;
	
    self.settings = $.extend(self.settings, queryParams); // merge with defaults
	  
		if (!self.settings.baseUrl)
		  self.settings.baseUrl = self.settings.host;
	  
  	// now scan all insertion divs
  	$('.jtox-toolkit').each(function(i) {
    	var dataParams = $(this).data();
    	if (!dataParams.manualInit){
    	  // initializes the kit, based on the passed kit name
      	if (dataParams.kit == "study")
      	  new jToxStudy(this, dataParams);
      }
  	});
	},
	
	initTemplates: function() {
	  var self = this;

    var root = document.getElementsByClassName('jtox-template')[0];
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
  	var el = $(selector, this.templateRoot)[0];
  	if (!!el){
    	var el = $(selector, this.templateRoot)[0].cloneNode(true);
      el.removeAttribute('id');
    }
    return el;
	},
		
  changeTabsIds: function (root, suffix) {
    $('ul li a', root).each(function() {
      var id = $(this).attr('href').substr(1);
      var el = document.getElementById(id);
      id += suffix;
      el.id = id;
      $(this).attr('href', '#' + id);
    })  
  },
		
	/* Poll a given taskId and calls the callback when a result from the server comes - 
	be it "running", "completed" or "error" - the callback is always called.
	*/
	pollTask : function(task, callback) {
		var self = this;
		if (task === undefined || task.task === undefined || task.task.length < 1){
		  ccLib.fireCallback(self.settings.onError, self, '-1', localMessage.taskFailed);
			return;
		}
		task = task.task[0];
		if (task.completed == -1){ // i.e. - running
			setTimeout(function(){
				self.call(task.result, function(newTask){
					self.pollTask(newTask, callback);
				});
			}, self.pollDelay);
		}
		else if (!task.error){
			callback(task.result);
		}
		else { // error
		  ccLib.fireCallback(self.settings.onError, self, '-1', task.error);
		}
	},
	
	/* Deduce the baseUrl from a given Url - either if it is full url, of fallback to jToxKit's if it is local
	Passed is the first "non-base" component of the path...
	*/
	grabBaseUrl: function(url, main){
    if (url !== undefined && url != null && url.indexOf('http') == 0) {
      var re = new RegExp("(.+\/)" + main + ".*");
      return url.replace(re, "$1");
    }
    else
      return this.settings.baseUrl;
	},
	
	/* Makes a server call with the provided method. If none is given - the internally stored one is used
	*/
	call: function (kit, service, callback, adata){
		if (kit == null)
		  kit = this;
		  
		ccLib.fireCallback(kit.settings.onConnect, kit, service);
		  
		var method = 'GET';
		var accType = kit.settings.jsonp ? "application/x-javascript" : "application/json";	
		
		if (adata !== undefined){
			method = 'POST';
			if (typeof adata == "boolean")
				adata = {};
		}
		else
			adata = { };

		// on some queries, like tasks, we DO have baseUrl at the beginning
		if (service.indexOf("http") != 0)
			service = (!!kit.settings.baseUrl ? kit.settings.baseUrl : this.settings.baseUrl) + service;
			
		// now make the actual call
		$.ajax(service, {
			dataType: kit.settings.jsonp ? 'jsonp' : 'json',
			headers: { Accept: accType },
			crossDomain: true,
			timeout: kit.settings.timeout,
			type: method,
			data: adata,
			jsonp: kit.settings.jsonp ? 'callback' : false,
			error: function(jhr, status, error){
			  ccLib.fireCallback(kit.settings.onError, kit, status, error);
				callback(null);
			},
			success: function(data, status, jhr){
			  ccLib.fireCallback(kit.settings.onSuccess, kit, status, jhr.statusText);
				callback(data);
			}
		});
	}
};

$(document).ready(function(){
  jToxKit.init();
});
jToxKit.templates['all-dataset']  = 
"	  <div id=\"jtox-dataset\">" +
"	    <div class=\"jtox-ds-features\"></div>" +
"	    <div class=\"jtox-ds-tables\">" +
"	      <div class=\"jtox-ds-fixed\">" +
"	        <table></table>" +
"	      </div><div class=\"jtox-ds-variable\">" +
"	        <table></table>" +
"	      </div>" +
"	    </div>" +
"	  </div>" +
""; // end of #jtox-dataset 

jToxKit.templates['dataset-details']  = 
"    <div id=\"jtox-details\" class=\"jtox-details\">" +
"    </div>" +
""; // end of #jtox-details 

jToxKit.templates['dataset-one-feature']  = 
"    <div id=\"jtox-ds-feature\" class=\"jtox-ds-feature\"><input type=\"checkbox\" checked=\"yes\" class=\"jtox-checkbox\" /><span class=\"data-field jtox-title\" data-field=\"title\"> ? </span></div>" +
""; // end of #jtox-ds-feature 

jToxKit.templates['dataset-export']  = 
"    <div id=\"jtox-ds-download\" class=\"jtox-inline\">" +
"      <a target=\"_blank\"><img class=\"borderless\"/></a>" +
"    </div>" +
""; // end of #jtox-ds-feature 

jToxKit.templates['dataset-export']  = 
"    <div id=\"jtox-ds-export\">" +
"      <div class=\"jtox-inline\">Download dataset as: </div>" +
"      <div class=\"jtox-inline jtox-exportlist\"></div>" +
"    </div>" +
""; // end of #jtox-ds-feature 

jToxKit.templates['dataset-export']  = 
"    <div id=\"jtox-ds-details\">" +
"      <div class=\"jtox-inline\"><img class=\"data-field borderless\" data-field=\"diagram\"/></div>" +
"      <div class=\"jtox-inline tablist\"></div>" +
"    </div>" +
""; // end of #jtox-ds-feature 

jToxKit.templates['all-studies']  = 
"	  <div id=\"jtox-studies\">" +
"	    <ul>" +
"	      <li><a href=\"#jtox-substance\">IUC Substance</a></li>" +
"	      <li><a href=\"#jtox-composition\">Composition</a></li>" +
"	      <li><a href=\"#jtox-pchem\" data-type=\"P-CHEM\">P-Chem (0)</a></li>" +
"	      <li><a href=\"#jtox-envfate\" data-type=\"ENV_FATE\">Env Fate (0)</a></li>" +
"	      <li><a href=\"#jtox-ecotox\" data-type=\"ECOTOX\">Eco Tox (0)</a></li>" +
"	      <li><a href=\"#jtox-tox\" data-type=\"TOX\">Tox (0)</a></li>" +
"	    </ul>" +
"	    <div id=\"jtox-substance\" class=\"jtox-substance\">" +
"	      <table class=\"dataTable\">" +
"	        <thead>" +
"	          <tr>" +
"	            <th class=\"right jtox-size-third\">IUC Substance name:</th>" +
"	            <td class=\"data-field camelCase\" data-field=\"name\"> ? </td>" +
"	          </tr>" +
"	          <tr>" +
"	            <th class=\"right\">IUC Substance UUID:</th>" +
"	            <td class=\"data-field\" data-field=\"i5uuid\"> ? </td>" +
"	          </tr>" +
"	          <tr>" +
"	            <th class=\"right\">IUC Public name:</th>" +
"	            <td class=\"data-field camelCase\" data-field=\"publicname\"> ? </td>" +
"	          </tr>" +
"	          <tr>" +
"	            <th class=\"right\">Legal entity:</th>" +
"	            <td class=\"data-field\" data-field=\"ownerName\"> ? </td>" +
"	          </tr>" +
"	          <tr>" +
"	            <th class=\"right\">Legal entity UUID:</th>" +
"	            <td class=\"data-field\" data-field=\"ownerUUID\"> ? </td>" +
"	          </tr>" +
"	          <tr>" +
"	            <th class=\"right\">Type substance composition:</th>" +
"	            <td class=\"data-field\" data-field=\"substanceType\"> ? </td>" +
"	          </tr>" +
"	          <tr class=\"borderless-bottom\">" +
"	            <th class=\"right\">IUC Substance Reference Identifier</th>" +
"	            <td></td>" +
"	          </tr>" +
"	          <tr class=\"borderless-top borderless-bottom\">" +
"	            <td class=\"right\">CAS:</td>" +
"	            <td class=\"data-field\" data-field=\"compound.cas\"> ? </td>" +
"	          </tr>" +
"	          <tr class=\"borderless-top borderless-bottom\">" +
"	            <td class=\"right\">EC:</td>" +
"	            <td class=\"data-field\" data-field=\"compound.einecs\"> ? </td>" +
"	          </tr>" +
"	          <tr class=\"borderless-top borderless-bottom\">" +
"	            <td class=\"right\">Chemical name:</td>" +
"	            <td class=\"data-field\" data-field=\"compound.name\"> ? </td>" +
"	          </tr>" +
"	          <tr class=\"borderless-top borderless-bottom\">" +
"	            <td class=\"right\">IUPAC name:</td>" +
"	            <td class=\"data-field\" data-field=\"compound.iupac\"> ? </td>" +
"	          </tr>" +
"	          <tr class=\"borderless-top borderless-bottom\">" +
"	            <td class=\"right\">UUID:</td>" +
"	            <td class=\"data-field\" data-field=\"referenceSubstance.i5uuid\"> ? </td>" +
"	          </tr>" +
"	          <tr class=\"borderless-top\">" +
"	            <td class=\"right\">IUC Subst. identifier used by Legal entity:</td>" +
"	            <td class=\"data-field\" data-field=\"compound.tradename\"> ? </td>" +
"	          </tr>" +
"	        </thead>" +
"	      </table>" +
"	    </div>" +
"	    <div id=\"jtox-composition\" class=\"jtox-composition unloaded\"></div>" +
"	    <div id=\"jtox-pchem\" class=\"jtox-study-tab P-CHEM\">" +
"	      <p><input type=\"text\" class=\"jtox-study-filter ui-input\" placeholder=\"Filter...\" /></p>" +
"      </div>" +
"	    <div id=\"jtox-envfate\" class=\"jtox-study-tab ENV_FATE\">" +
"	      <p><input type=\"text\" class=\"jtox-study-filter ui-input\" placeholder=\"Filter...\" /></p>" +
"	    </div>" +
"	    <div id=\"jtox-ecotox\" class=\"jtox-study-tab ECOTOX\">" +
"	      <p><input type=\"text\" class=\"jtox-study-filter ui-input\" placeholder=\"Filter...\" /></p>" +
"	    </div>" +
"	    <div id=\"jtox-tox\" class=\"jtox-study-tab TOX\">" +
"	      <p><input type=\"text\" class=\"jtox-study-filter ui-input\" placeholder=\"Filter...\" /></p>" +
"	    </div>" +
"	  </div>" +
""; // end of #jtox-studies 

jToxKit.templates['composition-block']  = 
"    <div id=\"jtox-compoblock\" class=\"jtox-compoblock\">" +
"      <table class=\"dataTable composition-info jtox-font-small\">" +
"        <thead>" +
"          <tr><th>Composition name:</th><td class=\"data-field camelCase\" data-field=\"name\"> ? </td></tr>" +
"          <tr><th>Composition UUID:</th><td class=\"data-field\" data-field=\"uuid\"> ? </td></tr>" +
"          <tr><th>Purity of IUC Substance:</th><td class=\"data-field\" data-field=\"purity\"> ? </td></tr>" +
"        </thead>" +
"      </table>" +
"      <table class=\"substances-table\">" +
"        <thead>" +
"          <tr>" +
"            <th>Type</th>" +
"            <th>Name</th>" +
"            <th>EC No.</th>" +
"            <th>CAS No.</th>" +
"            <th>Typical concentration</th>" +
"            <th colspan=\"2\">Concentration ranges</th>" +
"          </tr>" +
"        </thead>" +
"      </table>" +
"    </div>" +
""; // end of #jtox-compoblock 

jToxKit.templates['one-study']  = 
"    <div id=\"jtox-study\" class=\"jtox-study jtox-foldable folded unloaded\">" +
"      <div class=\"jtox-study-title\"><p class=\"data-field\" data-field=\"title\">? (0)</p></div>" +
"      <table class=\"jtox-study-table\">" +
"        <thead>" +
"          <tr class=\"jtox-preheader\">" +
"            <th class=\"middle\" rowspan=\"2\">Name</th>" +
"            <th>Conditions</th>" +
"            <th colspan=\"2\">Effects</th>" +
"            <th>Interpretation</th>" +
"            <th colspan=\"3\">Protocol</th>" +
"          </tr>" +
"          <tr class=\"jtox-header\">" +
"            <th class=\"middle\">Endpoint</th>" +
"            <th class=\"middle\">Result</th>" +
"            <th class=\"middle\">Guideline</th>" +
"            <th class=\"middle\">Owner</th>" +
"            <th class=\"middle\">UUID</th>" +
"          </tr>" +
"        </thead>" +
"        <tbody></tbody>" +
"      </table>" +
"    </div>" +
""; // end of #jtox-study 
