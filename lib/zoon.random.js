function rand(seed, settings){
    var self = this;
    
    
    this.init(seed, settings);
    
    /*var operation = function(self, fn){
        //perform late interpolation in fn
        var interpolation = self.interpolation;
        self.interpolation = null;
        fn.call(self, interplation);
        self.interpolation = interpolation;
    };*/
    
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
    }
};



rand.prototype.init = function(seed, settings){
    
    settings = settings || {};
    
    if(seed === undefined)
        seed = Date.now();
    
    if(seed === 0)
        seed = 1;
    
    this.savedSeed = seed;
    this._algo = settings.algo || rand.algos.XORSHIFT;
    this._interpolation = settings.interpolation || null;
    this._noise = settings.noise || null;
    
    if(typeof seed === 'string'){
        var hash = rand.hash(seed);
        seed = parseInt(hash);
    }
    
    this.seed = seed;
};

rand.prototype.random = function(){
    
    return this._algo();
};


rand.prototype.pick = function(array){
    return array[this.range.integer(0, array.length-1)];
};


var r = new rand('hello world and universe', {
    /*interpolation: function(x){
        return x + 0.2;
    },*/
    noise: new rand('hi!', {
        noise: new rand('bye')
    })
}),//246354242),
    j = 100;
/*
while(--j){
    console.log(r.range.float(2, 5));
}*/
/*
while(--j){
    console.log('random = '+r.random());
}*/

while(--j){
    console.log(r.range.integer(2, 100)+' = rand int');
}
/*
var arr = ['one', 'two', 'three', 'four'];
while(--j)
    console.log(r.pick(arr));
*/
function transform(symbol){
    var str = ' !"#$%&\'()*+,-./';
    str += '0123456789';
    str += ':;<=>?@';
    str += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    str += '[\\]^_`';
    str += 'abcdefghijkjmnopqrstuvwxyz';
    str += '{|}~';
    return str.indexOf(symbol)+32;
    
}

module.exports = rand;
