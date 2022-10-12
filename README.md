## Image-Border-Optimizer v2.3.6
## 一款纯 JS 实现的轻量化图片编辑器

![GenOptimizer Demo](https://genoptimizer.cn/public/img/demo.jpeg)

- [GenOptimizer 在线演示地址](https://genoptimizer.cn)
## 项目介绍
- 支持多图操作
- 支持图片拖拽添加
- 支持所有属性的动态配置
- 支持一键复制修改后的结果
- 支持画笔、文字、矩形、圆形、箭头、线条、图像的添加

这个项目没有依赖于任何的第三方框架, 以纯 JS 实现

最后抽象出了一个框架 (GenOptimizer), 以一种十分简洁易用的方式写出了整个项目

## Optimizer 框架特点
![GenOptimizer Structure](https://genoptimizer.cn/public/img/structure.jpeg)
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
## 场景管理器 (Scene)
### 事件 (Event)
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
### 组件 (Component)
#### 注册组件
```JavaScript
class MyComponent extends GenComponent {
    constructor(control) {
        super(control.scene)
        this.control = control
    }
    ...
}

this.bindComponent('attribute', MyComponent.new(this))
```
#### 使用组件
```JavaScript
// 全局可使用组件
let data = ...
this.getComponent('attribute').buildWith(data)
```

## 总结
这是一款可拖拽、低代码、轻量化的图片编辑器, 解决了繁琐处理图片的问题

有时候一些小的操作, 都可能引发我们的思考, 如何才能更方便的处理这一类的问题?

这个例子就是我的思考, 希望能给于你一点灵感或启发.