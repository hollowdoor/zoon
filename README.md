Don't use this yet.

Zoon.js
=======

npm install zoon
```javascript
var zoon = require('zoon');
```

zoon.factory([, object, prototype, function] object, optional object)

Create factory functions.

First argument can be a literal object, prototype, or a function with a prototype. The second optional argument can be a literal object.

Returns a factory function that returns new instances.

```javascript
var f = zoon.factory({});

var f = zoon.factory({}, {});

function func(){}

var f = zoon.factory(func.prototype, {});

var f = zoon.factory(func, {});

var f = zoon.factory(func.prototype, {
    constructor: function(){
        func.call(this);
    }
});
```

zoon.signal()

zoon.state()

zoon.random([,number, string] seed, obtional settings object)
