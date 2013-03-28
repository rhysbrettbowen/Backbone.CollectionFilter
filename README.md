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
