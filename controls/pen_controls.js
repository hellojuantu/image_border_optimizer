class PenControls extends GenControls {
    constructor(scene) {
        super(scene)
        this.setup()
    }

    drawLine(beginPoint, controlPoint, endPoint) {
        let context = this.context
        context.beginPath()
        context.moveTo(beginPoint.x, beginPoint.y)
        context.strokeStyle = beginPoint.color
        context.lineWidth = beginPoint.lineWidth
        context.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
        context.stroke()
    }

    draw() {
        let self = this
        // windowOfPoint size > 3
        let windowOfPoints = []
        // 遍历数组元素, 画线
        let beginPoint = null
        let points = self.points
        // log("points", points)
        for (let point of points) {
            windowOfPoints.push(point)
            // 
            let status = point.status
            if (status == 'down') {
                beginPoint = point
            } else if (status == 'move') {
                if (windowOfPoints.length <= 3) {
                    continue
                }
                const lastTwoPoints = windowOfPoints.slice(-2)
                const controlPoint = lastTwoPoints[0]
                const endPoint = GenPoint.new(
                    (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                    (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
                    'move'
                )
                endPoint.copyPropertyFrom(beginPoint)
                self.drawLine(beginPoint, controlPoint, endPoint)
                beginPoint = endPoint
            } else if (status == 'up') {
                if (windowOfPoints.length <= 3) {
                    continue
                }
                const lastTwoPoints = windowOfPoints.slice(-2)
                const controlPoint = lastTwoPoints[0]
                const endPoint = lastTwoPoints[1]
                self.drawLine(beginPoint, controlPoint, endPoint)
                beginPoint = null
                windowOfPoints = []
            }
        }
    }

    setup() {
        let self = this
        self.points = []
        self.optimizer.resgisterMouse(function(event, action) {
            // 'true' => true (boolean)
            if (!parseBoolean(config.penEnabled.value)) {
                return
            }
            // log("action", action)
            let x = event.offsetX
            let y = event.offsetY
            if (action == 'move' || action == 'down' || action == 'up') {
                self.addPoint(x, y, action)
            }
        })
    }

    addPoint(x, y, status) {
        this.points.push(GenPoint.new(x, y, status))
    }

    resetAndUpdate(points) {
        this.points = points
    }
}