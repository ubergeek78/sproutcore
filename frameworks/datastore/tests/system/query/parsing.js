// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple, Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

// test parsing of query string
var store, storeKey, storeId, rec, MyApp;
module("SC.Query parsing", {
  setup: function() {
    // setup dummy app and store
    MyApp = SC.Object.create({
      store: SC.Store.create()
    });
    
    // setup a dummy model
    MyApp.Foo = SC.Record.extend({});
    
    // load some data
    MyApp.store.loadRecords(MyApp.Foo, [
      { guid: 1, firstName: "John", lastName: "Doe" },
      { guid: 2, firstName: "Jane", lastName: "Doe" },
      { guid: 3, firstName: "Emily", lastName: "Parker" },
      { guid: 4, firstName: "Johnny", lastName: "Cash" }
    ]);
    
    storeKey = MyApp.store.storeKeyFor(MyApp.Foo, 1);
    
    // get record
    rec = MyApp.store.materializeRecord(storeKey);
    storeId = rec.get('id');
    
    
  }
});

// ..........................................................
// LENGTH
// 

test("should pass through length", function() {
  equals(recs.get('length'), storeIds.length, 'rec should pass through length');  
});

test("changing storeIds length should change length of rec array also", function() {

  var oldlen = recs.get('length');
  
  storeIds.pushObject(SC.Store.generateStoreKey()); // change length
  
  ok(storeIds.length > oldlen, 'precond - storeKeys.length should have changed');
  equals(recs.get('length'), storeIds.length, 'rec should pass through length');    
});

// ..........................................................
// objectAt
// 

test("should materialize record for object", function() {
  equals(storeIds[0], storeId, 'precond - storeIds[0] should be storeId');
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');
});

test("reading past end of array length should return undefined", function() {
  equals(recs.objectAt(2000), undefined, 'recs.objectAt(2000) should be undefined');
});

test("modifying the underlying storeId should change the returned materialized record", function() {
  // read record once to make it materialized
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');  
  
  // create a new record.
  var rec2 = MyApp.store.createRecord(MyApp.Foo, { guid: 5, firstName: "Fred" });
  var storeId2 = rec2.get('id');
  
  // add to beginning of storeKey array
  storeIds.unshiftObject(storeId2);
  equals(recs.get('length'), 5, 'should now have length of 5');
  equals(recs.objectAt(0), rec2, 'objectAt(0) should return new record');
  equals(recs.objectAt(1), rec, 'objectAt(1) should return old record');
});

test("reading a record not loaded in store should trigger retrieveRecord", function() {
  var callCount = 0;

  // patch up store to record a call and to make it look like data is not 
  // loaded.
  
  MyApp.store.removeDataHash(storeKey, SC.Record.EMPTY);
  MyApp.store.retrieveRecord = function() { callCount++; };
  
  var rec = recs.objectAt(0);
  equals(MyApp.store.readStatus(rec), SC.Record.EMPTY, 'precond - storeKey must not be loaded');
  
  equals(callCount, 1, 'store.retrieveRecord() should have been called');
});

// ..........................................................
// replace()
// 

test("adding a record to the ManyArray should pass through storeIds", function() {

  // read record once to make it materialized
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');  
  
  // create a new record.
  var rec2 = MyApp.store.createRecord(MyApp.Foo, { guid: 5, firstName: "rec2" });
  var storeId2 = rec2.get('id');
  
  // add record to beginning of record array
  recs.unshiftObject(rec2);
  
  // verify record array
  equals(recs.get('length'), 5, 'should now have length of 2');
  equals(recs.objectAt(0), rec2, 'recs.objectAt(0) should return new record');
  equals(recs.objectAt(1), rec, 'recs.objectAt(1) should return old record');
  
  // verify storeKeys
  equals(storeIds.objectAt(0), storeId2, 'storeKeys[0] should return new storeKey');
  equals(storeIds.objectAt(1), storeId, 'storeKeys[1] should return old storeKey');
});

// ..........................................................
// Property Observing
// 

test("changing the underlying storeIds should notify observers of records", function() {

  // setup observer
  var obj = SC.Object.create({
    cnt: 0,
    observer: function() { this.cnt++; }
  });
  recs.addObserver('[]', obj, obj.observer); 
  
  // now modify storeKeys
  storeIds.pushObject(5);
  equals(obj.cnt, 1, 'observer should have fired after changing storeKeys');
});

test("swapping storeIds array should change ManyArray and observers", function() {

  // setup alternate storeKeys
  var rec2 = MyApp.store.createRecord(MyApp.Foo, { guid: 5, firstName: "rec2" });
  var storeId2 = rec2.get('id');
  var storeIds2 = [storeId2];

  // setup observer
  var obj = SC.Object.create({
    cnt: 0,
    observer: function() { this.cnt++; }
  });
  recs.addObserver('[]', obj, obj.observer); 
  
  // read record once to make it materialized
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');  
  
  // now swap storeKeys
  obj.cnt = 0 ;
  recs.set('storeIds', storeIds2);
  
  // verify observer fired and record changed
  equals(obj.cnt, 1, 'observer should have fired after swap');
  equals(recs.objectAt(0), rec2, 'recs.objectAt(0) should return new rec');
  
  // modify storeKey2, make sure observer fires and content changes
  obj.cnt = 0;
  storeIds2.unshiftObject(storeId);
  equals(obj.cnt, 1, 'observer should have fired after edit');
  equals(recs.get('length'), 2, 'should reflect new length');
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should return pushed rec');  

});