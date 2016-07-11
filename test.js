(function(){
  
  var Debugger = require('./src/main');
  var debug = Debugger.create('dsb-debugger');
  var method = debug.method.bind(debug);
  
  method( 'test', function( fn, test, name ){
    var t = fn('I am a generic test');
    test( 'I am fired from the bound debug.test method', true, true );  
  });

  var _method = function(){ return 'yes'; };
  method( '_method', function( fn, test, name ){
    test( 'manually passing a _method', fn(), 'yes' );  
  }, _method );

    
}());