import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

const srcPath = path.resolve('src');
const outputPath = path.resolve('dist');

const assetsPublicPath = 'assets';

const svgoConfig = {
  removeViewBox: false
};
const fileLoaderConfig = {
  loader: 'file-loader',
  options: {
    name: resourcePath =>
      `${assetsPublicPath}/[name].[contenthash:8].${resourcePath.endsWith('.jpeg') ? 'jpg' : '[ext]'}`,
  }
};

export default env => ({
  devServer: {
    hot: true
  },
  devtool: env.production ? false : 'source-map',
  entry: path.resolve(srcPath, 'index.jsx'),
  mode: env.production ? 'production' : 'development',
  module: {
    rules: [
      // Transform React and plain JS files with babel
      {
        exclude: /^(.*\/)?node_modules\//,
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-transform-runtime'],
              presets: ['@babel/env', '@babel/preset-react']
            }
          }
        ]
      },
      // Compile SCSS and CSS files
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  ['postcss-line-height-px-to-unitless'],
                  [
                    'postcss-pxtorem',
                    {
                      mediaQuery: true,
                      propList: ['*'],
                      rootValue: 16
                    }
                  ]
                ]
              }
            }
          },
          'sass-loader'
        ]
      },
      // Allow SVG files to be imported as React components
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig
            }
          },
          fileLoaderConfig
        ]
      },
      // File loader for images
      {
        test: /\.(gif|jpe?g|png|webp)$/,
        use: [
          fileLoaderConfig
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['imagemin-gifsicle', { optimizationLevel: 3 }],
              'imagemin-jpeg-exif-rotate',
              ['imagemin-jpegoptim', { progressive: true }],
              ['imagemin-svgo', {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: svgoConfig
                    }
                  }
                ]
              }],
              ['imagemin-zopfli', { more: true, transparent: true }]
            ]
          }
        }
      })
    ]
  },
  output: {
    filename: '[name].[contenthash:8].js',
    path: outputPath
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(srcPath, 'static'),
          to: outputPath
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, 'index.html.ejs')
    }),
    new HtmlWebpackPlugin({
      filename: 'manifest.json',
      inject: false,
      template: path.resolve(srcPath, 'manifest.json.ejs')
    })
  ],
  resolve: {
    alias: {
      '~': srcPath
    },
    extensions: ['.jsx', '...']
  }
});
