## Image-Border-Optimizer v2.2.4
## 轻量化的图片编辑器
## 在线 DEMO
- [GenOptimizer 在线演示地址](https://hellojuantu.github.io/image_border_optimizer/)

![GenOptimizer Demo](demo.jpg)

## 项目特点
- 纯原生 JS 开发, 无三方框架
- 基于自研 Optimizer 框架为基础
- 支持图片拖拽添加
- 支持画笔、文字、图形 添加
- 支持所有属性动态配置
- 支持多图操作, 一键复制, 处处可用

## Optimizer 框架特点
- 事件、画图、交互 全局管理
- 支持注册自定义组件, 可自定义配置管理
- 基于面向对象, 高度抽象代码
- 简单易用, 能快速开发出各种效果

## Optimizer 框架使用
## 启动
首先需要场景管理器, 通过继承 GenScene 来创建场景, 场景里对于页面中的多个控制器进行管理
```JavaScript
class MainScene extends GenScene {
    constructor(optimizer) {
        super(optimizer)
    }
}
```
全局使用 instance 获取实例, 加载场景管理器, 最简单的 Optimizer 程序就启动了
```JavaScript
GenOptimizer.instance(function(o){
    let scene = MainScene.new(o)
    o.runWithScene(scene)
})
```
## 场景管理器
### 事件
#### 页面事件
```html
...
<div class='gen-auto-button-area'>
    <button class='gen-auto-button' data-value='config.arg1'>text</button>
</div>
...
```
```JavaScript
// 注册页面 class, 全局可用
this.registerPageClass({
    "buttonArea": 'gen-auto-button-area',
    ...
})

// 注册全局事件       
this.registerGlobalEvents([     
    {
        eventName: "click",
        // 事件绑定的元素区域
        className: sc.pageClass.buttonArea,
        // 在 所有 configToEvents 响应之 前 触发
        after: function(bindVar, target) {
            // bindVar: 绑定的变量
            // target: 事件触发的目标
        },        
        // 在 所有 configToEvents 响应之 后 触发
        before: function(bindVar, target) {
            // bindVar: 绑定的变量
            // target: 事件触发的目标
        },
        // 事件响应
        configToEvents: {
            // 自定义绑定的变量: 事件触发后的响应
            "config.arg1": function(target) {
                
            },
            "action.arg1": function(target) {
                
            },
            ...
        }
    },
    ...
])
```
#### 鼠标事件
```JavaScript
this.resgisterMouse(function(event, action) { 
    // event 是鼠标点击的事件
    // action 为鼠标点击的事件名称    
    if (action == 'mouseleave') {
        console.log('mouseleave canvas')
    } else if (action == 'up') {
        console.log('up canvas')
    } else if (action == 'down') {
        console.log('down canvas')
    } else if (action == 'move') {
        console.log('move canvas')
    }
})
```
#### 键盘事件
```JavaScript
this.registerAction("Backspace", status => {
    // status 为 'down' 时, 表示按下, 为 'up' 时, 表示松开
    console.log("Backspace", status)
})

this.registerAction("s", status => {
    // status 为 'down' 时, 表示按下, 为 'up' 时, 表示松开
    console.log("s", status)
})
```
### 组件
#### 注册组件
```JavaScript
this.bindComponent('attribute', GenComponent.new(
    this.insertAttribute,
    this.templateAttribute,
))

insertAttribute(data) {
    // 插入 html 组件到页面上 
    // 调用 this.template(data) 来获取 html 模板
}

templateAttribute(data) {
    // 组件的模板
    return `<div>...</div>`
}
```
#### 使用组件
```JavaScript
// 全局可使用组件
let data = ...
this.getComponent('attribute').buildWith(data)
```

## 更新日志

### GenOptimizer v2.2.4
- 优化了矩形的绘画方式, 使得矩形的绘画更加平滑 ok
- 修复了矩形拖拽点位置不准确问题 ok
- 修复了调节调整属性时, 按 Backspace 键会删除图形的问题 ok

### GenOptimizer v2.2.3
- 修复了画板缩放后画笔轨迹不一致问题 ok
- 修复了画板缩放后文字输入定位问题 ok
- 优化了组件的使用方式 ok

### GenOptimizer v2.2.2
- 新增了创建空白页面, 可以直接在空白页面上绘制 ok
- 新增左边图片快照列表, 可以切换图片 ok
- 新增了图片的删除功能, 优化删除逻辑 ok
- 新增了图片的复制功能, 复制可以直接粘贴使用 ok
- 优化了图形放置的点按逻辑 ok
- 新增了画板缩放功能 ok

### GenOptimizer v2.0.0
- 做了大量的优化, 优化了代码结构, 优化了代码逻辑, 优化了代码的可读性 ok
- 优化了页面的布局, 优化了页面的交互 ok

### GenOptimizer v1.0.0
- 拖拽上传图片 ok
- 优化代码架构 ok
- 添加可输入字体 ok
- 添加常用图形 (矩形, 箭头) ok
- 添加键盘事件 ok
- 给图形添加拖拽点, 全局 canvas cursor 需要加上 ok
- 添加图形的删除 ok
- 箭头图形的点击 ok
- 添加图形的拖拽 ok
- 拖拽点改为圆圈 ok
- 添加拖拽点的拖拽 箭头 ok, 矩形 ok
- 图形激活后需要修改控制栏的参数 ok
- 修复图片上传后 场景 刷新配置问题 ok
- 优化切换图片保存修改内容 ok