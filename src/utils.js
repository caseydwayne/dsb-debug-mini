require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({7:[function(require,module,exports){
(function(){

  /*
   * the {utils} are a collection of essential methods.
   * all utility functions can use 'this' or a parameter
   */

  var utils = {

    defined: require('./defined'),    
    toArray: require('./toArray'),    
    typecheck: require('./typecheck'),    
    merge: require('./merge'),    
    //callback: require('./callback'),
    has: require('./has'),
    each: require('./each'), 
    is: require('./is'),   
    teach: require('./teach'),    
    learn: require('./learn'),    
    log: require('./log'),
    printr: require('./printr')    
    
  };

  module.exports = utils;
  return utils;

}());
},{"./defined":8,"./each":9,"./has":10,"./is":11,"./learn":12,"./log":13,"./merge":14,"./printr":15,"./teach":16,"./toArray":17,"./typecheck":18}],15:[function(require,module,exports){
(function(){
  
  /* @method printr
   * returns a shallow "printout" of any object
   * @param [object] {object} the object to print
   * @returns 
   */
  
  var printr = function(o){
    var o = o || this, r = '', b = '\r\n', s = '\t';
    for( var i in o ) r += s+i+': '+o[i];
    return('{'+b+r+b+'}');
//    {\r\n\tmy: object\r\n}, 
  };
  
  module.exports = printr;
  return printr;
  
}());
},{}],14:[function(require,module,exports){
(function(){

  /*
   * @method merge
   * combines 2 or more objects. automatically overwriting and recursive, typechecking off by default. 2nd use added: string + value = object[string] = value
   * @param [overwrite] {boolean} @default: true - if true, overwrites if key already exists
   * @param [deep] {boolean} @default: true - if true, does not overwrite shallow, merges deep
   * @param [typecheck] {boolean} @default: false - if true, property type must be replaced with the same type
   * @rest merger1, m2, ..., mN ) the objects to merge
   * @returns merged {object} the merged object
   */


  var toArray = require('./toArray'),
           is = require('./is');


  var merge = function(){
      var original = this, mergers = [], args = toArray(arguments), f = args[0], s = args[1], overwrite, deep;
      if( is( f, 'string' ) && typeof s !== 'undefined' ){
        original[ f ] = s;
        return original;
      }
      var _merge = function( o1, o2 ){
  //      console.log('found '+o2.printr+' to merge');
        for(var i in o2){
          if( o1[i] ){ //found existing - conflict resolution
            if( overwrite ){
              if( is( o1[i], 'object' ) ){ 
                if( is( o2[i], 'object' ) && deep ) merge( o1[i], o2[i] );
                else {
                  if( typecheck ){
                    if( is( o1[i] ) === is( o2[i] ) ) o1[i] = o2[i];
                  } else o1[i] = o2[i];
                }
              } else o1[i] = o2[i]; //non-objects
            } else return; //do nothing if overwrite false
          } else o1[i] = o2[i]; //no conflict, add mi to oi
        }//end for loop
      };//end _merge()
      //resolve arguments
      overwrite = args[0] && is( args[0], 'boolean' ) && false ? ( false, args.shift() ) : true;
      deep = args[1] && is( args[1], 'boolean' ) && false ? ( args.shift(), false ) : true;
      typecheck = args[2] && is( args[2], 'boolean' ) && true ? ( args.shift(), true ) : false;
      mergers = args;
      //merge and return
      for( var n in mergers ) _merge( original, mergers[n] );
      return original; //modified original  

  };

  return module.exports = merge;
  
}());
},{"./is":11,"./toArray":17}],13:[function(require,module,exports){
(function(){
  
  var toArray = require('./toArray');
  
  /* @method log
   * looks for console, builds one if none found
   * @param arguments {any} works just like console.log
   * @return {Console}
   */
  
  var log = function(){
    if( window && console && window.console ){ 
      var a = toArray(arguments);
      console.log.apply(window, a.length ? a : ['nothing to log...'] ); 
    }
    else {
      var defaults = ['assert', 'count', 'dir', 'dirxml', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'],
      fn = function(){};
      window.console = {};
      for(var l in defaults) window.console[ defaults[l] ] = fn;
    }
    return window.console;
  };
  
  module.exports = log;
  return log;

}());
},{"./toArray":17}],12:[function(require,module,exports){
(function(){
  
  /* @method learn
   * extends student(this) prototype in a non-destructive way (unless brainwashed a.k.a. override == true)
   * @param teacher {object} the factory to learn from
   * @param [brainwash] {boolean} default: false
   * @return student {any} the transmuted 'this' object
   */


  var __ = {
    defined: require('./defined'),
    is: require('./is'),
    teach: require('./teach'),
    each: require('./each'),
    has: require('./has')
  };

  var learn = function( teacher, brainwash, extra ){
    var student = this, knowledge, commit;
    if( !__.defined( student ) ){ //handle non-this instances
      //alert('aa');
      student = teacher;
      teacher = brainwash;
      brainwash = extra;
    }    
    if( !__.is( student, 'object') && !__.is(teacher, 'object') ){
      throw new Error('method {learn} requires 2 objects');
    }
    try{ knowledge = new teacher; } catch(e){ knowledge = teacher; } //Object.create( teacher.prototype )    
    commit = function(lesson){ __.teach.call( student, lesson, knowledge[lesson] ); };
    //alert(require('./toArray')(knowledge).length);
    __.each.call( knowledge, function( lesson ){      
      __.has.call( student.prototype, lesson ) ? ( brainwash ? commit(lesson) : null ) : commit(lesson);
    });
    return student;  
  };

  return module.exports = learn;

}());
},{"./defined":8,"./each":9,"./has":10,"./is":11,"./teach":16}],16:[function(require,module,exports){
(function(){
  
  /* @method teach 
   * adds a prototype property to student ('this'), or to student itself if no prototype (non-constructor)
   * @param name {string} the name of what you're teaching
   * @param property {any} whatever you want to store in the prototype of an object
   * @param [brainwash] {boolean} if true, will force the learning process. default: false
   * @return student {any} the transmuted object (original = 'this')
   */

  var __ = {
    defined: require('./defined'),
    is: require('./is'),
    each: require('./each')
  };

  var teach = function( name, property, brainwash, extra ){ //brainwash sets a function 
    var student = this, name, brain, lesson;
    if( !__.defined(student) ){ //for non-this use, curries right
      student = name;
      name = property;
      property = brainwash;
      brainwash = extra;
    }
    brain = student.prototype || student;
    lesson = function( _name, _property ){
      var teacher = false;
      if( _property !== null && typeof _property === 'object' && _property.hasOwnProperty('teacher') ) teacher = true;
      if(!teacher) _property = (brainwash) ? { value: _property } : { configurable: true, writable: true, value: _property };
      Object.defineProperty( brain, _name, _property );
      console.log('taught '+_name+' to '+brain);
    }; //end lesson()    
   
    if( typeof name === 'string' ) lesson( name, property );
    //if( typeof name === 'object' ) __.each( function(subject,title){ lesson( title, subject ); });
    return student;
  };

  module.exports = teach;
  return teach;

}());
},{"./defined":8,"./each":9,"./is":11}],10:[function(require,module,exports){
(function(){
    
  /* @method has
   * checks if object owns ALL or ANY of the properties provided
   * @param
   * @returns 
   */  
  

  var __ = {
    defined: require('./defined'),
    toArray: require('./toArray'),
    each: require('./each'),
    is: require('./is'),
    first: require('../primitives/array/first'),
    last: require('../primitives/array/last') 
  };
  
  var has = function(){ // optional boolean as last param: (_all) if false, returns true if match ANY, doesn't have to match ALL (default)
    var s = this, 
      a = __.toArray( arguments ), 
     _all = true, 
     has = false, 
     hasAll = true, 
     hasAny = false,     
     last = __.last(a);   
    if( a.length && ( typeof a[0] === 'object' ) ){
      s = a.shift();      
    }
    if( a.length && ( typeof last === 'boolean' ) ){
      _all = a.pop();      
    }
    //console.log( 'checking '+a+' with options ',_all,has,hasAll,hasAny)
    __.each( a, function(p){ has = s.hasOwnProperty( p ) ? ( !hasAny ? hasAny = true : true ) : hasAll = false; } );
    return _all ? hasAll : hasAny;
  };
    
  module.exports = has;
  return has;
  
}());
},{"../primitives/array/first":4,"../primitives/array/last":5,"./defined":8,"./each":9,"./is":11,"./toArray":17}],11:[function(require,module,exports){
(function(){

  var defined = require('./defined');
  var typecheck = require('./typecheck');
  
  /* @method is 
   * advanced typechecking
   * @param {type} value
   * @return {Boolean}
   */
  
  var is = function(v, x){
    var s = defined( this ) ? this : v, r = null;
    if( x ) v = x;
    r = ( s === v ) ? true : typecheck( s, v );
    //alert('is '+s + ' === '+ v +'? '+r+' | window?: ' + (s === window) );
    return r;
  };

  return module.exports = is;
  
}());
},{"./defined":8,"./typecheck":18}],18:[function(require,module,exports){
(function(){

  /* @method typecheck
   * returns the real type of an object
   * @param {any} check object to check
   * @return {string} truetype (object, array, regexp, ...)
   * @native
   */
  
  var toString = function(v){ return Object.prototype.toString.call( v || this ); };
  var lowercase = function(v){ return String.toLowerCase( v || this ); };
  var defined = require('./defined');
  
  var RX = {
    'objectType': /\[\w+ (.*)\]/ //returns the true type of a JS object ( [ Object TrueObjectType ] )
  };
  
  var typecheck = function(check, extra){ // advanced type-checking made easy
    var x = defined( this ) ? this : check, c = check, t, m, r, f;    
    if( extra ) c = extra || false;
    t = toString( x ), //Object.prototype.toString.call(     
    m = t.match( RX.objectType ),    
    r = m.length > 1 ? lowercase( m[1] ) : t,
    f = typeof c === 'string' ? r.indexOf( lowercase( c ) ) >-1 : r;
    //alert( 'Found '+t+' | stripped: '+r+' | check: '+c+' contains? '+f ); 
    return f;
  };
  
  return module.exports = typecheck;

}());
},{"./defined":8}],9:[function(require,module,exports){
(function(){
  
  
  /* @method each
   * @param [target] {object|array} will default to 'this'
   * @param method {function}
   * @rest arguments
   * works on objects || arrays. passes thru the function (1st arg) supplying (value, key, index). returns output of function or original value if no function output.
   */
  
  var __ = {
      toArray: require('./toArray')
   };
   
  var each = function(){
    var index = 0, 
    args = __.toArray(arguments),
    f = args.shift(), //assumes fn as 1st arg
    t = this; //defaults target to 'this'
    if (typeof f !== 'function'){
      var t = f;
      f = args.shift();
      if( typeof f !== 'function' ) throw new Error('each() requires a method');
    }  
    for(var i in t){
      t[ i ] = f( t[ i ], i, index++, args ) || t[ i ]; 
    }
    return t;     
  };
  
  module.exports = each;
  return each;

}());
},{"./toArray":17}],17:[function(require,module,exports){
(function(){
  
  
  /* @method toArray
   * creates an array of an objects values (useful for [arguments])
   */
  
  var toArray = function(o){ 
    var a = [], o = o || this; 
    if( o instanceof Array ) return o; 
    for(var i in o) a.push(o[i]); 
    return a; 
  };
  
  return module.exports = toArray;
  
}());
},{}],8:[function(require,module,exports){
(function(){
  
  /*
   * @method defined
   * checks if a variable is undefine
   * returns false if {variable} undefined or {this} === {window}
   * @param variable {any}
   */
  
  var defined = function(v){
    var x = v || this;
    return ( x === window ) ? false : ( typeof x !== 'undefined' );
  };
  
  module.exports = defined;
  return defined;
  
}());
},{}],5:[function(require,module,exports){
(function(){
  
  /* @method last
   * returns the last value of an array
   * @param 
   * @returns 
   */
  
  //var utils = require('utils');
  
  var last = function(v){
    var t = v || this; //utils.defined( this ) ? this : v;
    return t[ t.length - 1 ];
  };
  
  module.exports = last;
  return last;
  
}());
},{}],4:[function(require,module,exports){
(function(){
  
  /* @method first
   * returns the first value of an array
   * @param 
   * @returns 
   */  
  
  //var utils = require('utils');
  
  var first = function(v){
    var t = v || this; //utils.defined( this ) ? this : v;
    return t[ 0 ];
  };
  
  module.exports = first;
  return first;
  
}());
},{}]},{},[7]);
