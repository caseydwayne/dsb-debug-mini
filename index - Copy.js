(function(){

  var d = require('dsb-debug-core');
  
  /*
   * @method format
   * formats the string for log
   *
  
  d.format = function(test){
    var l = '\n\r';
    var f = test.flag;      
    var m = d.flags[f]; //prints a string for log
    var n = m.text;
    var o = ' ';
    if( f !== 'pass' || d.settings.expandAll ){
      d.utils.each( test, function(v,k){
        o +=  k + ': ' + v;
      });
    }
    else {
      o += test.name;
    }
    return n+o;
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
    if( a instanceof Array ) s += a.join(',');
    else s += a;
    s += ' )';
    return s;
  };
  
  /*
   * 
   * @type type
   */

  d.and = function(){
    console.log('AND!');
  };

  /*
   * @TODO incorporate 'this' method?
   * @method create
   * creates a debug-lite object (method)
   * if args and expects defined, automatically runs test and returns test object
   * else, returns a method with {source} and {name} bound
   * @param name {String} debugger name
   * @param source {Any} the source (in Node, the main module)
   * @param [args] {Any} if args, applied. else, passed. use wrapper array for single array param [ [] ]
   * @param [expects] {Any} what is the expected result from the test
   * @param [call] {Boolean} if true, test will also attempt to run via .call()
   * @returns test {Debugger.test object}
   */

  var _temp; //@todo attach to system and create a cache
  var debug = function(n,s,a,e,c){    
    var _d = _temp ? _temp : _temp = d.create(n);
    var m = _d.method.bind( s, n );
    if( a && e ){
      var p = stringArgs(a);
      var s = ' => '+e;
      var ps = p + s;
      var r = m(function(fn, test, name){        
        test( name+ps, fn(a), e );
        if( c ) test( name+'.call'+ps, fn(a), e );
      });
      //return r;
    }
    //else return m;
    _d.and = _d.test.and = d.test;
      //function(){};
    
    return _d;
  };
    


  //debugger
  return module.exports = debug;
  
}());