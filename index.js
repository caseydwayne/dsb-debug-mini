module.exports = (function(DEBUG){
/*----------------------------------------------------------------------------*/

  var ns = 'debug-mini';

  ///these 2 are part of a larger software
  //var chalk = require('dsb-chalk');
  //var compare = require('dsb-compare');

  var chalk = require('chalk');

  ///circular, not playing nicely with mini
  var type = require('dsb-typecheck');

  //var type = function(x,a){ return x instanceof Array ? 'array' : typeof x === a; };

  ///decided against adding debug to mini for now
  //var load = require('dsb-attach-lite');

/******************************************************************************/

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

/*----------------------------------------------------------------------------*/

  var debug = {

/*----------------------------------------------------------------------------*/

    verdict: false,
    fail: [],
    pass: 0,
    all: 0,
    reporter: console.log,

/*----------------------------------------------------------------------------*/

    /*
     * @method test
     * accepts the standard name, results, expects. adds to totals and reports findings
     */

    test: function( n, r, e ){
      if( DEBUG > 2 ) console.log( ns, 'received', arguments );
      if( type( r, 'object' ) )
        throw new Error ( ns+' does not accept objects. use the full debug module' );
      debug.all++;
      if( type( e, 'undefined' ) ) e = true;
      //var x = compare( r, e );
      //since not using compare...
      if( type( r, 'array' ) && type( e, 'array' ) ){
        r = r.toString();
        e = e.toString();
      }
      var x = ( r === e );
      if( DEBUG ) console.log('Test Results:\n',{
        name: n, result: r, expect: e, passed: x
      });
      var failed;
      if( x ) debug.pass++;
      else {
        failed = true;
        debug.fail.push( n );
      }
      var v = '['+(x ? 'pass' : 'fail')+']';
      var c = ( x ? 'green' : 'red' );
      v = chalk.bold[c]( v );
      var fs = chalk['gray']( '-- Result was '+r+', expected '+e );
      debug.reporter( '\n', v, n, failed ? fs : '', '\n' );
    },

/*----------------------------------------------------------------------------*/

    /*
     * @method method
     * accepts a name, function, and, when fn param is object, src can be a method in that object.
     */

    method: function( name, fn, src ){

      var mn = 'debug.method';

      //if( DEBUG ) console.log( mn, 'received', arguments );

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
        if( ns ) n += '( '+a.join(', ')+' )';
        var r = _fn.apply( null, a );
        return self.test( n, r, e );
      };

      return fn( _fn, _test, name );

    },

/*----------------------------------------------------------------------------*/

    question: function(q,a){
      debug.reporter( q, ( a ? 'yes' : 'no' ) );
    },

/*----------------------------------------------------------------------------*/

    complete: function(){

      var _p = debug.pass,
          _a = debug.all,
           p = debug.verdict = ( _p === _a );
           b = '\n - ';

      if( DEBUG ) console.log( _p, 'of', _a, 'tests passed.' );

      debug.reporter(
        '\n' +
        (
          p
          ? 'ALL TESTS '+chalk.bold.green( 'PASSED' )
          : 'something '+chalk.bold.red('failed...')+b+(debug.fail).join(b)
        ) + '\n\n'
      );

      return debug;

    },

/*----------------------------------------------------------------------------*/

    name: 'generic debug-mini',

    create: function(name){
      if( typeof name === 'string' ) debug.name = name;
      debug.reporter( 'Starting debug-mini for module "' + name + '"' + "\n" );
      return debug;
    }

/*----------------------------------------------------------------------------*

    load: function(mod){ return load( mod+'/test' ); },
    auto: function(dir){
      var pkg = load( dir+'/package.json' );
      debug.create( pkg.name );
      debug.source = load( dir+'/index' );
      return debug;
    }

/*----------------------------------------------------------------------------*/

  }; //end debug-mini

/******************************************************************************/

  return debug;

/*----------------------------------------------------------------------------*/
}(0));
