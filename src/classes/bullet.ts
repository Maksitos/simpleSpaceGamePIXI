import * as PIXI from 'pixi.js'
import * as Base from './base'
import * as settings from '../game_settings'
import * as collisions from '../common/collisions'
import {app, loseGame, current_game_stage, boss, player} from '../index'
import {asteroids} from './enemys'

export let bullets : Bullet[] = []; 

export class Bullet extends Base.BaseUnit {
    name = 'bullet';
    graf: PIXI.Graphics;
    collision: ReturnType<typeof collisions.addCirleCollision> ;
    bullet_direction: 1 |-1;
    constructor (x:number, y:number, hitpoints: number, bullet_direction: 1| -1) {
        super(x, y, hitpoints)
        this.bullet_direction = bullet_direction;
        this.graf = new PIXI.Graphics()
        this.graf.circle(0, 0, settings.bullet_radius)
        this.graf.fill(settings.bullet_color)
        this.graf.position.set(this.x, this.y)
        app.stage.addChild(this.graf)
        this.collision = collisions.addCirleCollision(x, y, settings.bullet_radius, this)
        this.collision.setPosition(x, y)
    }

    onTick() {
        this.y += this.bullet_direction * settings.bullet_speed;
        this.collision.setPosition(this.x, this.y)
        this.graf.position.set(this.x, this.y)
        if (this.y < 0 || this.y > settings.game_height) {
            this.onDeath();
        }
    }
    onCollide(): void {
        this.collidable = false;
        super.onCollide()
    }
    onDeath(): void {
        collisions.system.remove(this.collision)
        if (player.bullets_count == 0)  {
            if (current_game_stage == 1) {
                if (asteroids.length > 0) {
                    loseGame()
                }
            }
            if (current_game_stage == 2) {
                if (boss.hitpoints > 0) {
                    loseGame()
                }
            }
        }
        this.destroy()
        this.graf.destroy();
        bullets = bullets.filter(b => b !== this);
    }
}

