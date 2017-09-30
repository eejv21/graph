//let cuadros = {rect, rect1, rect2};
let r1 = new Rect(10, 10, 75, 75)
    .addTo(stage)
    .attr('fillColor', 'red')
    .animate(new KeyframeAnimation('2000ms', {

        from: { x: 200, y: 10 },
        to: { x: 100, y: 0 }
    }))
stage.addChild(r1)
r1.animate('4s', {
    rotation: Math.PI * 2
}, {
    easing: 'bounceIn'
})

let r2 = new Rect(10, 10, 75, 75)
    .addTo(stage)
    .attr('fillColor', 'blue')
    .animate(new KeyframeAnimation('2000ms', {
        from: { x: 100, y: 100 },
        to: { x: 200, y: 100 },
    }))
stage.addChild(r2)
r2.animate('4s', {
    rotation: Math.PI * 2
}, {
    easing: 'linear'
})
new Rect(10, 10, 75, 75)
    .addTo(stage)
    .attr('fillColor', 'yellow')
    .animate(new KeyframeAnimation('1000ms', {

        from: { x: 200, y: 200 },
        to: { x: 10, y: 10 }
    }))