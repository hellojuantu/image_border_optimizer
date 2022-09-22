function __main() {  
    GenOptimizer.instance(function(o) {
        var scene = MainScene.new(o)
        o.runWithScene(scene)
    })
}

__main()

/**
 * TODO
 * 1, 拖拽上传图片 ok
 * 2, 优化代码架构 ok
 * 3, 添加可输入字体 ok
 * 4, 添加常用图形 (矩形 [ctrl 画 正方形], 箭头) ok
 * 5, 给图形添加拖拽点
 *  */ 
