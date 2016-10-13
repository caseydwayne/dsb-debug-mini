(function(){
  
  /*
   * debug-lite test
   */
  
  var debug = require('./index'),
          o = {}, //storage object
         n1 = 'object property method',
         n2 = 'second property method',         
          p = 'ma',
          x = 'gic',
          b = ' bullet',
         e1 = 'magic',
         e2 = 'magic'+b, //"magic bullet"
         //a generic function to access directly
         fn = function(s){
           var s = s || this;
           return s+x;
         };
         
  //fill a source object to pass to debug-lite
  o[n1] = fn;
  o[n2] = function(){
    var z = o[n1](p);
    return z + b;
  };
  
  //quick test a generic name, function, param(s), expects
  debug( 'method quick test', fn, p, e1, true );
  
  //access source object under object[name1]
  debug( n1, o, p, e1, true );
  
  //access source object under object[name2]
  debug( n2, o, p, e2, true );
  
  //complete debug manually
  var result = debug.complete();
  
  //return the result object provided by complete
  return result;
       
}());