# Backbone.CollectionFilter #

given a collection and a filter (and optional comparator) return a collection that mimics it's parent only with a filtered set of models.

## Use ##

```javascript
var EnhancedCollection = Backbone.Collection.extend({
	enhance: true
});

var myCollection = new EnhancedCollection();

var notGreenCollection = new Backbone.CollectionFilter(myCollection, function(child) {
	return child.get('color') !== 'green';
});
```

the filtered collection will inherit all functions and bind them to the original collection except on, off, trigger, at and pluck. It will even return the paramaters set on the parent collection (e.g. notGreenCollection.enhance === true) unless you set the parameter on the instance (so make sure you use setters, e.g. notGreenCollection.setEnhance(false) instead of notGreenCollection.enhance = false).

##BOUNS!##

added in multifilter.js which requires CF but makes it easy to add mutiple filters on and off a collection:

```javascript
var filters = {
	isGreen: function(model) {
		return model.get('color') == 'green';
	},
	isSquare: function(model) {
		return model.get('shape') == 'square';
	}
};

myCollection = Multifilter(myCollection, filters);

myCollection.addFilter('isGreen'); // now only greens will show
myCollection.addFilter('isSquare'); // now only green squares
myCollection.removeFilter('isGreen'); // now only squares
```

#Changelog

##v1.1.0

add in options simple that will only filter the changes - use only for filter functions that rely on the model change

##v1.0.3

functions are now dynamically bound, only resolve function to bind when called

##v1.0.2

- can pass in extra events to redo filter on

##v1.0.1

- give new events array
- only redo fiter on certain events

##v1.0.0

-initial versioning
