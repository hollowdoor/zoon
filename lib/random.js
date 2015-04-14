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
