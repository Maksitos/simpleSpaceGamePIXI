export function getRandomInt(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function getDistance(x1:number,y1:number, x2:number,y2:number) {
    const distance = Math.abs(x1-x2)^2 + Math.abs(y1-y2)^2
    return distance
}