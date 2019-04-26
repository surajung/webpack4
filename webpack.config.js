const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cleanOptions = {
    root: '',
    exclude: [''],
    verbose: true,
    dry: false
}

module.exports = {
    entry: ['@babel/polyfill', './src/js/entry.js', './src/sass/main.scss'],
    // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
        libraryTarget: 'var',
        library: 'EntryPoint',
    },
    module: {
        rules: [{
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src/js')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader?outputStyle=expanded'
                    // 'sass-loader?outputStyle=compressed'
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
        new MiniCssExtractPlugin({ filename: 'css/style.css' }),
        new CleanWebpackPlugin([
            'dist'
        ], cleanOptions)
    ],
    devtool: 'source-map',
    // https://webpack.js.org/concepts/mode/#mode-development
    mode: 'development'
};