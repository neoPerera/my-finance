const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      port: 3000,
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      historyApiFallback: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'myfinance',
        filename: "remoteEntry.js",
        exposes: {
          "./axiosInstance": "./src/Components/Mechanisms/axiosInstance.js",
          "./SideBar": "./src/Components/Elements/SideBar-ant.js",
          "./HeaderAnt": "./src/Components/Elements/Header-ant.js",
          "./FooterAnt": "./src/Components/Elements/Footer-ant.js"
        },
        remotes: {
          reports: 'myfinanceReports@http://localhost:3001/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^19.1.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.1.0' },
          "react-router-dom": { singleton: true },
          axios: { singleton: true, eager: true },
          "antd": { singleton: true, requiredVersion: "^5.0.0" },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        publicPath: '/',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/manifest.json', to: 'manifest.json' },
        ],
      }),
    ],
    output: {
      publicPath: '/',
      clean: true,
    },
    performance: {
      hints: false, // 🚫 disables asset size warnings
    },
  };
};
