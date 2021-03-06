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
