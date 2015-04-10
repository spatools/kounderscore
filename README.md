# KoUnderscore 
[![Build Status](https://travis-ci.org/spatools/kounderscore.png)](https://travis-ci.org/spatools/kounderscore) 
[![Bower version](https://badge.fury.io/bo/kounderscore.png)](http://badge.fury.io/bo/kounderscore) 
[![NuGet version](https://badge.fury.io/nu/kounderscore.png)](http://badge.fury.io/nu/kounderscore)

Knockout Underscore integration.

## Installation

Using Bower:

```console
$ bower install kounderscore --save
```

Using NuGet: 

```console
$ Install-Package KoUnderscore
```

## Usage

You could use kounderscore in different context.

### Browser (AMD from source)

#### Configure RequireJS.

```javascript
requirejs.config({
    paths: {
        knockout: 'path/to/knockout',
        underscore: 'path/to/underscore',
        kounderscore: 'path/to/kounderscore'
    }
});
```

#### Load modules

```javascript
define(["knockout", "kounderscore"], function(ko, ko_) {
    var obsArray = ko.observableArray([...]);

    var regularFilteredArray = obsArray.filter(function(item) { return item.prop === value; });
    var computedFilteredArray = obsArray._filter(function(item) { ... });

    var computedArray = ko.computed(function() { return []; });
    ko_.addToSubscribable(computedArray);

    computedArray.filter(...);
});
```

### Browser (with built file)

Include built script in your HTML file.

```html
<script type="text/javascript" src="path/to/knockout.js"></script>
<script type="text/javascript" src="path/to/underscore.js"></script>
<script type="text/javascript" src="path/to/kounderscore.min.js"></script>
```

## Documentation

Documentation is hosted on 
[Github Wiki](https://github.com/spatools/kounderscore/wiki)