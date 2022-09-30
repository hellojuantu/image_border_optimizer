function __main() {  
    let optimizer = GenOptimizer.instance(function(o) {
        // close debug mode
        o.enableDebugMode(false)
        // MainScene
        var scene = MainScene.new(o)
        o.runWithScene(scene)
    })
    
    
}

__main()