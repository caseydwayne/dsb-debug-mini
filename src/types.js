(function(){

  var types = function(){
    
    var t = this;
      
    /*
     * @property primitives
     * javascript primitive types
     */
  
    t.primitives  = ['string','object','function','array','boolean'],
      
      
    /*
     * @property primitives
     * javascript extended types
     */
  
    t.extended = ['regexp','html','style'],
      
      
    /*
     * @property primitives
     * all javascript types
     */
  
    t.types = t.primitives.concat( t.extended );
  
    return t;
  
  };
  
  return module.exports = types;
  
}());