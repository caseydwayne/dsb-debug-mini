module.exports = function(d,utils){

  var sprintf = require('sprintf-js').vsprintf;
  
  var hyphenate = function(s){
    var ws = /\s/g;
    s = String.prototype.replace.call( s, ws, '-' );
    return s;
  };
  
  var lowercase = function(s){
    return String.prototype.toLowerCase.call( s );
  };
  
  
  var ui = {
    
    active: false,
    target: null,
    self: null,
    tests: null,


    /*
     * @property defaultGroup
     * the name of the default debugger UI group
     * @type {string}
     */
    
    defaultGroup: ('Tests from '+d.name),

      
    /*
     * @property groups
     * holds all UI groups by name
     * @type {object}
     */
    
    groups: {},
    
    
    /*
     * @method group
     * retrieves a group from groups by name. creates a new one if it doesn't exists
     * @returns group {HtmlDivElement}
     */
    
    group: function(name){
      var g = ui.groups;
      if( utils.has( g, name ) ) return g[name];
      return g[name] = ui.create.group(name);
    },
    
    
    /*
     * @property create
     * houses DOM creation methods
     */
    
    create: {
      
      
      /* 
       * @method tests
       * creates a container div.tests
       */
      
      tests: function(){
        var t = d.ui.tests = document.createElement('div');
        t.classname = 'tests';
        return t;
      },
      
      
      /*
       * @method test
       * creates a div.test, adds innerHTML or DOM object if provided
       */
      
      test: function(test,target){
        var n = '<td class="name">'+test.name+'</td>';
        var r = '<td class="result">'+test.result+'</td>';
        var e = '<td class="expected">'+test.expected+'</td>';
        var a = n+r+e;      
        var s = document.createElement('tr');
        s.innerHTML = a;
        s.className = 'test '+test.flag;
        return s;
      },
      
      
      /*
       * @method group
       * creates a div.group.{name}. adds the group test table + formatting
       * @param name {string} the group name
       * @returns group {HtmlDivElement} the div.group with property {target} added
       */
      
      group: function(name){        
        var g = document.createElement('div'),
            h = '<h2 class="title">'+name+'</h2>',
            r = '<tr><th>Name</th><th>Result</th><th>Expected</th></tr>',
            t = document.createElement('table');
        t.innerHTML = r;
        g.className = 'group '+lowercase( hyphenate(name) );
        g.innerHTML = h;
        g.appendChild(t);
        if( ui.self ) ui.self.appendChild(g);
        else if( ui.tests ) ui.tests.appendChild(g); 
        g.target = t;
        return g;
      },
      
      
      /*
       * @method container
       * seeks out #debugger, creates one if none found. attaches to body by default.
       * @param [target] {HtmlElement}
       * @returns container {HtmlDivElement}
       */
      
      container: function(target){
        var s = this,
            t = s.target = target || document.getElementsByTagName('body')[0],
            c = document.createElement('div');
            c.id = 'debugger';
        //c.appendChild(tests);
        if( t ) t.appendChild(c);
        else throw new Error('No body found! Must specify a DOM object {target} in debugger.settings');
        return c;
      }
      
    }, //end create object
    
    
    /*
     * @method setup
     * does the initial setup work. assigns self, test, and switches active
     */
    
    setup: function(){        
      var ui = d.ui, c = ui.create, tests, gui;
      if( ui.self ) gui = ui.self;
      else gui = ui.self = document.getElementById('debugger');
      if( gui ){
        tests = gui.querySelector('.tests');       
        if( !tests ){
          tests = c.tests();
          gui.appendChild(tests);
        }          
      } else {         
       c.container();
       ui.setup();
       return false;
      }
      ui.tests = tests;
      var g = ui.group( ui.defaultGroup );      
      ui.active = true;
    },
    
    
    /*
     * @method report
     * adds a new test to the proper HTML UI element
     * @param test {object}
     * @returns target {HtmlElement}
     */

    report: function(test){
      var g = false;
      //var c = '<div class="'+test.flag+'">'+ t +'</div>';
      if( test.group ){
        g = ui.group(test.group.name);      
      }
      else {
        g = test.group = ui.groups[0];
      }
      //var f = sprintf( c, [ test.name, test.result, test.expected ] );
      var target = g.target;      
      var t = (target) ? target : ui.tests;      
      var l = ui.create.test( test );
      //alert( l.outerHTML );
      t.appendChild(l);
      return t;
    },
    
    
    /*
     * @method feed
     * feed acts as the public method for accessing the UI
     * @param test {object}
     * @returns test {object}
     */
    
    feed: function(test){
      var ui = d.ui;
      if( !ui.active ) ui.setup();
      ui.report(test);
      return test;
    }
      
  };
  
 return ui;
  
};