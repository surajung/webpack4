# webpack4
uidev 개발환경을 위한 webpack4 설정
> 참고 : https://poiemaweb.com/es6-babel-webpack-2

## webpack.config.js
```javascript
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
module.exports = (env, argv) => {
   let sassSourceMapValue;
   const config = {
      entry: [
         './src/js/result.js',
         './src/sass/company.scss',
         './src/sass/examination.scss'
      ],
      output: {
         path: path.resolve(__dirname, '../public/dist'),
         filename: 'js/ui_result.js',
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
```
## 삽질과정

### 특징
* output css 개수가 2개
    * 기업관리자와 응시화면
* webpack4

### 디렉토리 구조
* path : ../public/dist
* entry
    * ./src/js/result.js
    * ./src/sass/company.scss
    * ./src/sass/examination.scs
* output
    * js/ui_result.js
    * css/[name].css

### 복수개의 css 파일로 번들링 하기 위해 file-loader 사용
* 그렇다보니 webpack4 config가 적용되지 않음
    * devtool : 'source-map'는 js만 적용됨
    * MiniCssExtractPlugin는 단일번들링만 가능
* file-loader > options을 통해 source-map과 코드압축
    * (경고) map파일이 별도로 생성되지 않기때문에 용량이 너무 커짐, 92KB -> 302KB
    * development 모드에서만 source-map 적용해야 할듯

### development 와 production 적용
* webpack4부턴 mode가 내장되어 있기 때문에 cross-env 사용할 필요 없음
* 대신 내장된 mode를 사용하려면 module.exports 구조를 바꿔야 함
* sass-loader options 분기가 필요하여 변수로 받아 처리

```javascript
// dev, prod mode 적용 전
module.exports = {
    entry: ,
    output: ,
    module: ,
    devtool: 'source-map',
    mode: 'development'
}
 
// dev, prod mode 적용 후
module.exports = (env, argv) => {
    let sassSourceMapValue;  // sass-loader options 분기를 위한 변수 추가
    const config = {  // default 설정값
        entry: ,
        output: ,
        module: {
            rules: [
                {
                   test: /\.s[ac]ss$/,
                   use: [
                      {
                         loader: 'sass-loader',
                         options: {
                            sourceMap: sassSourceMapValue,  // sass-loader options 분기값
                            sassOptions: {
                               outputStyle: 'compressed'
                            }
                         }
                      },
                   ],
                },
            ]
        },
    }
    if (argv.mode === 'development') {
        sassSourceMapValue = true;  // sass-loader options 분기값 정의
        config.devtool = 'source-map';
        // ...
    }
    if (argv.mode === 'production') {
        sassSourceMapValue = false;  // sass-loader options 분기값 정의
        // ...
    }
    return config;
}
```
