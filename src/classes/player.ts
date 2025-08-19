import * as PIXI from 'pixi.js'
import * as Base from './base'
import * as settings from '../game_settings'
import * as textures from "../common/textures"
import {Bullet, bullets} from "./bullet"
import * as collisions from '../common/collisions'
import {Events} from '../common/events'
import {updateBulletText} from '../common/texts'
import {createExplosionAnim} from '../anims/explosion'
import {loseGame} from '../index'

export class Player extends Base.BaseUnit implements Base.Shooter {
    bullets_count = settings.base_player_bullets;
    can_shoot = true;
    shootCD = settings.timeouts.basePlayerShootCD;
    collision : ReturnType<typeof collisions.addBoxCollision> ;
    speed = settings.base_player_speed;
    container: PIXI.Container;
    moving_diraction = 0;
    img2: PIXI.Sprite
    anims?: {
        toRight?: PIXI.AnimatedSprite,
        toLeft?: PIXI.AnimatedSprite,
        fromRight?: PIXI.AnimatedSprite,
        fromLeft?: PIXI.AnimatedSprite,
    }
    onTick() {
        this.container.position.set(this.x, this.y)
        this.collision.setPosition(this.x, this.y)
    }
    constructor (x:number, y:number) {
        super(x, y, settings.base_player_hp)
        this.container = new PIXI.Container();
        this.container.position.set(x, y)

        this.img = new PIXI.Sprite(PIXI.Assets.get(textures.assets.ship_1))
        this.img.anchor.set(0.5)
        this.container.addChild(this.img)
        this.img.position.set(0, 0)

        this.img2 = new PIXI.Sprite(PIXI.Assets.get(textures.assets.ship_2))
        this.img2.anchor.set(0.5)
        this.container.addChild(this.img2)
        this.img2.position.set(0, 0)
        this.img2.alpha = 0;

        this.collision = collisions.addBoxCollision(x, y, this.img.width, this.img.height, this)

        Events.on(settings.event_names.onRestart, this.onRestart.bind(this))
    }
    shooting() {
        if (this.can_shoot) {
            const bullet = new Bullet(this.x, this.y - this.img.height/2, 1, -1)
            bullets.push(bullet)
            this.bullets_count -= 1;
            updateBulletText(this)
            this.can_shoot = false;
            if (this.bullets_count != 0) {
                setTimeout(() => {this.can_shoot = true}, this.shootCD)
            }
        }
    }
    onDeath(withoutAnim?:boolean) {
        this.container.alpha = 0;
        createExplosionAnim(this.x, this.y + 15, 1, loseGame)
        createExplosionAnim(this.x, this.y - 15, 1)
    }
    onRestart() {
        this.container.alpha = 1;
        this.hitpoints = settings.base_player_hp
    }
}

export function rechargePlayerBullets (player:Player) {
    player.bullets_count = settings.base_player_bullets;
    updateBulletText(player)
    player.can_shoot = true;
}

export function createPlayer (x:number, y:number ,app: PIXI.Application) {
    const player = new Player(x, y)
    app.stage.addChild(player.container)
    return player
}

