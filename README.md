<h1 align="center">
   <b>
        <a href="https://godolphinx.org"><img src="https://godolphinx.org/images/dolphin-platform-logo.svg" /></a><br>
    </b>
</h1>

<p align="center"> 一个快速开发软件的平台 </p>

<p align="center">
    <a href="https://godolphinx.org/"><b>Website</b></a> •
    <a href="https://godolphinx.org/vue3/description.html"><b>Documentation</b></a>
</p>

<div align="center">
  <a href="https://godolphinx.org">
    <img src="https://img.shields.io/npm/l/vue.svg?sanitize=true">
  </a>
  <a href="https://gitpod.io/#https://github.com/wangxiang4/dolphin-admin">
    <img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=flat-square">
  </a>
  <a href="https://discord.gg/DREuQWrRYQ">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true"/>
  </a>
</div>

## 🐬 介绍
海豚生态计划-打造一个web端,安卓端,ios端的一个海豚开发平台生态圈,不接收任何商业化,并且完全免费开源(包含高级功能)。

## 💪 愿景
让人人都可以快速高效的开发软件

## ✨ 特性
- **最新技术栈**：使用 Vue3/vite2 等前端前沿技术开发
- **TypeScript**: 集成TypeScript管控项目，具有可预测的静态类型，提高了代码的可读性、可维护性和可靠性
- **主题**：可配置的主题
- **国际化**：内置完善的国际化方案
- **权限**：内置完善的动态嵌套路由权限生成实现
- **组件**：二次封装了多个常用的组件
- **地图**：高德地图在线规划路线导航
- **多租户**：使用SASS提供独立的、隔离的数据管理，在线无缝切换多个租户数据
- **动画**：内部默认实现大量的动画过渡、让组件切换更加丝滑
- **UI组件库**：集成ant-design-vue,提供了一系列高质量、易于使用的组件,可快速迭代项目开发
- **图表组件**：集成echarts让图表组件开箱即用，提供了各种类型的图表和强大的可定制性
- **工具**：集成lodash，@vueuse/core，降低相关API的学习成本，提高工作效率，封装了诸多常用的函数和操作，让写vue3也可以甜甜的
- **状态管理**：集成pinia采用了基于函数式编程的方式来处理状态的更新和变化，更加直观的 API 和高性能的响应式状态管理方案
- **可拖拽**：集成SortableJS提供了用于创建可排序列表和网格的功能，可以用于实现拖放排序等交互式用户界面
- **富文本编辑器**：一个基于 JavaScript 的所见即所得的富文本编辑器，TinyMCE的功能非常灵活和高度可定制，开源版功能也比较齐全
- **高级表格组件**：集成vxe-table提供了丰富的表格功能和灵活的配置选项，可以用于展示和编辑各种类型的数据，同时也支持异步数据和虚拟滚动等优化性能的特性
- **渐进式网络应用程序**：集成vite-plugin-pwa，用于将Vue.js或其他前端应用程序转换为具有离线缓存和本地存储能力的PWA

## <img width="28" style="vertical-align:middle" src="https://godolphinx.org/images/hacktoberfest-logo.svg"> 黑客节
加入[Github HackToberFest](https://hacktoberfest.com/) 开始为此项目做出贡献.

## 🔨 开发目录

```
├─ dolphin-admin -- 海豚vue3-管理系统
│  ├─build -- 构建打包配置
│  │  ├─config -- 通用配置
│  │  ├─generate -- 资源生成配置(less变量,icon)
│  │  ├─script -- 附加构建脚本
│  │  ├─vite -- vite配置
│  ├─docker -- docker容器配置
│  ├─public -- 公共资源目录
│  ├─src -- 开发的目录
│  │  ├─api -- 请求接口
│  │  │  ├─common -- 通用请求数据类型(根据后端通用实体类定义)
│  │  │  │  ├─base -- 基础类型
│  │  │  │  ├─data -- 数据类型
│  │  │  ├─platform -- 微服务框架平台业务api
│  │  │  │  ├─common -- 通用业务模块api
│  │  │  │  ├─core -- 系统核心业务api
│  │  │  │  ├─monitor -- 运维监控业务模块api
│  │  │  │  ├─system -- 系统业务模块api
│  │  ├─assets -- 开发资源目录(会被打包编译)
│  │  ├─components -- 全局组件
│  │  │  ├─AMap -- 高德地图设计器
│  │  │  ├─Application -- 应用核心组件
│  │  │  ├─Authority -- 角色权限控制
│  │  │  ├─Basic -- 系统基础组件
│  │  │  ├─Button -- 按钮
│  │  │  ├─ClickOutSide -- 元素点击监听包装
│  │  │  ├─Container -- 组件包装容器
│  │  │  ├─ContextMenu -- 右击菜单上下文
│  │  │  ├─CountDown -- 验证码倒计时
│  │  │  ├─CountTo -- 计数器
│  │  │  ├─Cropper -- 图片裁剪
│  │  │  ├─Description -- 详细页面
│  │  │  ├─Drawer -- 弹出抽屉
│  │  │  ├─Dropdown -- 下拉列表
│  │  │  ├─Excel -- Excel导入导出
│  │  │  ├─Form -- 动态表单
│  │  │  ├─Icon -- icon图标
│  │  │  ├─Loading -- 加载遮罩层
│  │  │  ├─Markdown -- Markdown编辑器
│  │  │  ├─Menu -- 顶部菜单模式菜单
│  │  │  ├─Modal -- 弹出模态框
│  │  │  ├─Page -- 页面包装
│  │  │  ├─Qrcode -- 二维码生成
│  │  │  ├─Scrollbar -- 滚动条
│  │  │  ├─SimpleMenu -- 侧边栏菜单
│  │  │  ├─StrengthMeter -- 密码强度检查
│  │  │  ├─Table -- 动态表格
│  │  │  ├─Time -- 当前时间显示
│  │  │  ├─Tinymce -- 功能齐全的富文本编辑器
│  │  │  ├─Transition -- 过度动画
│  │  │  ├─Tree -- 树形控件
│  │  │  ├─Upload -- 文件上传
│  │  ├─directives -- 自定义指令
│  │  ├─enums -- 全局枚举
│  │  ├─hooks -- vue组合API钩子工具
│  │  │  ├─component -- 组件相关钩子
│  │  │  ├─core -- 系统核心相关钩子
│  │  │  ├─event -- 事件相关钩子
│  │  │  ├─setting -- 全局设置相关钩子
│  │  │  ├─web -- 网页相关钩子
│  │  ├─layouts -- 系统总布局
│  │  │  ├─default -- 默认总系统布局框架组件
│  │  │  ├─iframe -- 内嵌页面
│  │  │  ├─page -- 路由模块页面
│  │  ├─locales -- 国际化
│  │  ├─logics -- 系统全局控制逻辑
│  │  ├─router -- 路由
│  │  ├─settings -- 默认全局设置配置
│  │  ├─store -- 全局状态管理
│  │  ├─utils -- 工具类
│  │  │  ├─auth -- 存储授权信息缓存
│  │  │  ├─cache -- 缓存实例工具
│  │  │  ├─event -- 事件工具
│  │  │  ├─factory -- 组件工厂
│  │  │  ├─file -- 文件工具
│  │  │  ├─helper -- 路由转换帮助工具
│  │  │  ├─http -- api请求工具
│  │  │  ├─lib -- 图表组件库
│  │  ├─views -- 页面模块组件
│  │  │  ├─common -- 通用业务页面
│  │  │  ├─core -- 系统核心业务页面
│  │  │  ├─dashboard -- 仪表板分析页面
│  │  │  ├─level -- 多级菜单页面
│  │  │  ├─monitor -- 运维监控业务页面
│  │  │  ├─system -- 系统业务页面
│  ├─types -- 全局类型定义
```

## 🍀 需要注意的地方

### 1.打包前应该如何执行typescript类型检查
- **vite是不支持typescript类型检查,因为没必要,现在的开发工具都是支持eslint的,让开发工具接管类型检查就行啦**
- **vite官网TypeScript介绍:https://vitejs.bootcss.com/guide/features.html#typescript**
- **注意:既然vite不支持typescript类型检查,那我们就应该要在发布编译阶段手动执行 vue-tsc 命令检查类型是否符合typescript类型规范**


## 🤔 一起讨论
加入我们的 [Discord](https://discord.gg/DREuQWrRYQ) 开始与大家交流。

## 🤗 我想成为开发团队的一员！
欢迎😀！我们正在寻找有才华的开发者加入我们，让海豚开发平台变得更好！如果您想加入开发团队，请联系我们，非常欢迎您加入我们！💖

## 在线一键设置
您可以使用 Gitpod，一个在线 IDE（开源免费）来在线贡献或运行示例。

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/wangxiang4/dolphin-admin)

## 📄 执照
[Dolphin Development Platform 是获得MIT许可](https://github.com/wangxiang4/dolphin-admin/blob/master/LICENSE) 的开源软件 。

