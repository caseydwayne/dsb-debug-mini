(function(){

  /*
   * creates a group system
   */

  var group = function(){
    
    
    /*
     * reference {this}
     */
    
    var g = this || {};
    
    
    /*
     * @property all
     * holds all registered groups
     * @type object
     */
    
    g.all = {},      
    
      
    /*
     * @property registered
     * the number of registered groups
     * @type number
     */
    g.registered = 0;        
    
    
    /*
     * @method unique
     * unique id for groups
     */
    
    g.unique = function(){
      return g.registered;  
    },
      
      
    /*
     * @method create
     * creates an actual group object
     */
  
    g._create = function(name){
      return {
        name: name,        
        parent: null,
        children: null        
      };
    },
      
    /*
     * @method register
     * register a group
     */
  
    g.register = function(name){
      var n = g.registered++,
         _g = g._create( name || 'Group '+n );
       g.all[n] = _g;
      return _g;
    },
    
    /*
     * @method create
     * create a group
     */
  
    g.create = function(name){
      return g.register(name);
    };
    
    /* FIX
     * @method fetch
     * fetches a group from all
     */
  
    g.fetch = function group(name){
      var _g = g._create();
      //if g in all
      return _g;
    };
    
    return g;
    
  };
  
  return module.exports = group;
  
}());