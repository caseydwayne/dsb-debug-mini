module.exports = (function(){
/*---------------------------------------------------------------------*/  
  
  var debug = require('./index');

/*---------------------------------------------------------------------*/

  var n = 'test',
      t = true;
  
/***********************************************************************/
      
  debug.test( n, t, t );

  n += ' with boolean arg and undefined expect';
  debug.test( n, t );
  
/*---------------------------------------------------------------------*/
  
  var x = 'method',
      //method as 2nd param with method's ( fn, test, name ) accepter
      y = function( fn, test, name ){ test( 'inner '+name, fn(), x ); },
      //the method to pass into y() as fn
      z = function(){ return x; };
      
  // z should return x, processed through method test y()
  debug.method( x, y, z );    
  
/***********************************************************************/  
  
  return debug.complete();
  
/*---------------------------------------------------------------------*/
}());