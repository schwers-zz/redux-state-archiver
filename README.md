# @r/redux-state-archiver

makeStateArchiver returns a React Component to be used in a subtree of
<Provdider /> from react-redux. It will listen to your redux state and archive that data
when it changes.

The arguments to makeStateArchiver are simliar to createSelector, pass in an array
of selectors that extract the data you from state you wish to serialize.

```javascript
const themeSelector = (state) => return state.theme;
```

After your selectors, pass in a 'combiner' to merge the data from your selectors
into an object that will represent the overall state of data you wish to serialize;

```javascript
const combiner = (theme) => ({ theme });
```

Finally pass in a state archiver, a function that takes an object, and persists it
in some manner. You probably will never pass this, as most apps can use the helper functions
`makeCookieArchiver` or `makeLocalStorageArchiver`. These functions try to match the signature
of `connect` from 'react-redux', so you pass your selectors as arguments without wrapping them
in an array.

Note: Your archiver should be able to deal with persisting the diff of what's output from your combiner.

Full example:
```javascript
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
    <CookieSync />
  </Provider>
);

```
