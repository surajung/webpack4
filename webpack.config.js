const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
module.exports = (env, argv) => {
   let sassSourceMapValue;
   const config = {
      entry: [
         './src/js/entry.js',
         './src/sass/main.scss',
         './src/sass/sub.scss'
      ],
      output: {
         path: path.resolve(__dirname, '../public/dist'),
         filename: 'js/bundle.js',
      },
      module: {
         rules: [
            {
               test: /\.js$/,
               include: [
                  path.resolve(__dirname, 'src/js')
               ],
               exclude: /node_modules/,
               loader: 'babel-loader',
            },
            {
               test: /\.s[ac]ss$/,
               use: [
                  {
                     loader: 'file-loader',
                     options: {
                        outputPath: 'css/',
                        name: '[name].css',
                     }
                  },
                  'extract-loader',
                  {
                     loader: 'css-loader',
                     options: {
                        sourceMap: sassSourceMapValue,
                     }
                  },
                  {
                     loader: 'sass-loader',
                     options: {
                        sourceMap: sassSourceMapValue,
                        sassOptions: {
                           outputStyle: 'compressed'
                        }
                     }
                  },
               ],
               exclude: /node_modules/
            }
         ]
      },
   };
 
   if (argv.mode === 'development') {
      sassSourceMapValue = true;
      config.devtool = 'source-map';
   }
   if (argv.mode === 'production') {
      sassSourceMapValue = false;
      config.plugins = [
         new CleanWebpackPlugin(),
      ]
   }
   return config;
}