// Learn more https://docs.expo.io/guides/customizing-metro
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push(".cjs");

module.exports = config;
