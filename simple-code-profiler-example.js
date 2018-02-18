var timer = require('./simple-code-profiler')('example-profiler');
timer.start();
setTimeout(function(){
    timer.record('foo');
    setTimeout(function(){
        timer.record('bar', 'foo');
        timer.print();
    }, 1000);
}, 2000);