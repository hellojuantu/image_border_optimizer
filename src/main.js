import "./public/css/datatable.min.css"
import "./public/css/app.css"
import "./public/css/optimzer.css"
import "./public/css/message.css"
import "./public/css/elementUI.css"
import "./public/css/dialog.css"
import "./public/js/hidpi-canvas.min"
import GenOptimizer from "./gen_optimizer/gen_optimizer";
import MainScene from "./scene/main_scene"

function __main() {
    GenOptimizer.instance(function (o) {
        let scene = MainScene.new(o)
        o.runWithScene(scene)
    })
}

__main()

