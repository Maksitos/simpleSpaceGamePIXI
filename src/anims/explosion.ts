import * as PIXI from 'pixi.js'
import * as textures from "../common/textures"
import {app} from '../index'

export function createExplosionAnim(x:number, y:number, scale:number, onComplete? : Function) {
    const exp_sheet = PIXI.Assets.get(textures.assets.exposion)
    const explosion_anim = new PIXI.AnimatedSprite(exp_sheet.animations['explosion'])
    explosion_anim.anchor.set(0.5)
    explosion_anim.position.set(x, y)
    explosion_anim.scale.set(scale)
    explosion_anim.animationSpeed = 0.1;
    explosion_anim.loop = false;
    explosion_anim.zIndex = 100;
    app.stage.addChild(explosion_anim)
    explosion_anim.play()
    explosion_anim.onComplete = () => {
        explosion_anim.destroy()
        if (onComplete) {
            onComplete()
        }
    }
    
}