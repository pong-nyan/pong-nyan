import { Bodies, Body } from 'matter-js';

export function boundary(x: number, y: number , width: number, height: number) : Body {
    return Bodies.rectangle(x, y, width, height, {
        isStatic: true,
    });
};

export function stopper(x: number, y: number, radius: number, group: number, label: string) : Body {
    return Bodies.circle(x, y, radius, { 
        label,
        isStatic: true, 
        collisionFilter: {
             group: group 
        }, 
        render: {
            visible: true
        }
    });
}

export function ball(x: number, y: number, radius: number, collisionGroup: number) : Body {
    const halfAssetWidth = 315;
    const halfAssetHeight = 322;
    return Bodies.circle(x, y, radius, { 
        label: 'Ball',
        isStatic: false,
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

export function sensorBar(x: number, y: number, width: number, height: number) : Body {
    return Bodies.rectangle(x, y, width, height, {
        label: 'Sensor', 
        isStatic: true, 
        isSensor: true, 
        render: { 
            visible: true, 
        }
    })
}
