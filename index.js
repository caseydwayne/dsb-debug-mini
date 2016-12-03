module.exports = (function(DEBUG){
/*---------------------------------------------------------------------*/

  var ns = 'debug-mini';
 
  //these 2 are part of a larger software
    //var chalk = require('dsb-chalk');
    //var compare = require('dsb-compare');
    
  var chalk = require('chalk');
  //var toArray = require('dsb-to-array');
  var type = require('dsb-typecheck');
  
/***********************************************************************/

  /*
   * @module debug-mini
   * 
   * creates a miniture debugger, independent of dsb-debug, that
   * can be used in situations where dsb-debug would cause conflict
   * (mainly modules required by dsb-debug, preventing cyclical deps).
   * 
   * it mimics the core functionality of dsb-debug so it can still be 
   * used in dsb-diag diagnostic tests.
   * 
   * it is also used by open-source modules because dsb-debug 
   * is still closed source.
   */

/*---------------------------------------------------------------------*/

  var debug = {
    verdict: false,
    fail: [],
    pass: 0,
    all: 0,    
    reporter: console.log,
    test: function( n, r, e ){      
      if( DEBUG > 2 ) console.log( ns, 'received', arguments );
      debug.all++;      
      if( type( e, 'undefined' ) ) e = true;
      //var x = compare( r, e );
      var x = ( r === e );
      if( DEBUG ) console.log('Test Results:\n',{
        name: n, result: r, expect: e, passed: x
      });
      if( x ) this.pass++;
      else debug.fail.push( n );
      var v = '['+(x ? 'pass' : 'fail')+']';
      var c = (x?'green':'red');
      v = chalk.bold[c]( v );
      this.reporter( '\n', v, n, '\n' );
    },
    method: function( name, fn, src ){
      var mn = 'debug.method';
      if( DEBUG ) console.log( mn, 'received', arguments );      
      var DMR = function(x, i){
        return mn+' requires '+x+' as '+i+' parameter';
      };
      var SRC = 'a source method (or object with name as matching key to a method)';
      
      if( !type( name, 'string' ) )
          throw new Error( DMR( 'a name', '1st' ) );

      if( !type( fn, 'function' ) )
        throw new Error( DMR( 'a test_callback', '2nd' ) );

      var sfn = type( fn, 'function' );

      if( !sfn && !type( src, 'object' ) )
        throw new Error( DMR( SRC, '3nd' ) );        

      var _fn;
      if( sfn ) _fn = src;
      else {
        if( type( src[name], 'function' ) ) _fn = src[name];
        else throw new Error( DMR( SRC, '3nd' ) );        
      } 
      
      var self = debug;
      var _test = function( n, a, e ){
        var r,
           ns = type( n, 'string' ),
           aa = type( a, 'array' ),
           ib = type( a, 'boolean' );
        if( !ns ){ e = a; a = n; n = name; }        
        if( ib ){
          r = a;
          return self.test( n, r, e );        
        }
        if( !aa ) a = [a];
        if( ns ) n += '('+a.join(', ')+')';
        var r = _fn.apply( null, a );
        return self.test( n, r, e );        
      };
      
      return fn( _fn, _test, name );
      
    },
    question: function(q,a){ 
      console.log( q, ( a ? 'yes' : 'no' ) );
    },
    complete: function(){
      var p = this.verdict = ( this.pass === this.all );
      var b = '\n - ';
      this.reporter( 
        p ? 'ALL TESTS PASSED' 
          : 'something failed...'+b+(this.fail).join(b)
      );
    },
    name: 'generic debug-mini',
    create: function(name){
      if( typeof name === 'string' ) this.name = name;
      return this;
    }
  };
 
/*---------------------------------------------------------------------*/

  return debug;

/*---------------------------------------------------------------------*/  
}(0));