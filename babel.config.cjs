var jestConfig = (api) => {
  // Cache configuration is a required option
  api.cache(false);

  const presets = [
    [
      "@babel/preset-env",
      {
        useBuiltIns: false,
      },
    ],
  ];

  return { presets };
};

module.exports = jestConfig;
