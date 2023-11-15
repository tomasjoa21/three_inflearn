import { cm1, geo, mat, sounds } from './common';
import { Mesh } from 'three';
import { Stuff } from './Stuff';

export class Glass extends Stuff{
    constructor(info) {
        super(info);

        this.type = info.type;
        this.step = info.step;

        this.geometry = geo.glass;
        switch(this.type){
            case 'normal':
                this.material = mat.glass1;
                this.mass = 1;
                break;
            case 'strong':
                this.material = mat.glass2;
                this.mass = 0; //무게가 0이면 물리적인 영향을 받지 않아 아래로 떨어지지 않음
                break;
        }

        this.width = this.geometry.parameters.width;
        this.height = this.geometry.parameters.height;
        this.depth = this.geometry.parameters.depth;

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.name = this.name;
        this.mesh.step = this.step;
        this.mesh.type = this.type;
        cm1.scene.add(this.mesh);

        this.setCannonBody(); //캐논물리객체를 만들어주는 함수

        // cannon 물리객체 생성(실행)후 sound를 재생해야 함
        // glass객체에 collide이벤트(충돌이벤트) 발생시 sound를 재생하는 이벤트리스너를 추가
        this.cannonBody.addEventListener('collide', playSound);

        const sound = sounds[this.type];
        function playSound(e){
            const strength = e.contact.getImpactVelocityAlongNormal();
            // console.log(strength);
            //충돌이 최소 5 이상일 때만 소리가 나도록 설정
            if(strength > 5){
                sound.currentTime = 0; //소리가 끝나기 전에 재생위치를 처음으로 되돌림
                sound.play();
            }
        }
    }
}