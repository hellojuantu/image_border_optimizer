function __main() {  
    let optimizer = GenOptimizer.instance(function(o) {
        // close debug mode
        o.enableDebugMode(true)
        // MainScene
        var scene = MainScene.new(o)
        o.runWithScene(scene)
    })
    
    
}

__main()