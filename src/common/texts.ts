import * as PIXI from 'pixi.js'
import { Player } from '../classes/player';

export const winText = new PIXI.Text({
    text: 'YOU WIN!',
    style: {
        fontFamily: 'FascinateRegular',
        fontSize: 120,
        fill: 'rgba(236, 8, 8, 1)',
        align: 'center',
    },
    anchor : 0.5
});


export const loseText = new PIXI.Text({
    text: 'YOU LOSE!',
    style: {
        fontFamily: 'FascinateRegular',
        fontSize: 120,
        fill: 'rgba(236, 8, 8, 1)',
        align: 'center',
    },
    anchor : 0.5
});

export const buttonText = new PIXI.Text({
    text: 'Start Game',
    style: {
        fontFamily: 'FascinateRegular',
        fontSize: 60,
        fill: 'rgba(96, 121, 141, 0.85)',
        align: 'center',
    },
    anchor : 0.5
});

export const bulletsText = new PIXI.Text({
    text: 'Bullets: 10',
    style: {
        fontFamily: 'COMIC SANS MS',
        fontSize: 30,
        fill: 'rgba(156, 243, 16, 1)',
        align: 'center',
    }
});

export function updateBulletText (player: Player) {
    bulletsText.text = "Bullets: " + player.bullets_count
}

export const timerText = new PIXI.Text({
    text: '',
    style: {
        fontFamily: 'COMIC SANS MS',
        fontSize: 30,
        fill: 'rgba(156, 243, 16, 1)',
        align: 'left',
    },
    anchor : {x : 1, y : 0}
});

export function updateTimerText (num: number) {
    timerText.text = num;
}