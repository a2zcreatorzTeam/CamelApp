module.exports = {
  dependencies: {
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android-exoplayer',
        },
      },
      assets: ['./assets/fonts/'], // This should be outside the 'platforms' object
    },
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
};
