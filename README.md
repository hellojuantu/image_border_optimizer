## Image-Border-Optimizer v2.5.1
## 轻量化图片编辑器

![GenOptimizer Demo](https://github.com/hellojuantu/image_border_optimizer/blob/compress_image/src/public/img/use_demo.gif?raw=true)

- [GenOptimizer 在线演示地址](https://genoptimizer.cn)

## 项目介绍

![GenOptimizer Demo](https://raw.githubusercontent.com/hellojuantu/image_border_optimizer/compress_image/src/public/img/demo.jpeg)

- 支持多图操作
- 支持图片拖拽添加
- 支持所有属性的动态配置
- 支持一键复制修改后的结果
- 支持画笔、文字、矩形、圆形、箭头、线条、图像的添加

这个项目没有依赖于前端框架, 以纯 JS 实现

最后抽象出了一个框架 ([GenOptimizer](doc/gen_optimizer.md)), 以一种十分简洁易用的方式写出了整个项目

## TODO
有问题欢迎提 Issue
- [ ] 支持画布组件层级 [Issue 4](https://github.com/hellojuantu/image_border_optimizer/issues/4)
- [ ] 支持图片不压缩为 ZIP 直接导出
- [ ] 支持图片导出设置图片名称和后缀


## 更新日志
### GenOptimizer v2.5.1
- 新增了 [TinyPng Api](https://tinypng.com/developers) 压缩导出图片功能（需要设置 Api Key）
- 新增了右边图片列表拖动排序功能
- 优化了项目，使用 WebPack 进行打包，Cloudflare 进行自动化发布

### GenOptimizer v2.5.0
- 大幅度提升图片加载速度, 大幅度提升用户使用体验
- 新增了剪贴板导入图片功能
- 新增了一键导出图片功能
- 新增了基于 ele 的 alert 样式
- 优化了拖拽图形体验, 拖拽不卡顿
- 优化了一键导出图片进度显示
- 优化了 loading 卡顿问题

### GenOptimizer v2.3.7
- 新增图形坐标, 长宽属性配置
- 优化了创建图形属性显示逻辑
- 优化了手机版访问时的体验, 使布局清晰
- 修复了缩放问题而导致的文字缩放异常的问题
- 修复了画布滚动时, 文字框的位置异常的问题
- 修复了空白画布调整大小没反应的问题
- 修复了图片背景缩放问题
- 修复了缩放或调整画布大小时背景图片闪动的问题

### GenOptimizer v2.3.6
- 修复了文字多行输入空格异常问题
- 修复了文字粘贴带富文本的问题
- 优化了整体文字输入体验

### GenOptimizer v2.3.5
- 优化了文字的多行输入, 提升了文字的输入体验
- 修复了 Canvas 缩放滚动条过大问题
- 修复了一些已知 BUG

### GenOptimizer v2.3.4
- 全局 HIDPI 支持, 绘制更高清的图形
- 修复了一些已知的 BUG

### GenOptimizer v2.3.3
- 优化了选中图形的层级显示
- 修复了图片拖拽边框的显示

### GenOptimizer v2.3.2
- 修复了全局图形边框清晰图问题
- 修复了文字绘制的基线问题

### GenOptimizer v2.3.1
- 新增了 "直线" 图案
- 新增了拖拽点的连接线
- 优化了文字层级显示逻辑
- 优化了文字编辑逻辑

### GenOptimizer v2.3.0
- 新增了修改画布大小的功能
- 新增了画布拖拽放入图片的功能
- 修复了图形点按层级问题

### GenOptimizer v2.2.9
- 优化了图形边框的逻辑
- 优化了拖拽点在图形边框上的逻辑
- 优化了图形的拖拽创建时的流畅度
- 优化了图形拖拽到某些 "临界点" 的抖动问题
- 优化了画布的 fps, 使得画布更加流畅

### GenOptimizer v2.2.8
- 新增了 "圆形" 图案
- 优化了图案创建的点按逻辑

### GenOptimizer v2.2.7
- 优化了项目公共资源结构, 使得项目更加清晰
- 优化了 icon 样式, 使得更加美观
- 新增了默认指针, 方便了图形选择切换

### GenOptimizer v2.2.6
- 修复了创建图形时的点按逻辑
- 修改了画笔按钮的图片

### GenOptimizer v2.2.5
- 新增了矩形的填充模式
- 新增了属性模板的选择器
- 优化了创建图形时的检查机制
- 优化了组件的使用方式
- 优化了组件事件的加载机制
- 优化了组件的模板机制

### GenOptimizer v2.2.4
- 优化了矩形的绘画方式, 使得矩形的绘画更加平滑
- 修复了矩形拖拽点位置不准确问题
- 修复了调节调整属性时, 按 Backspace 键会删除图形的问题

### GenOptimizer v2.2.3
- 修复了画板缩放后画笔轨迹不一致问题
- 修复了画板缩放后文字输入定位问题
- 优化了组件的使用方式

### GenOptimizer v2.2.2
- 新增了创建空白页面, 可以直接在空白页面上绘制
- 新增左边图片快照列表, 可以切换图片
- 新增了图片的删除功能, 优化删除逻辑
- 新增了图片的复制功能, 复制可以直接粘贴使用
- 优化了图形放置的点按逻辑
- 新增了画板缩放功能

### GenOptimizer v2.0.0
- 做了大量的优化, 优化了代码结构, 优化了代码逻辑, 优化了代码的可读性
- 优化了页面的布局, 优化了页面的交互

### GenOptimizer v1.0.0
- 拖拽上传图片
- 优化代码架构
- 添加可输入字体
- 添加常用图形 (矩形, 箭头)
- 添加键盘事件
- 给图形添加拖拽点, 全局 canvas cursor 需要加上
- 添加图形的删除
- 箭头图形的点击
- 添加图形的拖拽
- 拖拽点改为圆圈
- 添加拖拽点的拖拽 箭头, 矩形
- 图形激活后需要修改控制栏的参数
- 修复图片上传后 场景 刷新配置问题
- 优化切换图片保存修改内容