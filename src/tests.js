(function(){

  var utils = require('dsb-utils');

  var tests = function(){
    
    /*
     * private tests object
     */
    
    var t = this;
    
    
    /* @property registered
     * the total number of registered tests
     */
  
    t.registered = 0,
    
    
    /* @method unique
     * creates a unique identifier for each test
     */
  
    t.unique = function(){
      return t.registered;  
    },
    
          
    /* @method create
     * creates a test object
     */

    t.create = function (uid,name,result,expected,flag){
      return {
        id: uid,
        name: name,
        result: result,
        expected: expected,       
        flag: flag
      };
    },
    
    t.run = function(what){
      var t = ( what instanceof Array );
      if(t) utils.each( what, function(t){
        //console.log(t);
      });
      /*
      console.log(t);
      switch(t){
        case 'object': break;
        case 'string': break;
        case 'array': console.log('testing'); break;            
        default: break;
      };//end switch   
      */
    };


    /* @property tests
     * a collection of arrays housing the registered tests
     */
  
    t.tests = {
      all: {},
      pending: {},
      processing: {},
      ignored: {},
      successful: {},
      failed: {}
    },
    
    t.delayed = {},
    
    
    /* @method register
     * registers a test with {label}, {results}, {[expected]}
     */

    t.register = function(label, result, expects){      
      var id = t.unique(), 
      test = t.create( id, label, result, expects  ),
      _t = t.tests;
      t.tests.all[id] = t.tests.pending[id] = test;
      t.registered++;
      return test;
    },
      
    /*
     * @method move     
     * move a test from one group to another      
     */
  
    t._move = function(target, source, destination){
      var _t = t.tests,
          i = ( typeof target === 'object' && target.id ) ? target.id : i,
          s = _t[source][i] || false;        
        
      if( s ){        
        _t[destination][i] = s;
        delete s;
      }
    };
      
    return t;
    
  };
  
  return module.exports = tests;
  
}());