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
var signal = factory({
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
            toRemove = [],
            listeners = this.listeners;
        
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
