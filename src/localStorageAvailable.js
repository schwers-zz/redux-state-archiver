const FEATURE_TEST_LOCAL_STORAGE = 'redux__start__archiver__local__storage__test';

export default function localStorageAvailable() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(FEATURE_TEST_LOCAL_STORAGE, 'yes');
      if (localStorage.getItem(FEATURE_TEST_LOCAL_STORAGE) === 'yes') {
        return true;
      }
    }
  } catch (e) {
    return false;
  }

  return false;
}
