// eslint-disable-next-line no-undef
module.exports = {
  presets: [
    'babel-preset-expo',
    '@babel/preset-typescript',
  ],
  plugins: [['@babel/plugin-transform-private-methods', { loose: true }]],
};