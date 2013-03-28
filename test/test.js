define(['chai', 'Backbone.CollectionFilter'], function(chai) {


	chai.should();

	describe('Backbone.CollectionFilter', function() {

		var collection = new Backbone.Collection();
		var retTrue = function() {return true;};
		var comp = function(a, b) {return b.id - a.id;};

		describe('initialize', function() {

			var filtered = new Backbone.CF(collection, retTrue);

			it('should have a collection', function() {
				filtered.collection.should.equal(collection);
			});
			it('should have a filter function', function() {
				filtered.filter = retTrue;
			});

		});

		describe('comparator', function() {

			var filtered = new Backbone.CF(collection, retTrue, {
				comparator: comp
			});

			it('should have a comparator', function() {
				filtered.comparator.should.equal(comp);
			});

		});

		describe('adding models', function() {

		});

	});

});