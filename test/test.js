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
				f.models.should.contain(even);
			});

			it('should not add model when filter returns false', function() {
				c.add(odd);
				f.models.should.not.contain(odd);
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
				f.models.should.contain(odd);
			});

			it('should remove a model when change makes model fail filter', function() {
				even.set('a', 1);
				f.models.should.not.contain(even);
			});
		});

		describe('collection functions', function() {
			var m = new Backbone.Model();
			var c = new Backbone.Collection();
			var f = new Backbone.CF(c, function() {return true;});
			it('should put model on original collection', function() {
				f.add(m);
				c.models.length.should.equal(1);
			});
		});

		describe('test bound function', function() {
			var test;
			var c = new (Backbone.Collection.extend({
				testFn: function() {
					test = this;
				}
			}))();
			var f = new Backbone.CF(c, function(){});

			it('should call collection\'s function with original context', function() {
				f.testFn();
				test.should.equal(test);
			});

			it('should call with given context if not filtered collection', function() {
				var obj = {};
				f.testFn.call(obj);
				test.should.equal(obj);
			});
		});


	});

});