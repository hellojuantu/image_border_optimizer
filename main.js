function __main() {   
    GenOptimizer.instance(function(o) {
        var controls = GenControls.new(o)
        o.runWithControls(controls)
    })
}

__main()

/**
 * TODO
 * 1, 拖拽上传图片 ok
 * 2, 优化代码架构
 */