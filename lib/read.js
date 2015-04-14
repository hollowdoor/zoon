var fs = 0,
    request;
    
try{ fs = require('fs'); }catch(e){};

module.exports = fs.readFile && fs.readFileSync ?
    
function(name, options, cb){
    var opts = readOptions(options, cb),
        result;
    
    if(!opts.async){
        result = fs.readFileSync(name, {encoding: 'utf8'});
        if(opts.cb)
            opts.cb(null, result);
        return result;
        
    }
    
    fs.readFile(name, {encoding: 'utf8'}, function(err, str){
        
        opts.cb(err, str);
    });
}:

function(name, options, cb){
    var opts = readOptions(options, cb),
        req;
    
    if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 6 and older
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if(!opts.async){
        req.open('GET', name, false);
        req.send();
        if(opts.cb)
            opts.cb(null, req.responseText);
        return req.responseText;
    }
    
    req.open('GET', name);
    req.send();
    req.onreadystatechange = function(){
        if(req.readyState === 4){
            if(req.status === 200){
                opts.cb(null, req.responseText);
            }else{
                opts.cb(new Error('zoon.read ajax request status '+req.status));
            }
        }
    };
};

function readOptions(a1, a2){
    var options = {cb: 0};
    
    if(typeof a1 === 'undefined' && typeof a2 === 'undefined')
        return {async: false};
    
    if(typeof a1 === 'function'){
        return {cb: a1, async: true};
    }else if(Object.prototype.toString.call(a1) === '[object Object]'){
        
        for(var n in a1)
            options[n] = a1[n];
        if(typeof a2 === 'function')
            options.cb = a2;
        return options;
    }
}
