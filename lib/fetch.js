var read = require('./read');

var proc = {
    exec: function(name, str, cb){
        var parts = name.split('.'),
            ext = parts[parts.length - 1];
        if(proc[ext])
            proc[ext](name, str, cb);
        else
            proc.text(name, str, cb);
    },
    json: function(name, str, cb){
        var obj = str;
        try{
            obj = JSON.parse(str);
            cb(null, obj);
        }catch(e){
            cb(new Error('zoan.fetch json error '+e.message), str);
        }
    },
    text: function(name, str, cb){
        cb(null, str);
    }
};

proc.txt = proc.text;

var fetch = function(name, cb){
    read(name, function(err, str){
        if(err)
            return cb(err);
        proc.exec(name, str, cb);
    });
};

module.exports.fetch = fetch;
