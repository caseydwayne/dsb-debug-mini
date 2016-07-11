(function(){

  var __ = require('dsb-utils');

  /*
   * @method magic
   * creates a magic name to add functionality
   * @param name {string}
   * @returns magic-string {object} the magic string object 
   */
  var magic = function(name){    
    return {
      original: name, //constant
      value: name, //variable
      print: function (){
        return this.value;
      },
      append: function(x){
        this.value = this.value+' '+ x;
      },
      prepend: function(x){
        this.value = x +' '+this.value;
      },
      list: function( a, pre, post ){
        var s = '',            
            l = a.length;         
        __.each( a, function(v,k,i){                
          var x = ( i === (l-1) ) ? ' '+v+' ' : ' '+v+', ' ;
          s += x;
        });
        if( pre ) s = pre + s;
        if( post ) s += post;
        return s;
      },
      args: function(){
        var a = __.toArray(arguments);
        var s = this.list( a, '(', ')' );
        return this.append(s);
      },
      note: function(){
        var a = __.toArray(arguments);
        var s = this.list( a, '[', ']' );
        return this.append(s);
      },
      title: function(name,val){  
        return this.append(name+': '+val);
      }
    };
  };
  
  /* ez unit tests 
    var m = magic('my string');
    var s = m.string();
    var a = m.args('my args');
    var n = m.note('a special note');
    var p = m.prepend('you cannot touch');
    var ap = m.append('is just too cool');
    console.log( s );
    console.log( a );
    console.log( n );
    console.log( p );
    console.log( ap );
*/  
  
  return module.exports = magic;
  
}());