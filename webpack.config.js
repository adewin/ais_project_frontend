const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports ={
    mode: "development",
    plugins:[
        new vueLoaderPlugin(),
        new htmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            { test: /\.css$/, use:['style-loader', 'css-loader', 'sass-loader']},
            { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=29696&name=[hash:8]-[name].[ext]'},
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader'},
            { test: /\.vue$/, use: 'vue-loader'},
            { test: /\.js$/, use: 'babel-loader', exclude:/node_modules/}
        ]
    }
}