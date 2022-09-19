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
 * 1, 添加可输入字体 ok
 * 2, 添加常用图形 (矩形, 箭头)
 *  */ 
