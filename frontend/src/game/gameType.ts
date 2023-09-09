
export type Player = {
  hingeLeft: Matter.Body,
  hingeRight: Matter.Body,
  paddleLeft: Matter.Body,
  paddleRight: Matter.Body,
  stopperLeftTop: Matter.Body,
  stopperLeftBottom: Matter.Body,
  stopperRightTop: Matter.Body,
  stopperRightBottom: Matter.Body,
  jointLeft: Matter.Constraint,
  joinRight: Matter.Constraint
};
