
## Optimizer 框架特点
![GenOptimizer Structure](https://github.com/hellojuantu/image_border_optimizer/blob/compress_image/src/public/img/structure.jpeg?raw=true)
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