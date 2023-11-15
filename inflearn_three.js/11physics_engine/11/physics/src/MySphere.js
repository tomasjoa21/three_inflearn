import { 
    Mesh,
 } from 'three';
 import {
    Body,
    Sphere,
    Vec3,
 } from 'cannon-es';

export class MySphere {
    constructor(info) {
        this.scene = info.scene;
        this.cannonWorld = info.cannonWorld;
        this.geometry = info.geometry;
        this.material = info.material;
        this.x = info.x;
        this.y = info.y;
        this.z = info.z;
        this.scale = info.scale;
        // 위에서 Mesh을 import했기 때문에 아래처럼 쓸 수 있다.(THREE.Mesh가 아니라 그냥 Mesh)
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.scale.set(this.scale, this.scale, this.scale);
        this.mesh.castShadow = true;
        // cannonBody에 mesh를 연결하면 아래의 코드를 쓸 필요가 없다.
        // this.mesh.position.set(this.x, this.y, this.z);
        this.scene.add(this.mesh);

        this.setCannonBody();
    }

    setCannonBody(){
        //ex04에서 const sphereGeometry = new THREE.SphereGeometry(0.5);로 설정했기 때문에
        //0.5라는 기본 사이즈에서 scale을 곱해준다.
        const shape = new Sphere(0.5 * this.scale);
        this.cannonBody = new Body({
            mass: 1,
            position: new Vec3(this.x, this.y, this.z),
            // shape: shape 속성과 값이 같으면 shape 하나만 써도 된다.
            shape,
        });

        this.cannonWorld.addBody(this.cannonBody);
    }
}