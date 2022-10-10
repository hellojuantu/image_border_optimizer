function __main() {  
    GenOptimizer.instance(function(o) {
        // o.enableDebugMode()
        // MainScene
        let scene = MainScene.new(o)
        o.runWithScene(scene)
    })
}

__main()