var factory = require('./zoon.factory');
var state = factory({
    constructor: function(context){
        this.pool = {};
        this.context = context;
    },
    add: function(name, obj){
        this.pool[name] = this.pool[name] || {};
        for(var n in obj)
            this.pool[name][n] = obj[n];
        return this;
    },
    to: function(name){
        if(this.context === null){
            throw new TypeError('odd.state Error: no state.context to set state on.');
        }
        
        var _state = this.pool[name];
        
        for(var n in _state){
            this.context[n] = _state[n];
        }
        return true;
    },
    fetch: function(name, file, useNow){
        
        useNow = useNow === undefined ? true : useNow;
        if(this.pool[name]){
            this.to(name);
            return;
        }
        
        this.pool[name] = state.request(file);
        if(useNow)
            this.to(name);
        return this;
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

state.request = function(name){
    var text = odd.request(name, {async: false});
    
    var fetched,
        state = {};
    
    if(text === null)
        return null;
    
    try{
        fetched = new Function('state', text + '\n return state;');
        return fetched.call(null, state);
        
    }catch(e){
        console.log(e.message);
        return null;
    }
};

module.exports = state;
