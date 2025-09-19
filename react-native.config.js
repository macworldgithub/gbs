module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: null, // Prevents Gradle from trying to compile JNI code
      },
    },
  },
};
