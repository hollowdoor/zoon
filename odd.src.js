(function(){
"use strict";

var odd = {};

odd.factory = require('./odd.factory.js');
odd.signal = require('./odd.signal.js');

var type =  function(obj){
    var __type = typeof obj;
    if(__type === 'object')
        return Object.prototype.toString.call(obj).slice('[object '.length, -1).toLowerCase();
    return __type;
};

odd.type = type;



function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

odd.uuid = generateUUID;

odd.listRange = function(start, end){
    var list = [], i = start;
    
    for(; i<end; i++){
        list.push(i);
    }
    return list;
};


var state = odd.factory({
    constructor: function(context){
        this.pool = {};
        this.context = context;
    },
    add: function(name, obj){
        this.pool[name] = this.pool[name] || {};
        for(var n in obj)
            this.pool[name][n] = obj[n];
        return this;
    },
    to: function(name){
        if(this.context === null){
            throw new TypeError('odd.state Error: no state.context to set state on.');
        }
        
        var _state = this.pool[name];
        
        for(var n in _state){
            this.context[n] = _state[n];
        }
        return true;
    },
    fetch: function(name, file, useNow){
        
        useNow = useNow === undefined ? true : useNow;
        if(this.pool[name]){
            this.to(name);
            return;
        }
        
        this.pool[name] = state.request(file);
        if(useNow)
            this.to(name);
        return this;
    },
    addTo: function(context){
        var _state = state(context),
            pool = this.pool;
        
        for(var n in pool){
            _state.pool[n] = {};
            for(var nn in pool[n])
                _state.pool[n][nn] = pool[n][nn];
        }
        return _state;
    }
});

state.request = function(name){
    var text = odd.request(name, {async: false});
    
    var fetched,
        state = {};
    
    if(text === null)
        return null;
    
    try{
        fetched = new Function('state', text + '\n return state;');
        return fetched.call(null, state);
        
    }catch(e){
        console.log(e.message);
        return null;
    }
};

odd.state = state;


function request(name, options, cb){
    
    if(cb === undefined && typeof options === 'function'){
        cb = options;
        options = {};
    }
    
    options.async = options.async === undefined ? true : false;
    options.context = options.context || null;
    
    var req,
        response = {
            name: name,
        };
    
    if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 6 and older
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    req.open('GET', name, options.async);
    req.send(null);
    
    
    
    if(options.async){
    
        req.onreadystatechange = function(){
            response.status = req.status;
            if(req.readyState === 4){
                if(req.status === 200){
                    cb.call(options.context, null, req.responseText);
                }else{
                    cb.call(options.context, new Error('Request Error: status code '+req.status), null);
                }
            }
        };
    }else{
        var error = req.status !== 200 ? new Error('Request Error: status code '+req.status) : null;
        response.status = req.status;
        if(cb !== undefined){
            cb.call(options.context, error, req.responseText);
        }else{
            if(error !== null){
                throw error;
            }else{
                return req.responseText;
            }
        }
    }
    
}

odd.request = request;
//create a module and/or a global window variable
if(!!module)
    module.exports = odd;
if(window && !window.odd)
    window.odd = odd;

})();
