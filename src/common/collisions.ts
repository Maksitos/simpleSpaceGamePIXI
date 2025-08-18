import * as collisions from "detect-collisions"

export const system = new collisions.System();

export function addCirleCollision (x:number, y:number, radius: number, unit:object) {
    const circle = system.createCircle({x,  y}, radius)
    circle.userData = unit;
    return circle
}

export function addBoxCollision (x:number, y:number, width: number, height:number, unit:object) {
    const box = system.createBox({x, y}, width, height)
    box.userData = unit;
    return box
}
