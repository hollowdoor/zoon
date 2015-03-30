var factory = require('./zoon.factory.js');

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
