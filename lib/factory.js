if (!Object.create) {Object.create = function (o) {if (arguments.length > 1) {throw new Error("Object.create implementation only accepts the first parameter.");}function F() {}F.prototype = o;return new F();};}
function isNative(obj){
    //Is there a function?
    //You may throw an exception instead if you want only functions to get in here.
    
    if(typeof obj === 'function'){
        //Check does this prototype appear as an object?
        //Most natives will not have a prototype of [object Object]
        //If not an [object Object] just skip to true.
        if(Object.prototype.toString.call(obj.prototype) === '[object Object]'){
            //Prototype was an object, but is the function Object?
            //If it's not Object it is not native.
            //This only fails if the *Object()* function is assigned to prototype.constructor, or
            //*Object()* function is assigned to the prototype, but
            //why you wanna do that?
            if(String(obj.prototype.constructor) !== String(Object.prototype.constructor)){
                return false;
            }
        }
    }
    return true;
}

var merge = function(dest, src){
    
    for(var n in src)
        dest[n] = src[n];
    return dest;
};

/**
 * Produce unique extendable object instances.
 * @function
 * @param {Object} p - A prototype.
 * @param {Object} o - Default properties, and methods.
 * @member {Function} props.constructor - A constructor function for your object.
 * Here you go https://medium.com/javascript-scene/the-two-pillars-of-javascript-ee6f3281e7f3
 */
 
module.exports = function(p, o){
    
    if(typeof o === 'undefined'){
        o = p;
        p = {};
    }
    
    var c,
        props = {},
        _static = null;
    
    
    if(typeof p === "function"){
        _static = p;
        c = p;
        p = p.prototype;
    }
    
    for(var n in p){
        if(typeof p[n] !== 'function'){
            props[n] = p[n];
        }
    }
    
    o = o || {};
    p = Object.create(p);
    
    if(!isNative(o.constructor)){
        
        c = o.constructor;
        delete o.constructor;
    }
    
    o = merge(p, o);
    
    var C = function(a){
        
        //merge(this, o);
        merge(this, props);
        
        c.apply(this, a);
    };
    
    C.prototype = o;
    C.prototype.constructor = C;
    
    var F = function(){
        
        var a = Array.prototype.slice.call(arguments);
        
        return new C(a);
    };
    
    F.prototype = Object.create(o);
    F.prototype.constructor = c;
    
    return F;
};

//module.exports = factory;
