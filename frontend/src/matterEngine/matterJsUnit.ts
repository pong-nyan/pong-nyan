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
        },
        inertia: Infinity,
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
