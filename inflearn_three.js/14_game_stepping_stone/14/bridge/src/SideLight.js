import { cm1, cm2, geo, mat } from './common';
import { Mesh } from 'three';

export class SideLight {
    constructor(info) {
        // super(info); //상속을 받고 있지 않으므로 주석처리

        const container = info.container || cm1.scene;

        this.name = info.name || '';
        this.x = info.x || 0;
        this.y = info.y || 0;
        this.z = info.z || 0;

        this.geometry = geo.sideLight;
        this.material = mat.sideLight;

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(this.x, this.y, this.z);
        // this.mesh.castShadow = true; //그림자를 만들어내는 속성
        // this.mesh.receiveShadow = true; //그림자를 받아들이는 속성
        container.add(this.mesh);
    }

    turnOff(){
        this.mesh.material.color.set(cm2.lightOffColor);
    }
}