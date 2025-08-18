import * as PIXI from "pixi.js";
import * as settings from './game_settings'
import * as textures from './common/textures'
import * as control from './common/control'
import {createPlayer, rechargePlayerBullets} from './classes/player'
import {Events} from './common/events'
import {system} from './common/collisions'
import {createAsteroid, asteroids, createBoss} from './classes/enemys'
import {getRandomInt, getDistance} from './common/utilFuncs'
import * as texts from './common/texts'
import {createExplosionAnim} from './anims/explosion'

export const app = new PIXI.Application();
await app.init({ 
    width: settings.game_width, 
    height: settings.game_height, 
    backgroundColor: 'black',
    antialias: true,
    resolution: 1,
    preference: 'webgl',
});
document.body.appendChild(app.canvas);
for (const value of Object.values(textures.assets)) {
    await PIXI.Assets.load(value)
}
PIXI.Assets.addBundle('fonts', [
    { alias: 'FascinateRegular', src: 'assets/font/FascinateRegular.ttf' },
  ]);
await PIXI.Assets.loadBundle('fonts');

const bgImg = PIXI.Assets.get(textures.assets.back);
const bg = new PIXI.Sprite(bgImg);
app.stage.addChild(bg);

const startGameButton = new PIXI.Container();
const buttonRect = new PIXI.Graphics();

startGameButton.addChild(buttonRect)

buttonRect.roundRect(0, 0, 370, 60, 16);
buttonRect.pivot.set(370/2, 30)
buttonRect.fill('rgba(28, 30, 39, 0.85)');
buttonRect.stroke({ width: 2, color: 0xff00ff });
buttonRect.interactive = true;
buttonRect.onclick = (event) => {
    if (current_game_stage == 0) {
        startGame()
    } else {
        restartGame()
        winText.alpha = 0;
        loseText.alpha = 0;
    }
    buttonRect.interactive = false;
    startGameButton.alpha = 0;
}
const buttonText = texts.buttonText
startGameButton.addChild(buttonText)
startGameButton.zIndex = 100;
buttonText.position.set(0,0)

const winText = texts.winText
winText.position.set(settings.game_width/2, settings.game_height/2 - 120)
winText.alpha = 0;
winText.zIndex = 100;
app.stage.addChild(winText);

const loseText = texts.loseText
loseText.position.set(settings.game_width/2, settings.game_height/2 - 120)
loseText.alpha = 0;
loseText.zIndex = 100;
app.stage.addChild(loseText);

const bulletsText = texts.bulletsText
bulletsText.position.set(0, 0)
bulletsText.alpha = 0;
app.stage.addChild(bulletsText);

const timerText = texts.timerText
timerText.position.set(settings.game_width, 0)
timerText.alpha = 0;
app.stage.addChild(timerText);

startGameButton.position.set(settings.game_width/2, settings.game_height/2)
app.stage.addChild(startGameButton);

export let player: ReturnType<typeof createPlayer>;
export let current_game_stage = 0;
let tiker : ReturnType<typeof app.ticker.add>;
let timer: ReturnType<typeof setInterval>;

let current_game_timer: number;
function startGameTimer () {
    current_game_timer = settings.levelTimer;
    texts.updateTimerText(current_game_timer)
    timer = setInterval(() => {
        current_game_timer--;
        texts.updateTimerText(current_game_timer)
        if (current_game_timer == 0) {
            loseGame()
        }
    }, 1000);
}
function stopGameTimer(){
    clearInterval(timer)
}
function startGame() {
    control.initKeyListener();
    startFirtsLevel()
    tiker = app.ticker.add((ticker) => {
        control.chekKeyPressed(ticker.deltaTime, player);
        Events.emit(settings.event_names.tick, ticker.deltaTime);
        system.checkAll((res) => {
            const {a, b} = res;
            if (a.userData?.collidable && b.userData?.collidable) {
                a.userData?.onCollide()
                b.userData?.onCollide()
            }
        });
        system.update();
    })
}
export let boss : ReturnType<typeof createBoss>;

function startFirtsLevel () {
    current_game_stage = 1;
    if (!player) {
        player = createPlayer(settings.game_width/2, settings.game_height - 100, app);
    }
    startGameTimer()
    rechargePlayerBullets(player)
    bulletsText.alpha = 1;
    while (asteroids.length < 8) {
        const local_x = getRandomInt(0 + settings.asteroid_radius + 10, 1100 - settings.asteroid_radius - 10)
        const local_y = getRandomInt(100 + settings.asteroid_radius + 10, 500 - settings.asteroid_radius)
        let can_make = true;
        for (let index = 0; index < asteroids.length; index++) {
            const element = asteroids[index];
            if (getDistance(local_x, local_y, element.x, element.y) < 100) {
                can_make = false
            }
        }
        if (can_make) {
            const asteroid = createAsteroid(local_x, local_y)
            asteroids.push(asteroid)
        }
    }
    timerText.alpha = 1;
}
export function startSecondLevel() {
    stopGameTimer()
    startGameTimer()
    current_game_stage = 2;
    rechargePlayerBullets(player)
    boss = createBoss(settings.game_width/2, 200)
}

export function loseGame() {
    control.stopKeyListener()
    stopGameTimer()
    player.x = settings.game_width/2;
    loseText.alpha = 1;
    buttonRect.interactive = true;
    startGameButton.alpha = 1;
    Events.emit(settings.event_names.onLose)
}

export function winGame() {
    stopGameTimer()
    control.stopKeyListener()
    player.x = settings.game_width/2;
    winText.alpha = 1;
    buttonRect.interactive = true;
    startGameButton.alpha = 1;
}

function restartGame () {
    control.startKeyListener();
    Events.emit(settings.event_names.onRestart)
    startFirtsLevel()
}
