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
