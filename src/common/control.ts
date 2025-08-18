import * as player from "../classes/player"
import * as settings from '../game_settings'

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
}
let listenerBlocked = false;
 export function initKeyListener () {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space'){
            e.preventDefault();
            if (!keys.Space) {
                keys.Space = true;
            }
        }
        if (e.code === 'ArrowLeft'){
            e.preventDefault();
            if (!keys.ArrowLeft) {
                keys.ArrowLeft = true;
            }
            
        }
        if (e.code === 'ArrowRight'){
            e.preventDefault();
            if (!keys.ArrowRight) {
                keys.ArrowRight = true;
            }
            
        }
    })

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space' && keys.Space){
            keys.Space = false;
        }
        if (e.code === 'ArrowLeft'  && keys.ArrowLeft){
            keys.ArrowLeft = false;
        }
        if (e.code === 'ArrowRight' && keys.ArrowRight){
            keys.ArrowRight = false;
        }
    })
 }

export function stopKeyListener () {
    listenerBlocked = true;
}
export function startKeyListener () {
    listenerBlocked = false;
}

export function chekKeyPressed(deltaTime:number, player: player.Player) {
    if (listenerBlocked) {return}
    if (keys.ArrowLeft && !keys.ArrowRight) {
        if (player.x - player.img.width / 2 > 0) {
            if (player.moving_diraction != -1) {
                player.moving_diraction = -1;
                player.img2.alpha = 1;
                player.img2.scale.x = 1;
                player.img.alpha = 0;
            }
            player.x -= (player.speed * deltaTime) / 60
        }
    }
    if (keys.ArrowRight && !keys.ArrowLeft) {
        if (player.x + player.img.width / 2 < settings.game_width) {
            if (player.moving_diraction != 1) {
                player.moving_diraction = 1;
                player.img2.alpha = 1;
                player.img2.scale.x = -1;
                player.img.alpha = 0;
            }
            player.x += (player.speed * deltaTime) / 60
        }
    }
    if (keys.Space) {
        player.shooting()
    }

    if (!keys.ArrowRight && !keys.ArrowLeft) {
        player.moving_diraction = 0;
        player.img2.alpha = 0;
        player.img.alpha = 1;
    }
}
