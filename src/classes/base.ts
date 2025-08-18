import * as PIXI from 'pixi.js'
import {Events} from '../common/events'
import * as settings from '../game_settings'
import {app, current_game_stage} from '../index'

export class BaseUnit {
    hitpoints: number;
    x: number;
    y: number;
    anim?: PIXI.AnimatedSprite;
    img?: PIXI.Sprite;
    collidable: boolean = true;
    onDeath() {};
    onTick(deltaTime?: typeof app.ticker.deltaTime) {};
    onTakeDamage?() {};
    takeDamage (damage:number) {
        this.hitpoints -= damage
        this.onTakeDamage?.()
        if (this.hitpoints <= 0) {
            this.onDeath()
        }
    };
    onCollide() {
        this.takeDamage(1)
    };

    constructor(x: number, y: number, hitpoints: number) {
        this.x = x;
        this.y = y;
        this.hitpoints = hitpoints;

        this.onTick = this.onTick.bind(this);
        Events.on(settings.event_names.tick, this.onTick)
    }

    destroy() {
        Events.off(settings.event_names.tick, this.onTick)
    };
}

export interface Shooter {
    shooting: Function;
}