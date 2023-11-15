import { cm1 } from './common';
import { 
    Mesh,
    AnimationMixer,
    BoxGeometry,
    MeshBasicMaterial
} from 'three';
import { Stuff } from './Stuff';

export class Player extends Stuff{
    constructor(info) {
        super(info);

        this.width=  0.5;
        this.height= 0.5;
        this.depth=  0.5;


        cm1.gltfLoader.load(
            'models/ilbuni.glb',
            glb => {
                //shadow 그림자
                //traverse는 모든 자식요소를 순회한다.
                glb.scene.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = true;
                    }
                });

                this.modelMesh = glb.scene.children[0];
                this.modelMesh.position.set(this.x, this.y, this.z);
                this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
                this.modelMesh.castShadow = true;
                cm1.scene.add(this.modelMesh);
                // console.log(glb.animations);
                this.modelMesh.animations = glb.animations;
                cm1.mixer = new AnimationMixer(this.modelMesh);
                this.actions = [];
                this.actions[0] = cm1.mixer.clipAction(this.modelMesh.animations[0]);//default
                this.actions[1] = cm1.mixer.clipAction(this.modelMesh.animations[1]);//fall
                this.actions[2] = cm1.mixer.clipAction(this.modelMesh.animations[2]);//jump

                // jump 애니메이션은 한 번만 실행한다.
                this.actions[2].repetitions = 1;

                // 최초에는 default 애니메이션을 실행한다.
                this.actions[0].play();

                this.setCannonBody(); //캐논물리객체를 만들어주는 함수
            }
        );

        // this.mesh = new Mesh(this.geometry, this.material);
        // this.mesh.position.set(this.x, this.y, this.z);
        // this.mesh.castShadow = true;
        // this.mesh.receiveShadow = true;
        // cm1.scene.add(this.mesh);
    }
}