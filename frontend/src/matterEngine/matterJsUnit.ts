import Matter from 'matter-js';

export function boundary(x: number, y: number , width: number, height: number) : Matter.Body {
    return Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
    });
};

export function ball(x: number, y: number, radius: number, collisionGroup: number) : Matter.Body {
    const halfAssetWidth = 315;
    const halfAssetHeight = 322;
    return Matter.Bodies.circle(x, y, radius, { 
        isStatic: false,
        label: 'Ball',
        collisionFilter: { group: collisionGroup },
        render: {
            sprite : {
                texture: '/assets/hairball.png',
                xScale: radius / halfAssetWidth,
                yScale: radius / halfAssetHeight
            }
        }
    })
}

export function sensorBar(x: number, y: number, width: number, height: number) : Matter.Body {
    return Matter.Bodies.rectangle(x, y, width, height, {
        label: 'Sensor', 
        isStatic: true, 
        isSensor: true, 
        render: { 
            visible: true, 
        }
    })
}
// export default function stopper(x, y, side, position) {
//     // determine which paddle composite to interact with
//     let attracteeLabel = (side === 'left') ? 'paddleLeftComp' : 'paddleRightComp';
//
//     return Matter.Bodies.circle(x, y, 40, {
//         isStatic: true,
//         render: {
//             visible: false,
//         },
//         collisionFilter: {
//             group: stopperGroup
//         },
//         plugin: {
//             attractors: [
//                 // stopper is always a, other body is b
//                 function(a, b) {
//                     if (b.label === attracteeLabel) {
//                         let isPaddleUp = (side === 'left') ? isLeftPaddleUp : isRightPaddleUp;
//                         let isPullingUp = (position === 'up' && isPaddleUp);
//                         let isPullingDown = (position === 'down' && !isPaddleUp);
//                         if (isPullingUp || isPullingDown) {
//                             return {
//                                 x: (a.position.x - b.position.x) * PADDLE_PULL,
//                                 y: (a.position.y - b.position.y) * PADDLE_PULL,
//                             };
//                         }
//                     }
//                 }
//             ]
//         }
//     });
// }
