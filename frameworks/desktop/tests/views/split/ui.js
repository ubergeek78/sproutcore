// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            portions copyright @2009 Apple Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test htmlbody ok equals same stop start */

htmlbody('<style> .sc-static-layout { border: 1px red dotted; } </style>');

(function() {
  var pane = SC.ControlTestPane.design()
    .add("horizontal", SC.SplitView, { 
	  layout: { right: 20, bottom: 20, width: 100, height: 23 },
      layoutDirection: SC.LAYOUT_HORIZONTAL,canCollapseViews: NO
    })
  
    .add("vertical", SC.SplitView, { 
      layoutDirection: SC.LAYOUT_VERTICAL,canCollapseViews: NO
    })
  	.add("collapsable", SC.SplitView, { 
      layoutDirection: SC.LAYOUT_HORIZONTAL,canCollapseViews: YES
    });
      
  pane.show(); // add a test to show the test pane

  // ..........................................................
  // TEST VIEWS
  // 
  module('SC.SplitView ui', pane.standardSetup());

  test("Horizontal and Vertical SplitView", function() {
  	var view = pane.view('horizontal');
    ok(!view.$().hasClass('vertical'), 'should not be vertically divided');
    ok(!view.$().hasClass('collapsable'), 'should not be collapsable');
    equals(view.get('layoutDirection'),SC.LAYOUT_HORIZONTAL,"the view is divided horizontally");
    view = pane.view('vertical');
    ok(!view.$().hasClass('horizontal'), 'should not be horizontally divided');
	ok(!view.$().hasClass('collapsable'), 'should not be collapsable');
	equals(view.get('layoutDirection'),SC.LAYOUT_VERTICAL,"the view is divided vertically");
  });

  test("can collapse split view", function() {
	var view = pane.view('collapsable');
    ok(!view.$().hasClass('vertical'), 'should not be have vertical class');
	equals(view.get('layoutDirection'),SC.LAYOUT_HORIZONTAL);
	equals(view.get('canCollapseViews'),YES,"the view should be collapsable");
  });		
 })();


