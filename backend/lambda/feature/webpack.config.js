const path = require('path');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    entry: {
      lambda: path.resolve(__dirname, 'src/lambda.ts'),
    },
    externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          // Ignoring non-essential modules for Lambda deployment
          return lazyImports.includes(resource);
        },
      }),
    ],
  };
};
