//v1.0.0

// ==========================================
// Copyright 2013 Dataminr
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define([
	'Backbone.CollectionFilter',
	'underscore'
], function(CF) {

	return function(collection, filters) {

		var on = [];

		if (filters.on) {
			on = _.values(_.pick(filters, filter.on));
		}

		var filter = function(model) {
			var length = on.length;
			for (var i = 0; i < length; i++) {
				if (!on[i](model))
					return false;
			}
			return true;
		};

		var cf = new CF(collection, filter);

		cf.addFilter = function(name) {
			var fn = filters[name];
			if (!fn)
				return false;
			if (on.indexOf(fn) > -1)
				return true;
			on.push(fn);
			this.redoFilter();
			this.trigger('reset');
			return true;
		};

		cf.removeFilter = function(name) {
			var fn = filters[name];
			if (!fn)
				return false;
			on.splice(on.indexOf(fn), 1);
			this.redoFilter();
			this.trigger('reset');
			return true;
		};

		return cf;
	};

});