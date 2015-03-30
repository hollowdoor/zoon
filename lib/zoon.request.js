
var request = (function(){
    var browser = false, fs = null, http = null;
    
    try{ fs = require('fs'); }catch(e){ browser = true; };
    try{ http = require('http'); }catch(e){ http = require('http-browserify'); };
    
    var req = function(name, cb){
        var req = http.get({path: name}, cb);
        req.end();
    };
    
    return function(name, cb){
        if(fs){
            fs.exists(name, function(exists){
                if(exists){
                    fs.readFile(name, 'utf8', cb);
                }else{
                    req(name, cb);
                }
            });
            
        }else{
            req(name, cb);
        }
    };
    
    var getArgs = function(options, cb){
        if(cb === undefined && typeof options === 'function'){
            cb = options;
            options = {};
        }
        
        options.async = options.async === undefined ? true : false;
        options.context = options.context || null;
        options.cb = cb;
        
        return options;
    };
    
    return !browser ?
    
    function(name, options, cb){
        options = getArgs(options, cb);
        
        if(options.async){
            fs.exists(name, function(exists){
                if(exists){
                    fs.readFile(name, 'utf8', options.cb);
                }
            });
        }else{
            if(fs.existsSync(name)){
                return fs.readFileSync(name, 'utf8');
            }else{
                http.get();
            }
        }
    } :
    function(name, options, cb){
        
        options = getArgs(options, cb);
        
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
                        options.cb.call(options.context, null, req.responseText);
                    }else{
                        options.cb.call(options.context, new Error('Request Error: status code '+req.status), null);
                    }
                }
            };
        }else{
            var error = req.status !== 200 ? new Error('Request Error: status code '+req.status) : null;
            response.status = req.status;
            if(options.cb !== undefined){
                options.cb.call(options.context, error, req.responseText);
            }else{
                if(error !== null){
                    throw error;
                }else{
                    return req.responseText;
                }
            }
        }
        
    };
    
})();

module.exports = request;
