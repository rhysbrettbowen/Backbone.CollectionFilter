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
			var odd = new Backbone.Model({a: 1});
			var even = new Backbone.Model({a: 2});
			var c = new Backbone.Collection();
			var isEven = function(a) {return a.get('a') % 2 === 0;};
			var f = new Backbone.CF(c, isEven);

			it('should add model that satisfies filter', function() {
				c.add(even);
				f.contains(even).should.be.true;
			});

			it('should not add model when filter returns false', function() {
				c.add(odd);
				f.contains(odd).should.be.false;
			});
		});

		describe('sorting models', function() {
			it('should sort models based on it\'s comparator', function() {
				var odd = new Backbone.Model({a: 1});
				var even = new Backbone.Model({a: 2});
				var c = new Backbone.Collection([odd, even]);
				var revSort = function(a, b) {return b.get('a') - a.get('a');};
				var retTrue = function() {return true;};
				var f = new Backbone.CF(c, retTrue, {
					comparator: revSort
				});

				f.models[0].should.equal(even);
				f.models[1].should.equal(odd);
			});
		});

		describe('filter on model changes', function() {
			var odd = new Backbone.Model({a: 1});
			var even = new Backbone.Model({a: 2});
			var c = new Backbone.Collection([odd, even]);
			var isEven = function(a) {return a.get('a') % 2 === 0;};
			var f = new Backbone.CF(c, isEven);

			it('should add a model when change makes model pass filter', function() {
				odd.set('a', 2);
				f.contains(odd).should.be.true;
			});

			it('should remove a model when change makes model fail filter', function() {
				even.set('a', 1);
				f.contains(even).should.be.false;
			});
		});

	});

});