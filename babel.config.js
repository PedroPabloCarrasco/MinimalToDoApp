module.exports = function(api) {
  api.cache(true); // Habilita el caching para mejor performance
  return {
    presets: ['babel-preset-expo'], // Usa el preset oficial de Expo
    plugins: [
      'react-native-reanimated/plugin' // Plugin necesario para react-native-reanimated
    ]
  };
};