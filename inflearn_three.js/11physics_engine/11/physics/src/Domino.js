import {
    Mesh,
    BoxGeometry,
    MeshBasicMaterial
} from 'three';

import {
    Body,
    Box,
    Vec3
} from 'cannon-es';



export class Domino{
    constructor(info){
        this.scene = info.scene;
        this.cannonWorld = info.cannonWorld;
        this.index = info.index;
        this.width = info.width || 0.6; // 인수로 들어오지 않으면 기본값 0.6
        this.height = info.height || 1; // 인수로 들어오지 않으면 기본값 1
        this.depth = info.depth || 0.2; // 인수로 들어오지 않으면 기본값 0.2
        this.x = info.x || 0; // 인수로 들어오지 않으면 기본값 0
        this.y = info.y || 0.5; // 인수로 들어오지 않으면 기본값 0.5
        this.z = info.z || 0; // 인수로 들어오지 않으면 기본값 0
        this.rotationY = info.rotationY || 0; // 인수로 들어오지 않으면 기본값 0
        
        info.gltfLoader.load(
            '/models/domino.glb',
            glb => {
                // console.log(glb.scene.children[0]);
                this.modelMesh = glb.scene.children[0];
                this.modelMesh.name = `${this.index}_domino`;
                this.modelMesh.castShadow = true;
                this.modelMesh.position.set(this.x, this.y, this.z);
                this.scene.add(this.modelMesh);

                this.setCannonBody();
            }
        );
    }

    setCannonBody(){
        const shape = new Box(new Vec3().set(this.width / 2, this.height / 2, this.depth / 2)); // 크기는 절반크기로 설정해야 하므로 2로 나눈다.
        this.cannonBody = new Body({
            mass: 1, // 무게
            position: new Vec3(this.x, this.y, this.z), // 위치
            shape, // 형태
        });

        this.cannonBody.quaternion.setFromAxisAngle(
            new Vec3(0, 1, 0), // y축을 기준으로
            this.rotationY // 회전값
        );

        this.modelMesh.cannonBody = this.cannonBody;

        this.cannonWorld.addBody(this.cannonBody);
    }
}