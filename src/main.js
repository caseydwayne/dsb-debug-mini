module.exports = (function(){
  
  var utils = require('dsb-utils');
      utils.magic = require('dsb-magic-string');
      utils.fc = require('dsb-fancy-chalk');
      utils.store = require('./store');
      utils.chalk = require('chalk');
      var chalk = utils.chalk;
  
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
     * @property messages
     */
    
    d.messages = {
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
//      console.log( f.replace(/^[\n|\r] +?| +?[\n|\r]$/g, '') );
      utils.each(a,utils.fc);
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
      var _ = utils.magic;
      var m = d.messages[f]; //prints a string for log
      var n = _( chalk.bold( m.text ) ).break().print();
      var o = _( chalk[m.chalks]( n ) );
      if( f !== 'pass' || d.settings.expandAll ){
        utils.each( test, function(v,k){
          o =  _( o ).title( k, v ).break();
        });
      }
      else {
        o = _( o ).prepend( _( test.name ).break().print() );
      }
      return o.print();
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
      var name = utils.magic(name);
      if(d.settings.delay){
        var fn = func.bind( func, method, test, name, utils);
        return d.tests.delayed[name] = fn;
      }
      return func.call( func, method, test, name, parent);
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
      var s = utils.magic('%bold:').break().append('Starting Debugger').note(d.name).break().print();
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
   * create a debugger
   */
    
  Debugger.create = function(n,o){ return new Debugger(n,o); };
  
  Debugger.utils = utils;
  
  /***
  
  var debug = new Debugger('test',{classic:true}); 
  
    //debug.test('abc', utils.defined( true ),true)    
    /**
    debug.method( 'defined', function(fn,test){
      var a = 'defined!';
      test( 'normal', fn(a), true);
    }, utils);
    
    debug.method('each', function(e,t){
      var o = { 'test': 'object', 'test2': 'object2' };
      e(o, function(v,k,i){
        //alert(k);
      });
    }, utils);
      
 /***/
      
  //SYSTEM.Debugger = Debugger;
  return module.exports = Debugger;
  
}());