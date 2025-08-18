import * as PIXI from 'pixi.js'
import * as Base from './base'
import {app, startSecondLevel, winGame} from '../index'
import * as collisions from '../common/collisions'
import * as textures from "../common/textures"
import * as settings from '../game_settings'
import {Bullet, bullets} from "./bullet"
import {getRandomInt} from '../common/utilFuncs'
import {createExplosionAnim} from '../anims/explosion'
import {Events} from '../common/events'

export let asteroids: ReturnType<typeof createAsteroid>[] = [];
class Asteroid extends Base.BaseUnit {
    collision: ReturnType<typeof collisions.addCirleCollision> ;
    constructor(x:number, y:number) {
        super(x, y, 1)
        const asteroid_sheet = PIXI.Assets.get(textures.assets.asteroid)
        this.anim = new PIXI.AnimatedSprite(asteroid_sheet.animations['asteroid'])
        this.anim.animationSpeed = 0.3;
        this.anim.loop = false;
        this.anim.anchor.set(0.5);
        this.anim.position.set(x, y);
        this.anim.scale.set(1.4)

        this.collision = collisions.addCirleCollision(x, y, settings.asteroid_radius, this)
        this.collision.setPosition(x, y)

        Events.on(settings.event_names.onLose, this.onLose.bind(this))
    }
    onTakeDamage(): void {
    }
    onLose () {
        this.onDeath(true)
    }
    onDeath(withoutAnim?:boolean) {
        asteroids = asteroids.filter(a => a !== this);
        if (withoutAnim) {
            this.anim.destroy()
        } else {
            this.anim.play()
            this.anim.onComplete = () => {
                this.anim.destroy()
                if (asteroids.length == 0) {
                    startSecondLevel()
                }
            }
        }
        collisions.system.remove(this.collision)
    }
}

export function createAsteroid(x:number, y:number) {
    const asteroid = new Asteroid(x, y);
    app.stage.addChild(asteroid.anim)
    return asteroid
}

class Boss extends Base.BaseUnit implements Base.Shooter{
    collision: ReturnType<typeof collisions.addCirleCollision> ;
    boss_engine_right?: PIXI.AnimatedSprite;
    boss_engine_left?: PIXI.AnimatedSprite;
    boss_hp_bar?: PIXI.AnimatedSprite;
    container: PIXI.Container;
    direction = 0;
    speed = settings.boss_speed;
    shootTimer: ReturnType<typeof setInterval>;
    shootCD = settings.timeouts.bossShootCD;
    constructor(x:number, y:number) {
        super(x, y, settings.boss_hp)
        this.container = new PIXI.Container();
        this.container.position.set(x, y)
        this.img = new PIXI.Sprite(PIXI.Assets.get(textures.assets.boss_ship))
        this.img.anchor.set(0.5)
        this.container.addChild(this.img)
        this.img.position.set(0, 0)

        const boss_engine_sheet = PIXI.Assets.get(textures.assets.boss_engine)
        this.boss_engine_right = new PIXI.AnimatedSprite(boss_engine_sheet.animations['boss_engine'])
        this.boss_engine_right.animationSpeed = 0.3;
        this.boss_engine_right.loop = true;
        this.boss_engine_right.anchor.set(0.5);
        this.container.addChild(this.boss_engine_right)
        this.boss_engine_right.position.set(60, 0);
        this.boss_engine_right.rotation = 90 * Math.PI / 180;
        this.boss_engine_right.play()
        this.boss_engine_right.alpha = 0;

        this.boss_engine_left = new PIXI.AnimatedSprite(boss_engine_sheet.animations['boss_engine'])
        this.boss_engine_left.animationSpeed = 0.3;
        this.boss_engine_left.loop = true;
        this.boss_engine_left.anchor.set(0.5);
        this.container.addChild(this.boss_engine_left)
        this.boss_engine_left.position.set(-60, 0);
        this.boss_engine_left.rotation = -90 * Math.PI / 180;
        this.boss_engine_left.scale._x = -1;
        this.boss_engine_left.play()
        this.boss_engine_left.alpha = 0;

        const boss_hp_bar_sheet = PIXI.Assets.get(textures.assets.boss_hp_bar)
        this.boss_hp_bar = new PIXI.AnimatedSprite(boss_hp_bar_sheet.animations['boss_hp_bar'])
        this.boss_hp_bar.anchor.set(0.5);
        this.boss_hp_bar.scale.set(2)
        this.container.addChild(this.boss_hp_bar)
        this.boss_hp_bar.position.set(0, - 70)

        this.collision = collisions.addCirleCollision(x, y, settings.boss_radius, this)
        this.collision.setPosition(x, y)

        Events.on(settings.event_names.onRestart, this.onRestart.bind(this))
        Events.on(settings.event_names.onLose, this.onLose.bind(this))
    }
    onTick(deltaTime: typeof app.ticker.deltaTime) {
        if (this.x > 0 + this.img.width/2 && this.direction == -1) {
            this.x += this.direction * this.speed * deltaTime / 60
            this.boss_engine_left.alpha = 0;
            this.boss_engine_right.alpha = 1;
        } else if (this.x < settings.game_width - this.img.width/2 && this.direction == 1){
            this.x += this.direction * this.speed * deltaTime / 60
            this.boss_engine_left.alpha = 1;
            this.boss_engine_right.alpha = 0;
        } else {
            this.boss_engine_left.alpha = 0;
            this.boss_engine_right.alpha = 0;
        }
        this.container.position.set(this.x, this.y)
        this.collision.setPosition(this.x, this.y)
    }
    onTakeDamage(): void {
        const frame = 4 - this.hitpoints
        this.boss_hp_bar.gotoAndStop(frame)
    }
    onDeath(withoutAnim?:boolean) {
        this.destroy()
        stopBossShooting(this)
        collisions.system.remove(this.collision)
        this.direction = 0;
        this.container.destroy()
        if (!withoutAnim) {
            createExplosionAnim(this.x -30, this.y - 30, 1, winGame)
            createExplosionAnim(this.x + 30, this.y - 30, 1)
            createExplosionAnim(this.x -30, this.y + 30, 1)
            createExplosionAnim(this.x +30, this.y + 30, 1)
        }
    }
    shooting() {
        const bullet = new Bullet(this.x, this.y + this.img.height/2 + settings.bullet_radius, 1, 1)
        bullets.push(bullet)
    }
    onLose() {
        this.onDeath(true)
    }
    onRestart () {
        this.onDeath(true)
    }
}

function randomDirectionMoving(boss:Boss) {
    if (boss.hitpoints < 1) {return};
    const randomTime = getRandomInt(500, 3000);
    let randomDirection = getRandomInt (-1, 1);
    while (randomDirection == boss.direction) {
        randomDirection = getRandomInt (-1, 1);
    };
    boss.direction = randomDirection;
    setTimeout( () => {
        randomDirectionMoving(boss)
    }, randomTime)
}

function startBossShooting(boss:Boss) {
    boss.shootTimer = setInterval(() => {
        if (boss.hitpoints > 0) {
            boss.shooting()
        }
    }, boss.shootCD);
}
function stopBossShooting(boss:Boss) {
    clearInterval(boss.shootTimer)
}


export function createBoss(x:number, y:number) {
    const boss = new Boss(x, y);
    app.stage.addChild(boss.container)
    randomDirectionMoving(boss)
    startBossShooting(boss)
    return boss
}