const fg = require('fast-glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 获取自动匹配到的入口文件夹名与路径
const getFolderArr = () => {
  return fg.sync(`src/views/*`, { absolute: true, onlyDirectories: true, markDirectories: true })
    .reduce((folderArr, folderPath) => {
      const match = folderPath.match(/src\/views\/(.*)\//);
      const folderName = match[1];
      return folderArr.concat({
        folderName,
        folderPath
      })
    }, []);
}

// 自动生成入口文件与 html 模板
const { entryObj, htmlArr } = (() => {
  const entryObj = {};
  const htmlArr = [];
  getFolderArr().forEach((fileObj) => {
    const { folderPath, folderName } = fileObj;
    entryObj[folderName] = `${folderPath}index.js`;
    htmlArr.push(new HtmlWebpackPlugin(
      (() => {
        let conf = {
          template: `${folderPath}index.html`,  // 模板来源
          filename: `./html/[contenthash].html`,  // 文件名称
          chunks: [folderName],  // 页面所需的js脚本，否则会导入所有js脚本
          inject: true,  // script标签放的位置
        };
        if (process.env.NODE_ENV === 'production') {
          conf = merge(conf, {
            minify: {  // 压缩html
              removeComments: true,  // 删除注释
              collapseWhitespace: true, // 删除空格
              minifyCSS: true,  // 删除样式中的空格
            },
            hash: true,  //可以避免js的缓存
          })
        }
        return conf
      })()
    ))
  });
  return {
    entryObj,
    htmlArr
  }
})();

module.exports = {
  entry: entryObj,
  plugins: [
    new CleanWebpackPlugin()
  ].concat(...htmlArr),
}
