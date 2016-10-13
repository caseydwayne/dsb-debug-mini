module.exports = (function(){
  
  var utils = require('dsb-utils');
  
  /* @class Debugger
   * the debugger offers easy testing for JS software applications
   * @requires ../main.js
   */ 

  var Debugger = function Debugger( name, options ){
    
    
    /* 
     * create a stable 'this' reference for Debugger
     */
    
    var d = this;
    
        
    /*
     * resolve name, options vs options only
     */
    
    if( typeof name === 'object' ){
      options = name;
      name = options.name;      
    }
    
    
    /* 
     * @property name     
     */
    
    d.name = name || 'Debugger',

    
    /*
     * @property defaults     
     */
  
    d.defaults = {
      classic: true,
      gui: false,
      delay: false,
      expandAll: false,
      autostart: true
    },
    
    
    /*
     * @property settings
     */
  
    d.settings = options ? utils.merge( d.defaults, options ) : d.defaults, //fix with merge


    /*
     * @property verdict
     * we'll set it to true if all tests pass
     */
    
    d.verdict = false;
    
    
    /*
     * @property flags
     * the text and appropriate chalks for each flag
     */
    
    d.flags = {
      pass: {
        text: 'Test Passed!',
        chalks: 'green'
      },
      fail: {
        text: 'Test failed..',
        chalks: 'red'
      },
      warn: {
        text: 'Test passed [ Warning! ]:',
        chalks: 'yellow'
      }
    };
    
    
    /* 
     * @property presets
     * a collection of preset primitives to use for testing
     */
    
    d.presets = require('./presets');      
    require('./types').call(d);
  
  
    var trim = function (s) {
      var x = /^[\n|\r] +?| +?[\n|\r]$/g;
      var y = /^ +| +$/g;
      return (s||this).replace( x, '' );  
    };  
  
    /* @method log
     * the default logging method
     */  
  
    d.log = function(){
      var a = utils.toArray(arguments),
          f = a.shift();
      if( typeof f === 'string' ) f = trim(f);
      a = [f].concat(a);      
      utils.log.apply( null, a );
    },
      





    /*******************************/

    d.group = {};
    require('./group').call( d.group );

    /*******************************/
    
    /*******************************/

    d.tests = {};
    require('./tests').call( d.tests );

    /*******************************/

    /* @method processing
     * moves test from pending to processing
     * @note currently inactive
     */ 

    d.processing = function(id){
      var d = d.tests._move(id,'pending','processing');
    },
    
    
    d.classic = function(args){
      var a = utils.toArray( arguments );
      return utils.log.apply( null, a );
    },
    
    
    /*
     * d.reporter by proxy
     */
  
    d.reporter = false,

     
    /*
     * @method format
     * formats the string for log
     */
  
    d.format = function(test){
      var l = '\n\r';
      var f = test.flag;      
      var m = d.flags[f]; //prints a string for log
      var n = m.text;
      var o = ' ';
      if( f !== 'pass' || d.settings.expandAll ){
        utils.each( test, function(v,k){
          o +=  k + ': ' + v;
        });
      }
      else {
        o += test.name;
      }
      return n+o;
    },
    
    /*
     * @method report
     * @param 
     * the output function
     */
  
    d.report = function(test){      
      var output = d.format(test);
      if( d.settings.classic ) {                
        d.classic( output );        
      }
      if( typeof d.reporter === 'function' ) d.reporter.call( d, test );
    },
    
    
    /* @method fail
     * executed upon test fail
     */

    d.fail = function(test){
      var t = d.tests._move(test, 'pending', 'failed'); //adapt for processing      
      test.flag = 'fail';
      d.report( test );
    },


    /* @method pass
     * registers a test with {label}, {results}, {[expected]}
     */

    d.pass = function(test){
      var t = d.tests._move(test, 'pending', 'successful'); //adapt for processing      
      test.flag = 'pass';      
      d.report( test );
      return test;
    },


    /* @method test
     * public method for registering a test
     */

    d.test = function(label, results, expects){
      if( !label ) return; //killswitch for manually disabling tests      
      var t = d.tests.register( label, results, expects ),
          c = function(passed){ return passed ? d.pass(t): d.fail(t); },
          r = false,
          group = utils.defined(this) ? this : false;
      if( group ) {        
        t.group = group;
        t.group.tests[t.name] = t;
      }
      switch( typeof results ){
        case 'boolean': case 'string':
          r = c( results === expects );
        break;
        default:
          r = c( utils.is( results, expects ) );
        break;
      }
      return t; //for chaining in the future
    };
 
 
    /*
     * @method method
     * creates a wrapper for tests on a specific method
     * @param {type} name
     * @param {type} func
     * @param {type} parent
     * @returns {undefined}
     */
    
    d.method = function(name, func, _parent){
      var test = d.test, method, parent = _parent || this;
      
      //if( !name ) return false;
      
      var g = d.group.create('method '+name);
      g.tests = {};
      test = test.bind(g);
      
      //register method      
      //alert( utils.is.call( parent[name] ) )
      if( parent ){
        if( typeof parent === 'function' ) method = parent;
        else {
          if( utils.has( parent, name ) && typeof parent[name] === 'function' ){       
            method = parent[name];
          } else {   
            d.log.error('Debugger couldnt find method '+name);
          }
        }
      }
      if(d.settings.delay){
        var fn = func.bind( func, method, test, name, utils);
        return d.tests.delayed[name] = fn;
      }
      return func.call( func, method, test, name, parent);
    };
         
    /*
     * @method run
     * @param {type} what
     * @returns {undefined}
     */  
    d.run = function(what){      
      if( what instanceof Array ){
        utils.each( what, function(params, context){        
          d.test.apply( null, params );
        });
      }
    };

    /*
     * @method complete
     *      
     */
    
    d.complete = function(){
      d.log('\n\r');
      var i = 1,
          r = d.tests.registered;
          t = d.tests.tests,
          p = t.successful,
          f = t.failed;
      utils.each( p, function(){ i = i+1; });
      d.log('Successfully ran '+i+' of '+r+' tests!');
      if( i !== r ){
        d.log( 'Failed tests:'+Object.keys(f) );
      }
      d.log('\n\r');
    };
      
   /* 
    * look for/reference UI items   
    */
    
    
    if(d.settings.gui){
      //d.ui = require('./ui')( d, utils );
      d.ui.setup();
      d.reporter = d.ui.feed;
    }

    /*
     * @method start
     * start the debugger 
     */
    
    d.start = function(){
      var s = 'Starting debug-lite [ '+d.name+' ]\n\r';
      d.log( s );
    };
    
    if( d.settings.autostart ){
      d.start();
    }
    
    /* 
     * return Debugger
     */
    
    return d;
    
  };

  /*
   * @TODO move to another place...
   * @method stringArgs
   * converts argument(s) to a formatted string ( my, args )
   * @param args {Any} expects array for multiple args or wrapped single array
   * @returns formated_string {String} the pretty string
   */
  var stringArgs = function(a){
    var s = '( ';    
    if( utils.is( a, 'array' ) ) s += a.join(',');
    else s += a;
    s += ' )';
    return s;
  };
    
  /*
   * @TODO incorporate 'this' method?
   * @method create
   * creates a debug-lite object (method)
   * if args and expects defined, automatically runs test and returns test object
   * else, returns a method with {source} and {name} bound
   * @param name {String} debugger name
   * @param source {Any} the source (in Node, the main module)
   * @param args {Any} if args, applied. else, passed. use wrapper array for single array param [ [] ]
   * @param expects {Any} what is the expected result from the test
   * @returns test {Debugger.test object}
   */  
 
  var _temp;
  var debug = function(n,s,a,e,c){    
    var d = _temp ? _temp : _temp = new Debugger(n);
    var m = d.method.bind( s, n );
    if( a && e ){
      var s = ' => '+e;
      var p = stringArgs(a);
      var ps = p + s;
      var r = m(function(fn, test, name){        
        test( name+ps, fn(a), e );
        if( c ) test( name+'.call'+ps, fn(a), e );
      });
      //return r;
    }
    //else return m;    
    return d;
  };
  

  //debug( 'name', Debugger, 'arguments', 'expected' );
  
  /**/
  Debugger.utils = utils;

  return module.exports = debug;
  /**/
}());