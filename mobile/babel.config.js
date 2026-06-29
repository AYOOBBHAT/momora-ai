module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Required by react-native-reanimated v4 (used by react-native-keyboard-controller).
    // Must remain the last plugin in the list.
    plugins: ['react-native-worklets/plugin'],
  };
};
