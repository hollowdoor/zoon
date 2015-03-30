var request = (function(){
    var fs = null, http = null;
    
    try{ fs = require('fs'); }catch(e){ browser = true; };
    try{ http = require('http'); }catch(e){ http = require('http-browserify'); };
    
    function toJSON(str){
        
        try{
            return JSON.parse(str);
        }catch(e){
            return false;
        }
    };
    
    var requestJSON = function(res, cb){
        var body = '';
        if(res.statusCode === 200){
            res.on('data', function(chunk){
                body += chunk.toString();
            });
            
            res.on('end', function(){
                var obj = toJSON(body);
                if(obj)
                    cb(null, body);
                else
                    cb(new Error('JSON parse error'));
            });
        }else{
            cb(new Error('status code '+res.statusCode));
        }
    };
    
    return function(name, cb){
        
        var makeRequest = function(res){
            requestJSON(res, cb);
        };
        
        var read = function(err, str){
            if(err){
                return cb(err);
            }
            
            var obj = toJSON(str);
            if(obj)
                cb(null, obj);
            else
                cb(new Error('JSON parse error'));
        };
        
        if(fs){
            fs.exists(name, function(exists){
                if(exists){
                    fs.readFile(name, 'utf8', read);
                }else{
                    http.get(name, makeRequest);
                }
            });
            
        }else{
            http.get(name, makeRequest);
        }
    };
    
})();

module.exports = request;
