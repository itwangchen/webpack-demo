const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/js/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/html/index.ejs',
      chunks: ['style', 'jquery', 'index']
    }),
    new webpack.ProvidePlugin({
      $: 'jquery-1x',
      jQuery: 'jquery-1x'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{
      from: './src/static',
      to: 'static'
    }])
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /jquery/,
          name: 'jquery',
          chunks: 'all'
        },
        styles: {
          test: /[\\/]common[\\/].+\.css$/,
          name: 'style', // 这里是style，之前误写成了styles
          chunks: 'all',
          enforce: true
        }
      }

    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ie8: true
        }
      })
    ]
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-transform-modules-commonjs'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              // css中的图片路径增加前缀
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              // css中的图片路径增加前缀
              publicPath: '../'
            }
          },
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.ejs/,
        use: ['ejs-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
        use: [{
          loader: 'url-loader',
          options: {
            // 图片输出的实际路径(相对于dist)
            outputPath: 'images',
            // 当小于某KB时转为base64
            limit: 0
          }
        }]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'img:data-src', 'audio:src'],
            minimize: true
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            // 保留原文件名和后缀名
            name: '[name].[ext]',
            // 输出到dist/fonts/目录
            outputPath: 'fonts',
          }
        }
      }
    ]
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  // mode: "production"
};