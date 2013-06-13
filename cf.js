//v1.1.0

// ==========================================
// Copyright 2013 Dataminr
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define([
	'underscore',
	'backbone'
], function(_, Backbone) {

	var noBind = ['on', 'trigger', 'off', 'at', 'pluck', 'forEach', 'each',
		'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select',
		'reject', 'every', 'all', 'some', 'any', 'include', 'contains',
		'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
		'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle',
		'lastIndexOf', 'isEmpty', 'groupBy', 'toJSON'];

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
			} else if (type == 'remove' && this.simple) {
				this.models.splice(this.indexOf(data), 1);
				this.models.sort(this.comparator);
			}

			var filt;
			if (type === 'add' || type.indexOf('change') === 0)
				filt = this._filter(data);
			// don't pass along add if the model doesn't pass the filter
			if (type == 'add') {
				if (!filt) {
					return;
				} else if (this.simple) {
					this.models.push(data);
					this.models.sort(this.comparator);
				}
			}
			// if a change is made to a model that changes whether it is in
			// the collection then fire either add or remove
			if (type.indexOf('change') === 0 &&
					_.contains(this.models, data) != filt) {
				if (!this.simple)
					this.redoFilter();
				if (filt) {
					this.trigger('add', data);
					if (this.simple) {
						this.models.push(data);
						this.models.sort(this.comparator);
					}
				} else {
					this.trigger('remove', data);
					if (this.simple) {
						this.models.splice(this.indexOf(data), 1);
						this.models.sort(this.comparator);
					}
					return;
				}
			}
			// reset the models on any other event (just in case)
			if ((!this.simple && _.contains(this._filterChangeEvents, type)) ||
				(this.simple && type == 'reset')) {
				this.redoFilter();
			}

			// pass along the event
			this.trigger(type, data);
		},
		/**
		 * reset the models based on the filter and sort
		 */
		redoFilter: function() {
			this.models = this.collection.filter(this._filter);
			this.models.sort(this.comparator);
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
	var bindIf = function(that, fn, bindee) {
		var getFn = function() {
			var proto = Object.getPrototypeOf(that);
			while (proto && !proto[fn]) {
				proto = Object.getPrototypeOf(proto);
			}
			return proto && proto[fn];
		};
		return function() {
			return getFn().apply((
				this == that ?
					bindee :
					this), [].slice.call(arguments));
		};
	};

	/**
	 * give a collection and filter function (and options) return the filtered collection
	 */
	Backbone.CF = function(collection, filter, options) {
		options = _.extend({}, options);

		var leaveBind = _.union(noBind, options.noBind);

		// setuo new collection
		var Filtered = function() {};
		Filtered.prototype = collection;
		var filtered = new Filtered();
		filtered._filterChangeEvents = options.overrideDefaultEvents ?  [] : [
			'change',
			'reset',
			'add',
			'remove',
			'sort'
		];

		filtered.simple = options.simple;

		if (_.isArray(options.filterChangeEvents))
			filtered._filterChangeEvents =
				filtered._filterChangeEvents.concat(options.filterChangeEvents);

		// add in instance variables
		_.extend(filtered, proto);
		filtered.collection = collection;
		filtered._filter = filter;
		filtered.comparator = options.comparator ||
			collection.comparator ||
			function (a, b) {
				return collection.indexOf(a) - collection.indexOf(b);
			};
		filtered._callbacks = {};
		filtered._boundFns = [];

		// bind functions from parent
		for (var name in collection) {
			if (proto[name] === undefined &&
					!_.contains(leaveBind, name) &&
					_.isFunction(collection[name])) {
				filtered._boundFns.push(name);
				filtered[name] = bindIf(filtered, name, collection);
			}
		}
		filtered._events = {};
		// setup and run the filter
		filtered.redoFilter();
		collection.on('all', filtered.onFilter, filtered);

		return filtered;
	};

});