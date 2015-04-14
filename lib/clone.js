function C(p){
    
    for(var n in p){
        if(typeof p[c] !== 'function' && p.hasOwnProperty(n)){
            if(Object.prototype.toString.call(p[n]) === '[object Array]')
                this[n] = p[n].concat([]);
            else
                this[n] = p[n];
        }
    }
}

function clone(obj){
    var a, opts;
    
    if(obj instanceof Date){
        a = new Date();
        a.setTime(obj.getTime());
        return a;
    }else if(obj.nodeType && 'cloneNode' in obj){
        return obj.cloneNode(true);
    }else if(obj instanceof RegExp){
        opts = '';
        opts += obj.ignorecase ? 'i' : '';
        opts += obj.global ? 'g' : '';
        opts += obj.multiline ? 'm' : '';
        opts += obj.sticky ? 'y' : '';
        opts += obj.unicode ? 'u' : '';
        return new RegExp(obj.source, opts);
    }
    
    C.prototype = Object.create(obj);
    C.prototype.constructor = C;
    a = new C(obj);
    return a;
}

module.exports = clone;
