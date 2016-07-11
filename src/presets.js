(function(){

  var presets = {
    'object': { my: 'object' }, 
    'function': function(){},
    'string': 'my string',
    'array': [ 'my', 'array' ],
    'number': 3,
    'boolean': true,
    'regexp': /\s/    
  };
  
  if( typeof document !== 'undefined' ) {
    presets.html = document.createElement('div');
    presets.style = document.createElement('style');
  }
  
  return module.exports = presets;
  
}());