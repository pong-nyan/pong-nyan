import { World, Bodies, Body } from 'matter-js';

export const hinge = (x: number, y: number, radius: number, label: string, group: number) : Body => {
  return Bodies.circle(x, y, radius, {
    label,
    isStatic: true,
    render: {
      visible: true
    },
    collisionFilter: {
      group: group 
    },
  });
};

export const paddle = (x: number, y: number, width: number, height: number, label: string, group: number) : Body => {
  const assetWidth = 1731 / 2;
  // const assetHeight = 587;
  return Bodies.rectangle(x, y, width, height, {
    label,
    isStatic: false,
    density: 2,
    render: {
      sprite : {
        texture : label == 'PaddleLeft' ? '/assets/flat-fish-left.png' : '/assets/flat-fish-right.png',
        xScale: width / assetWidth,
        yScale: 0.1,
      }
    },
    restitution: 0,
    collisionFilter: {
      group: group 
    },
  });
};

export const boundary = (x: number, y: number, width: number, height: number) : Body => {
  return Bodies.rectangle(x, y, width, height, {
    isStatic: true,
  });
};

export const stopper = (x: number, y: number, radius: number, group: number, label: string) : Body => { 
  return Bodies.circle(x, y, radius, { 
    label,
    isStatic: true, 
    collisionFilter: {
      group: group 
    },
    restitution: 0, 
    render: {
      visible: false
    }
  });
};

export const ball = (x: number, y: number, radius: number, collisionGroup: number) : Body => {
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
    // mass: 0.5,
    // inverseMass: 2,
  });
};

export const sensor = (loserName: string, x: number, y: number, width: number, height: number) : Body => {
  return Bodies.rectangle(x, y, width, height, {
    label: loserName, 
    isStatic: true, 
    isSensor: true, 
    render: { 
      visible: false, 
    }
  });
};

/**
 * label을 통해 찾아주는 함수
 * @param world
 * @param label
 * @returns Body
 */
export const findTarget = (world: World, label: string ) : Body => {
  return world.bodies.find(body => body.label === label) as Body;
};

export const findTargetAll = (world: World, label: string ) : Body[] => {
  return world.bodies.filter(body => body.label === label) as Body[];
};
