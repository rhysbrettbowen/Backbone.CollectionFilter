// ==========================================
// Copyright 2013 Dataminr
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define('Backbone.CollectionFilter', [
	'underscore',
	'backbone'
], function(_, Backbone) {

	var noBind = ['on', 'trigger', 'off', 'at', 'pluck', 'forEach', 'each',
		'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select',
		'reject', 'every', 'all', 'some', 'any', 'include', 'contains',
		'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
		'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle',
		'lastIndexOf', 'isEmpty', 'groupBy'];

	var proto = {
		_filter: null,
		comparator: null,
		/**
		 * runs whenever there is an event on the parent collection
		 */
		onFilter: function(type, data) {
			type = type || '';
			// don't pass along remove if the model isn't in the filter
			if (type === 'remove' && ! _.contains(this.models, data)) {
				return;
			}

			var filt = this._filter(data);
			// don't pass along add if the model doesn't pass the filter
			if (type == 'add' && !filt) {
				return;
			}
			// if a change is made to a model that changes whether it is in
			// the collection then fire either add or remove
			if (type.indexOf('change') === 0 &&
					_.contains(this.models, data) != filt) {
				this.redoFilter();
				if (filt) {
					this.trigger('add', data);
				} else {
					this.trigger('remove', data);
					return;
				}
			}
			// reset the models on any other event (just in case)
			this.redoFilter();
			// pass along the event
			this.trigger(type, data);
		},
		/**
		 * reset the models based on the filter and sort
		 */
		redoFilter: function() {
			this.models = this.collection.filter(this._filter);
			var sort = this.comparator || this.collection.comparator;
			if (sort)
				this.models.sort(sort);
			this.length = this.models.length;
		}
	};

	/**
	 * will give back a function that will bind only called in a specific context
	 * @param  {Function} fn original function
	 * @param  {Object} bindee context to bind to
	 * @param  {Object} binder if called with this context then will bind
	 * @return {Function}
	 */
	var bindIf = function(fn, bindee, binder) {
		return function() {
			return fn.apply((
				this == binder ?
					bindee :
					this), [].slice.call(arguments));
		};
	};

	/**
	 * give a collection and filter function (and options) return the filtered collection
	 */
	Backbone.CF = function(collection, filter, options) {

		options = _.extend({}, options);

		// functions not to rebind
		var leaveBind = _.union(noBind, options.noBind);

		// setuo new collection
		var Filtered = function() {};
		Filtered.prototype = collection;
		var filtered = new Filtered();

		// add in instance variables
		_.extend(filtered, proto);
		filtered.collection = collection;
		filtered._filter = filter;
		if (options.comparator)
			filtered.comparator = options.comparator;
		filtered._callbacks = {};
		filtered._boundFns = [];

		// bind functions from parent
		for (var name in collection) {
			if (proto[name] === undefined &&
					!_.contains(leaveBind, name) &&
					_.isFunction(collection[name])) {
				filtered._boundFns.push(name);
				filtered[name] = bindIf(collection[name], collection, filtered);
			}
		}

		// setup and run the filter
		filtered.redoFilter();
		collection.on('all', filtered.onFilter, filtered);

		return filtered;
	};

});