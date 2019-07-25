# DSB Debug Mini
Node Module: `dsb-debug-mini`

> an easy to use debugging tool

The debug-mini module is a light-weight debug tool based on dsb-debug. It maintains a lot of the core functionality without heavier options/markup. 

This module does NOT require dsb-debug; it is a standalone with similar signatures/output.

According to the code...


  /*
   * @module debug-mini
   *
   * creates a miniture debugger, independent of dsb-debug, that
   * can be used in situations where dsb-debug would cause conflict
   * (mainly modules required by dsb-debug, preventing cyclical deps).
   *
   * it mimics the core functionality of dsb-debug so it can still be
   * used in dsb-diag diagnostic tests.
   *
   * it is also used by open-source modules because dsb-debug
   * is still closed source.
   */
	 
	 
It contains the properties 

- verdict: <boolean>
- fail: <array>
- pass: <number>
- all: <number>
- reporter: <function> (default is `console.log`)

It also contains the methods...

- `test` - using the standard t,r,e format (text, result, expected)
- `question` - converts an answer to 'yes' or 'no'
- `complete` - reports results from the test checking that X of Y tests passed; all tests passed v.s. which ones failed
- `create` - follows dsb-debug's naming convention (default 'generic dsb-mini')
- `method` - I honestly don't even remember right now... probably shouldn't be in here but is because dsb-debugger has it.

and finally the property `name`, which is 'generic dsb-mini' by default.	

It returns a pure object (not a constructor like dsb-debug). Useful for situations/modules that existed prior to debug/that are released publicly.