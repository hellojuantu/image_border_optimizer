import GenOptimizer from "./gen_optimizer/gen_optimizer";
import MainScene from "./scene/main_scene"

function __main() {
    GenOptimizer.instance(function (o) {
        let scene = MainScene.new(o)
        o.runWithScene(scene)
    })
}

__main()

