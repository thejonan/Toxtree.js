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
  
    $('.' + filter, root).each(function (i) { processFn($(this)[0], json); } );
  
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
      return '';
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
        if (tabs[i] == null)
          continue;
          
        if (!$(tabs[i]).hasClass('lock-height') && tabs[i].style.height != '')
          tabs[i].style.height = "auto";

        if (tabs[i].offsetHeight > height)
          height = tabs[i].offsetHeight;
      }
      
      if (height == 0)
        break;
        
      for (i = 0;i < tabs.length ; ++i) {
        if (tabs[i] != null) {
          if (tabs[i].offsetHeight < height)
            $(tabs[i]).height(height);
            
          tabs[i] = tabs[i].nextElementSibling;
        }
      }
    }
  },
  
  addParameter: function (url, param) {
    return url + (url.indexOf('?') > 0 ? "&" : "?") + param;
  },
  
  makeURL: function(path) {
    var a =  document.createElement('a');
    a.href = path;
    return a.protocol + "//" + a.hostname + (a.port.length > 0 ? ":" : '') + a.port + a.pathname.replace(/^([^\/])/,'/$1');
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
