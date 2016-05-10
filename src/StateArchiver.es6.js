import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import cookies from 'js-cookie';
import localStorageAvailable from './localStorageAvailable';

const T = React.PropTypes;
export class StateArchiver extends React.Component {
  static propTypes = {
    datum: T.object.isRequired,
    archiver: T.func.isRequired,
    tester: T.func,
  };

  constructor(props) {
    super(props);

    this.canArchive = props.tester ? props.tester() : true;
  }

  componentWillUpdate(nextProps) {
    if (this.canArchive) {
      const archiveDiff = this.buildDiffFromNextProps(nextProps);
      if (archiveDiff) {
        nextProps.archiver(archiveDiff);
      }
    }
  }

  buildDiffFromNextProps(nextProps) {
    const diff = {};
    const { datum } = nextProps;
    const keys = Object.keys(datum);
    let haveDiff = false;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = datum[key];

      // simple equaility comparison, matches the immutability constraints from redux / reselect
      if (value != this.props.datum[key]) {
        diff[key] = value;
        haveDiff = true;
      }
    }

    if (haveDiff) {
      return diff;
    }
  }

  render() { return false; }
}

/*
makeStateArchiver returns a React Component to be used in a subtree of
<Provdider /> from react-redux. It will listen to your redux state and archive that data
when it changes.

The arguments to makeStateArchiver are simliar to createSelector, pass in an array
of selectors that extract the data you from state you wish to serialize.

e.g. ```javascript
const themeSelector = (state) => return state.theme;
```

After your selectors, pass in a 'combiner' to merge the data from your selectors
into an object that will represent the overall state of data you wish to serialize;

e.g. ```javascript
const combiner = (theme) => ({ theme });
```

Finally pass in a state archiver, a function that takes an object, and persists it
in some manner. You probably will never pass this, as most apps can use the helper functions
`makeCookieArchiver` or `makeLocalStorageArchiver`; Note: Your archiver should be able
to deal with persisting the diff of what's output from your combiner.

Full example: ```javascript
import React from 'react';
import { Provider } from 'react-redux';
import { makeCookieArchiver } from '@r/redux-state-archiver';
import { UrlSync } from '@r/platform/components';
import App from './src/App';

const themeSelector = (state) => return state.theme;
const compactSelector = (state) => return state.compact;
const combiner = (theme, compact) => ({ theme, compact });
const CookieSync = makeCookieArchiver(
  themeSelector,
  compactSelector,
  combiner,
);

const renderApp = (store) => (
  <Provider store={ store }>
    <App />
    <UrlSync />
    <CookieSynce />
  </Provider>
);

```
*/
export const makeStateArchiver = (...funcs) => {
  let tester = funcs.pop();
  let archiver = funcs.pop();
  let combiner = funcs.pop();

  if (!combiner) {  // we don't have a tester, shuffle things around
    combiner = archiver;
    archiver = tester;
  }

  const selectorCombiner = (...args) => {
    return { datum: combiner(...args), archiver, tester };
  };

  const selector = createSelector(funcs, selectorCombiner);
  return connect(selector)(StateArchiver);
}

const applyArchiver = (datum, archiver) => {
  const keys = Object.keys(datum);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = datum[key];
    archiver(key, value);
  }
};

const persistCookieKeyValue = (key, value) => {
  if (typeof value === 'undefined') {
    cookies.remove(key);
  } else {
    cookies.set(key, value);
  }
};

const cookieArchive = (datum) => {
  applyArchiver(datum, persistCookieKeyValue);
}

export const makeCookieArchiver = (...funcs) => {
  funcs.push(cookieArchive);
  return makeStateArchiver(...funcs);
}

const persistLocalStorageKeyValue = (key, value) => localStorage.setItem(key, value);

const localStorageArchive = (datum) => {
  applyArchiver(datum, persistLocalStorageKeyValue);
};

export const makeLocalStorageArchiver = (...funcs) => {
  funcs.push(localStorageArchive);
  funcs.push(localStorageAvailable);
  return makeStateArchiver(...funcs);
};
