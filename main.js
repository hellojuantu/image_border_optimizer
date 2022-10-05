function __main() {  
    GenOptimizer.instance(function(o) {
        // MainScene
        let scene = MainScene.new(o)
        o.runWithScene(scene)
    })
}

__main()