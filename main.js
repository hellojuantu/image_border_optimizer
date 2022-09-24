function __main() {  
    GenOptimizer.instance(function(o) {
        var scene = MainScene.new(o)
        o.runWithScene(scene)
    })
}

__main()

/**
 * TODO
 *  1,  拖拽上传图片 ok
 *  2,  优化代码架构 ok
 *  3,  添加可输入字体 ok
 *  4,  添加常用图形 (矩形 [ctrl 画 正方形], 箭头) ok
 *  5,  添加键盘事件 ok
 *  6,  给图形添加拖拽点, 全局 canvas cursor 需要加上 ok
 *  7,  添加图形的删除 ok
 *  8,  箭头图形的点击 ok
 *  9,  添加图形的拖拽 ok
 * 10,  拖拽点改为圆圈 ok
 * 11,  添加拖拽点的拖拽 箭头 ok, 矩形
 *  */ 
