/**
 * @program: dolphin-admin
 * @description: postcss代码解析工具配置
 * 它提供了一种方式用JavaScript代码来处理CSS,它负责把CSS代码解析成抽象语法树结构（Abstract Syntax Tree,AST）再交由插件来进行处理
 * 目前用到的插件:
 * 增加代码可读性 → postcss/autoprefixer
 * 官网文档: https://github.com/postcss/autoprefixer
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

module.exports = {
  plugins: {
    // autoprefixer插件转换css配置
    autoprefixer: {},
  },
};
