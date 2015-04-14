(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
"use strict";
/*The MIT License (MIT)

Copyright (c) 2014 Quenting Engles

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

//set up
//git remote add origin https://github.com/hollowdoor/zoan.git
//---
//iteration
//git push -u origin master
//npm publish
//---
//settup for testing
//cd ./test
//browserify ../index.js -o zoan.js

var x = {};

x.factory = require('./lib/factory');
x.clone = require('./lib/clone');
x.signal = require('./lib/signal');
x.state = require('./lib/state');
x.prng = require('./lib/random');

if(!!module)
    module.exports = x;
if(!!window)
    window.zoon = x;


})();

},{"./lib/clone":2,"./lib/factory":3,"./lib/random":4,"./lib/signal":6,"./lib/state":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var factory = require('./factory');

var rand = {};
rand.hash = function(str) {
    //http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

rand.sciToDecimalString = function(num){
    var n = num.toString(),
        parts = n.split("e+"),
        first = parts[0].replace('.', ""),
        zeroes = parseInt(parts[1], 10) - (first.length - 1);
    
    for(var i = 0; i < zeroes; i++)
        first += "0";
        
    return first;
};

rand.toFraction = function(num){
    
    if(!isNaN(num)){
        num = num.toString();
    }
    
    var x = '0.'+num;
    
    
    if(x.indexOf('0.00000001') === 0){
        x = 0;
    }else if(x.indexOf('0.99999998') === 0){
        x = 1;
    }else{
        x = x.replace(/0+$/, '');
        x = parseFloat(x);
    }
    
    return x;
};

rand.reverseNumber = function(num){
    /*if(x < 0)
            x = x * -1;*/
    if(num.toString().match(/e/) !== null)
        num = rand.sciToDecimalString(num);
    var x = num.toString().split('').reverse().join('');
    return parseInt(x);
};

rand.addNoise = function(x, inst){
    
    if(inst._noise !== null){
        if(typeof inst._noise === 'function'){
            x += parseInt(inst._noise(x).toString().split('.').join(''));
        }else if(inst._noise.random){
            x += parseInt(inst._noise.random().toString().split('.').join(''));
        }
    }
    return x;
};

function Random(seed, settings){
    settings = settings || {};
    
    if(seed === undefined)
        seed = Date.now();
    
    if(seed === 0)
        seed = 1;
    
    this.originalSeed = seed;
    this._noise = settings.noise || null;
    
    if(typeof seed === 'string'){
        var hash = rand.hash(seed);
        seed = parseInt(hash);
    }
    
    this.index = 0;
    this.savedSeed = seed;
    this.seed = seed;
}

Random.prototype.reset = function(){
    this.seed = this.savedSeed;
    this.index = 0;
};


var xorshift = factory(Random.prototype, {
    constructor: function(seed, settings){
        Random.call(this, seed, settings);
    },
    random: function(){
        var x = this.seed;
        
        x ^= (x >> 12);
        x ^= (x << 25);
        x ^= (x >> 27);
        
        
        this.seed = x;
        
        var w =  2685821657736338717 * x;
        
        x = rand.addNoise(x, this);
        
        x = rand.sciToDecimalString(w);
            
        x = rand.toFraction(x);
        
        this.index++;
        
        return x;
    }
});

function gcd(a, b){
    if ( ! b) {
        return a;
    }

    return gcd(b, a % b);
}

//Euclid's extended algorithm
//http://userpages.umbc.edu/~rcampbel/NumbThy/Class/Programming/JavaScript/
//http://pages.pacificcoast.net/~cazelais/euclid.html
//http://www-math.ucdenver.edu/~wcherowi/courses/m5410/exeucalg.html
function xgcd(a,b){
    var quot, a1=1, b1=0, a2=0, b2=1, aneg=1, bneg=1, result=new Array;
    if(a < 0) {a = -a; aneg=-1;};
    if(b < 0) {b = -b; bneg=-1;};
    if(b > a) {temp = a; a = b; b = temp;};
    while (true) {
        quot = -Math.floor(a / b);
        a %= b;
        a1 += quot*a2; b1 += quot*b2;
        if(a == 0) {result[0]=b*bneg; result[1]=a2; result[2]=b2; return result;};
        quot = -Math.floor(b / a);
        b %= a;
        a2 += quot*a1; b2 += quot*b1;
        if(b == 0) {result[0]=a*aneg; result[1]=a1; result[2]=b1; return result;};
    };
    return result;
}

var a = 11, //a - 1 should be divisible by m's prime factors
    c = 17, //m and c must be coprime;
    m = 25;
//http://stackoverflow.com/questions/17625232/custom-linear-congruential-generator-in-javascript
a=1103515245;
c=12345;
m=0x80000000;

var lcg = factory(Random.prototype, {
    constructor: function(seed, settings){
        Random.call(this, seed, settings);
    },
    next: function(){
        var x = this.seed;
        
        x = (a * x + c) % m;
        this.seed = x;
        this.index++;
        x = rand.addNoise(x, this);
        return x;
    },
    last: function(){
        var temp = xgcd(a, m),
            ainverse = temp[2], x = this.seed, x2 = this.seed;
        
        x = ainverse * (x - c) % m;
        x = parseInt(x);
        this.seed = x;
        this.index--;
        
        if(x < 0){ x = rand.addNoise(x, this); return x + m; }
        x = rand.addNoise(x, this);
        return x;
    }
});
/*
function rand(seed, settings){
    var self = this;
    
    
    this.init(seed, settings);
    
    
    
    var range = {
        float:  function(min, max){
            var x = self.random();
            return x * (max - min) + min;
        },
        integer: function(min, max){
            var x = self.range.float(min, max + 1);
            return Math.floor(x);
        },
        pick: function(array){
            return array[range.integer(0, arrar.length-1)];
        }
    };
    
    var list = {
        float: function(len, min, max){
            min = min || false;
            max = max || false;
            var arr = [];
            if(!min){
                for(var i=0; i<len; i++){
                    arr.push(self.random());
                }
            }else if(max){
                for(var i=0; i<len; i++){
                    arr.push(self.range.float(min, max));
                }
            }
        },
        integer: function(len, min, max){
            var arr = [];
            if(!min){
                for(var i=0; i<len; i++){
                    arr.push(Math.floor(self.random()));
                }
            }else if(max){
                for(var i=0; i<len; i++){
                    arr.push(self.integer.float(min, max));
                }
            }
        }
    };
    
    this.range = range;
    this.list = list;
    
}

rand.hash = function(str) {
    //http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

rand.sciToDecimalString = function(num){
    var n = num.toString(),
        parts = n.split("e+"),
        first = parts[0].replace('.', ""),
        zeroes = parseInt(parts[1], 10) - (first.length - 1);
    
    for(var i = 0; i < zeroes; i++)
        first += "0";
        
    return first;
};

rand.toFraction = function(num){
    
    if(!isNaN(num)){
        num = num.toString();
    }
    
    var x = '0.'+num;
    
    
    if(x.indexOf('0.00000001') === 0){
        x = 0;
    }else if(x.indexOf('0.99999998') === 0){
        x = 1;
    }else{
        x = x.replace(/0+$/, '');
        x = parseFloat(x);
    }
    
    return x;
};

rand.reverseNumber = function(num){
    
    if(num.toString().match(/e/) !== null)
        num = rand.sciToDecimalString(num);
    var x = num.toString().split('').reverse().join('');
    return parseInt(x);
};

rand.addNoise = function(x, inst){
    
    if(inst._noise !== null){
        if(typeof inst._noise === 'function'){
            x += parseInt(inst._noise(x).toString().split('.').join(''));
        }else if(inst._noise.random){
            x += parseInt(inst._noise.random().toString().split('.').join(''));
        }
    }
    return x;
};*/

rand.algos = {
    XORSHIFT: function(){
        //xorshift prng
        var x = this.seed;
        
        x ^= (x >> 12);
        x ^= (x << 25);
        x ^= (x >> 27);
        
        
        this.seed = x;
        
        var w =  2685821657736338717 * x;
        
        x = rand.addNoise(x, this);
        
        x = rand.sciToDecimalString(w);
            
        x = rand.toFraction(x);
        
        if(this._interpolation !== null)
            x = this._interpolation(x);
        
        return x;
    },
    HASHSHIFTPLUS: function(){
        
        var x = rand.hash(++this.seed);
        x ^= (x >> 7);
        x ^= (x << 2);
        x ^= (x >> 3);
        return rand.toFraction(x);
    },
    HASHSHIFTMINUS: function(){
        
        var x = rand.hash(--this.seed);
        x ^= (x >> 7);
        x ^= (x << 2);
        x ^= (x >> 3);
        return rand.toFraction(x);
    }
};


/*
function xgcd(a,b){ 
    var x, y, d;
    if (b == 0){ return [1, 0, a] }
    else{
        temp = xgcd(b, a % b)
        x = temp[0]
        y = temp[1]
        d = temp[2]
        return [y, x-y*Math.floor(a/b), d]
    }
}*/
/*
function xgcd(a, b){
    var x, y, d, temp;
    if(b === 0){ return {y: 1, x: 0, d: a}; }
    else{
        temp = xgcd(b, a % b);
        return {y: temp.y, x: temp.x-temp.y*Math.floor(a/b), d: temp.d};
    }
}*/



/*
function transform(symbol){
    var str = ' !"#$%&\'()*+,-./';
    str += '0123456789';
    str += ':;<=>?@';
    str += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    str += '[\\]^_`';
    str += 'abcdefghijkjmnopqrstuvwxyz';
    str += '{|}~';
    return str.indexOf(symbol)+32;
    
}*/

module.exports = {
    xorshift: xorshift,
    lcg: lcg
};

},{"./factory":3}],5:[function(require,module,exports){
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

},{"fs":8}],6:[function(require,module,exports){
var factory = require('./factory.js');
/**
 *Signal listeners talk to any object.
 *Verses events which have listeners that talk only to their object, and the current scope.
 *signal_instance.add(fn, intsance) where instance is talked to.
 *signal_instance.dispatch([,args]) where input can be communcated to the object.
 *
 *Can suffice to serve these patterns
 *mixins (up, and down compunication between parent, and child without sharing methods),
 *compostion (where an object has methods but I don't want to replace them),
 *pubsub/observer, or events (this is obvious),
 *singelton (use closure to talk to the god object),
 *facade (signals talk to a compositioned child without setting the child on the parent)
 *decorators (change objects passed as arguments to the dispatch method)
 *multiplex decorators (change methods of passed objects in different listeners from dispatch)
 *flyweight (just like the singelton)
 *proxy (everything can be proxied)
 *command (commander dispatches signals in it's methods to client, invoker, and receiver)
 *potentially any pattern can be boosted by signals
 *also useful for stack management
 */
var signal = factory({}, {
    constructor: function(){
        this.listeners = [];
    },
    add: function(listener, context, canDestroy){
        signal.addListener(this, listener, false, context, canDestroy);
    },
    once: function(fn, context){
        signal.addListener(this, fn, true, context);
    },
    dispatch: function(){
        
        var a = Array.prototype.slice.call(arguments),
            current,
            toRemove = [];
        
        for(var i=0; i<listeners.length; i++){
            current = listeners[i];
            current.execute(a);
            
            if(current.isOnce){
                toRemove.push(current);
            }
        }
        
        if(toRemove.length){
            for(i=0; i<toRemove.length; i++){
                signal.remove(toRemove[i].listener, toRemove[i].context);
            }
        }
    },
    remove: function(listener, context){
        var index = signal.indexOfListener(this, listener, context);
        
        if(index !== -1 && this.listeners[index].canDestroy){
            this.listeners.splice(index - 1, 1);
            return true;
        }
        return false;
    },
    dispose: function(){
        for(var n in this){
            if(typeof this[n] === 'function')
                this[n] = function(){};
            else
                delete this[n];
        }
    },
    removeAll: function(){
        var keep = [],
            listeners = this.listeners;
        for(var i=0; i<listeners.length; i++){
            if(!listeners[i].canDestroy)
                keep.push(listeners[i]);
        }
        
        this.listeners = keep;
    }
});


signal.addListener = function(__signal, listener, isOnce, context, canDestroy){
    context = context || null;
    if(typeof canDestroy !== 'boolean')
        canDestroy = true;
    
    __signal.listeners.push({
        listener: listener,
        isOnce: isOnce,
        canDestroy: canDestroy,
        execute: function(a){
            listener.apply(context, a);
        }
    });
};

signal.indexOfListener = function(__signal, listener, context){
    context = context || null;
    var current,
        listeners = __signal.listeners;
    
    for(var i=0; i<listeners.length; i++){
        current = listeners[i];
        if(current.listener === listener && current.context === context)
            return i;
    }
    
    return -1;
};

module.exports = signal;

},{"./factory.js":3}],7:[function(require,module,exports){
var factory = require('./factory'),
    read = require('./read');

var state = factory({
    constructor: function(context){
        this.pool = {};
        this.context = context;
        this.onTo = {};
        this.onToOnce = {};
    },
    add: function(name, obj){
        this.pool[name] = obj;
        return this;
    },
    on: function(name, fn){
        if(!this.onTo[name]){
            this.onTo = [];
        }
        this.onTo[name].push(fn);
        return this;
    },
    once: function(name, fn){
        if(!this.onToOnce[name]){
            this.onToOnce = [];
        }
        this.onToOnce[name].push(fn);
        return this;
    },
    to: function(name){
        if(this.context === null){
            throw new TypeError('odd.state Error: no state.context to set state on.');
        }
        
        var _state = this.pool[name],
            listeners = this.onTo[name] || [],
            onceList = this.onToOnce[name] || [];
        
        for(var n in _state){
            this.context[n] = _state[n];
        }
        
        for(var i=0; i<onceList.length; i++){
            onceList[i].apply(this.context, arguments);
        }
        
        this.onToOnce[name] = [];
        
        for(var i=0; i<listeners.length; i++){
            listeners[i].call(this.context, arguments);
        }
        
        return true;
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

state.fetch = function(name){
    var result = read(name);
    
    var obj = {}, fn;
    try{
        fn = new Function('state', result + '\nreturn state;');
        return fn.call(obj, obj);
        
    }catch(e){
        throw new Error('zoan state fetch error '+e.message);
    }
};


module.exports = state;

},{"./factory":3,"./read":5}],8:[function(require,module,exports){

},{}]},{},[1]);
