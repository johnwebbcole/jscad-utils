# jscad-utils
This is a colleciton of utilities for openjscad projects.

## Installation
Install `jscad-utils` using NPM:

```bash
npm install --save jscad-utils
```

## Basic usage
To use the utilities, you need to include the `jscad-utils.jscad` file and a copy of `lodash`.  

```javascript
include('node_modules/jscad-utils/jscad-utils.jscad');
include('node_modules/lodash/lodash.js');

main() {
  util.init(CSG);

}
```
