// ========================================================================
// RootResponder Tests
// ========================================================================
/*globals module test ok isObj equals expects */

module("SC.RootResponder", {
	setup: function() {		
		sub = SC.Object.create({
			action: function() { objectA = "hello"; }
		});
		
		newPane = SC.Pane.create({ owner: this});
		oldPane = SC.Pane.create({ owner: this});
		lightPane = SC.Pane.create({ owner: this});
		darkPane = SC.Pane.create({ owner: this});
		myPane = SC.Pane.create();
		responder = SC.RootResponder.create({});
	},
	
	teardown: function() {
		delete sub;
	},
	
	//var objectA, submit = document.createElement('pane');

 	triggerMe: function() {
		SC.Event.trigger(submit, 'click');
	}
	
});

test("Basic requirements", function() {
  expect(2);
  ok(SC.RootResponder, "SC.RootResponder");
  ok(SC.RootResponder.responder, "SC.RootResponder.responder");
});

test("root_responder.makeMainPane() : Should change the new Pane to key view", function() {
	responder.makeMainPane(newPane);
	//Checking the mainPane property
	equals(responder.get('mainPane'),newPane);
	equals(responder.get('keyPane'), null);
});

test("root_responder.makeMainPane() : Should notify other panes about the changes", function() {
	responder.makeMainPane(newPane);
		
	//Notify other panes about the changes
	equals(newPane.get('isMainPane'),YES);
	equals(oldPane.get('isMainPane'),NO);
	
});

test("root_responder.makeKeyPane() : Should make the passed pane as the key pane", function() {
	responder.makeMainPane(oldPane);
	equals(responder.get('keyPane'), null);
	
	responder.makeKeyPane(oldPane);
	equals(responder.get('keyPane'),oldPane);
}); 

test("root_responder.makeKeyPane() : Should make the main pane as the key pane if null is passed", function() {
	responder.makeMainPane(lightPane);
	// newPane is set as the Main pane
	equals(responder.get('mainPane'),lightPane);
	// KeyPane is null as it is not set yet 
	equals(responder.get('keyPane'), null);
	
	responder.makeKeyPane();
	// KeyPane is set as the mainPane as null is passed 
	equals(responder.get('keyPane'),lightPane);
});

test("root_responder.removePane() : Should be able to remove panes to set", function() {
	responder.removePane(darkPane);
		
	//Notify other panes about the changes
	equals(responder.get('mainPane'),null);
});

test("root_responder.addPane() : Should be able to add panes to set", function() {
	responder.addPane(darkPane);
		
	//Notify other panes about the changes
	equals(responder.get('mainPane'),lightPane);
});


