import "./public/styles/app.css"
import "./public/styles/optimzer.css"
import "./public/styles/message.css"
import "./public/styles/elementUI.css"
import "./public/styles/dialog.css"
import "./lib/hidpi-canvas.min"
import GenOptimizer from "./gen_optimizer/gen_optimizer";
import MainScene from "./scene/main_scene"

function __main() {
    GenOptimizer.instance(function (o) {
        let scene = MainScene.new(o)
        o.runWithScene(scene)
    })
}

__main()

