var scene = (function(){
	"use strict";

    var scene = new THREE.Scene(),
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias:true }),
        mouse = new THREE.Vector2(),
        raycaster = new THREE.Raycaster(),
        camera,
        objects = [],
        controls,
        selected = [],
        selectedDOM = document.querySelector(".selected-find"),
        multiSelect = false;

	function initScene() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById("container").appendChild(renderer.domElement);
		renderer.shadowMap.enabled = true;
		scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.shadowMap.soft = true;
		console.log(renderer)
		Number.prototype.toRad = function () {
		 	return this * Math.PI / 180; 
		}

		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set(-60, 100, -10);
		spotLight.castShadow = true;
		scene.add(spotLight);

		camera = new THREE.PerspectiveCamera(
            35, 									//fov — Camera frustum vertical field of view.
            window.innerWidth / window.innerHeight, //aspect — Camera frustum aspect ratio.
            1,										//near — Camera frustum near plane.
            1000									//far — Camera frustum far plane.
        );

        camera.position.x = -160;
		camera.position.y = 200;
		camera.position.z = 160; //set vertical position of camera to top

		renderer.setClearColor(0xEEEEEE, 1.0);
		camera.lookAt(new THREE.Vector3(0,0,0));
        scene.add(camera);

        var texture = THREE.ImageUtils.loadTexture( "texture/parquet.jpg" );

        texture.wrapS = THREE.RepeatWrapping; 
		texture.wrapT = THREE.RepeatWrapping;

		texture.repeat.set( 4, 4 );

		var texture2 = THREE.ImageUtils.loadTexture( "texture/wall.jpg" );

        texture2.wrapS = THREE.RepeatWrapping; 
		texture2.wrapT = THREE.RepeatWrapping;

		texture2.repeat.set( 4, 4 );


        var planeGeometry = new THREE.PlaneGeometry(120,120); 				//widthX, widthY
        var planeGeometry2 = new THREE.PlaneGeometry(120,60);
		var planeMaterial = new THREE.MeshLambertMaterial({ map : texture });	//create plane 
		var plane = new THREE.Mesh(planeGeometry,planeMaterial);
		plane.receiveShadow = true;
		plane.material.side = THREE.DoubleSide;
		console.log(plane)
		var planeMaterial2 = new THREE.MeshLambertMaterial({ map : texture2 });	//
		var plane2 = new THREE.Mesh(planeGeometry2,planeMaterial2);
		var plane3 = new THREE.Mesh(planeGeometry2,planeMaterial2);
		plane2.receiveShadow = true;
		plane3.receiveShadow = true;


		plane.rotation.x=-(90).toRad();
		plane.position.x = 0;
		plane.position.y = 0;
		plane.position.z = 0;

		//plane2.rotation.x=-(90).toRad();
		plane2.position.x = 0;
		plane2.position.y = 30;
		plane2.position.z = -60;

		plane3.rotation.y=-(90).toRad();
		plane3.position.x = 60;
		plane3.position.y = 30;
		plane3.position.z = 0;

		scene.add(plane);
		scene.add(plane2);
		scene.add(plane3);
		

		//Drawing model code begins

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setBaseUrl('./models/');
		mtlLoader.setPath('./models/');
		
		function drawTumb(elm) {
			mtlLoader.load('./comod/Skin_A/Table_de_nuit_Final.mtl', function (materials) {

			    materials.preload();

			    var objLoader = new THREE.OBJLoader();
			    objLoader.setMaterials(materials);
			    objLoader.setPath('./models/');
			    objLoader.load('./comod/Skin_A/Table_de_nuit_Final.obj', function (object) {
			    	var obj = object;
			    	obj.scale.set(0.3, 0.3, 0.3);
			    	obj.position.z = 5;
			    	object.castShadow = true;
			    	obj.elem = elm.cloneNode(true);
			        objects.push(obj);
			        scene.add(obj);
			    });

			});
		}

		function drawChair(elm) {
			mtlLoader.load('./REORCChairChesterfield/chair_chesterfield.mtl', function (materials) {

			    materials.preload();

			    var objLoader = new THREE.OBJLoader();
			    objLoader.setMaterials(materials);
			    objLoader.setPath('./models/');
			    objLoader.load('./REORCChairChesterfield/chair_chesterfield.obj', function (object) {
			        object.scale.set(20, 20, 20);
			        object.castShadow = true;
			        object.elem = elm.cloneNode(true);
			        objects.push(object);
			        scene.add(object);
			    });

			});
		}

		function drawClock(elm) {
			mtlLoader.load('./Clock/Pendule.mtl', function (materials) {

			    materials.preload();

			    var objLoader = new THREE.OBJLoader();
			    objLoader.setMaterials(materials);
			    objLoader.setPath('./models/');
			    objLoader.load('./Clock/Pendule.obj', function (object) {
			        object.scale.set(0.2, 0.2, 0.2);
			        object.castShadow = true;
			        object.elem = elm.cloneNode(true);
			        objects.push(object);
			        scene.add(object);
			    });

			});
		}

		function drawTable(elm) {
			mtlLoader.load('./Table/Wooden_Table_1.mtl', function (materials) {

			    materials.preload();

			    var objLoader = new THREE.OBJLoader();
			    objLoader.setMaterials(materials);
			    objLoader.setPath('./models/');
			    objLoader.load('./Table/Wooden_Table_1.obj', function (object) {
			        object.scale.set(0.2, 0.2, 0.2);
			        object.castShadow = true;
			        object.elem = elm.cloneNode(true);
			        objects.push(object);
			        scene.add(object);
			    });

			});
		}

		// End of drawing model


	    function onDocumentMouseDown(event) {
	        mouse.x = (event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	        mouse.y = -(event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	        raycaster.setFromCamera(mouse, camera);

	        var intersects = raycaster.intersectObjects(objects, true);
	        console.log(intersects , objects)
	        if (intersects.length > 0) {
	        	if (!multiSelect) clearSelectList();
				//console.log(intersects[0].object)
				intersects.forEach(function(obj){
					obj.object.material.opacity = 0.6;
					selected.push(obj.object);
				});

				selectedDOM.appendChild(selected[0].parent.elem);
	            //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
	        } else if (selected.length) {
	        	clearSelectList();
	        }
	    }

	    function clearSelectList() {
	    	if (selected.length) {
	    		selectedDOM.removeChild(selected[0].parent.elem);
	    	}
	    	selected.forEach(function(obj){
					obj.material.opacity = 1;
				});
        	selected = [];
	    };

		renderer.domElement.addEventListener('click', onDocumentMouseDown);


		var xUp = document.querySelector('#x-up');
		var xDown = document.querySelector('#x-down');

		var zUp = document.querySelector('#z-up');
		var zDown = document.querySelector('#z-down');

		var yUp = document.querySelector('#y-up');
		var yDown = document.querySelector('#y-down');

		var xRotateUp = document.querySelector('#x-rotate-up');
		var xRotateDown = document.querySelector('#x-rotate-down');

		var zRotateUp = document.querySelector('#z-rotate-up');
		var zRotateDown = document.querySelector('#z-rotate-down');

		var yRotateUp = document.querySelector('#y-rotate-up');
		var yRotateDown = document.querySelector('#y-rotate-down');

		var cancelSelect = document.querySelector('#cancel-select');
		var deleteSelect = document.querySelector('#delete-select');

		var closeHint = document.querySelector('.hint-k-close');
		var overlay = document.querySelector('.overlay');
		var hintBlock = document.querySelector('.hint-k');
		var hintLink = document.querySelector('#hint');

		closeHint.addEventListener('click', function(event){
			hintBlock.style.display = "none";
			overlay.style.display = "none";
		});

		hintLink.addEventListener('click', function(event){
			hintBlock.style.display = "block";
			overlay.style.display = "block";
		});

		xUp.addEventListener('mousedown', function(event){
			if (selected.length) {
				selected.forEach(function(obj){
		    		obj.parent.position.x += (1 + 0.05 *  obj.parent.scale.x);
		    	});
			}
		});

		xDown.addEventListener('mousedown', function(event){
			if (selected.length) {
				selected.forEach(function(obj){
		    		obj.parent.position.x -= (1 + 0.05 * obj.parent.scale.x);
		    	});
			}
		});

		zUp.addEventListener('mousedown', function(event){
			if (selected.length) {
				selected.forEach(function(obj){
		    		obj.parent.position.z += (1 + 0.05 *  obj.parent.scale.z);
		    	});
			}
		});


		zDown.addEventListener('mousedown', function(event){
			if (selected.length) {
				selected.forEach(function(obj){
		    		obj.parent.position.z -= (1 + 0.05 *  obj.parent.scale.z);
		    	});
			}
		});

		yUp.addEventListener('mousedown', function(event){
			if (selected.length) {
				selected.forEach(function(obj){
		    		obj.parent.position.y += (1 + 0.05 *  obj.parent.scale.y);
		    	});
			}
		});

		yDown.addEventListener('mousedown', function(event){
			if (selected.length) {
				selected.forEach(function(obj){
		    		obj.parent.position.y -= (1 + 0.05 * obj.parent.scale.y);
		    	});
			}
		});

		yRotateUp.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	selected.forEach(function(obj){
		    		obj.parent.rotation.y+=(15).toRad();
		    	});
			}
		});

		yRotateDown.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	selected.forEach(function(obj){
		    		obj.parent.rotation.y-=(15).toRad();
		    	});
			}
		});

		xRotateUp.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	selected.forEach(function(obj){
		    		obj.parent.rotation.x+=(15).toRad();
		    	});
			}
		});

		xRotateDown.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	selected.forEach(function(obj){
		    		obj.parent.rotation.x-=(15).toRad();
		    	});
			}
		});

		zRotateUp.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	selected.forEach(function(obj){
		    		obj.parent.rotation.z+=(15).toRad();
		    	});
			}
		});

		zRotateDown.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	selected.forEach(function(obj){
		    		obj.parent.rotation.z-=(15).toRad();
		    	});
			}
		});

		cancelSelect.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	clearSelectList();
			}
		});

		deleteSelect.addEventListener('mousedown', function(event){
			if (selected.length) {
		    	selected.forEach(function(obj){
		    		scene.remove(obj.parent);
		    	});
		    	clearSelectList();
			}
		});

		window.addEventListener('keydown', function(event){
			var key = event.which || event.keyCode;
			if (selected.length) {
				switch (key) {
				    case 83: //S
				    	selected.forEach(function(obj){
				    		console.log(obj.parent.scale.x)
				    		obj.parent.position.x -= (1 + 0.05 * obj.parent.scale.x);
				    	});
				        break;
				    case 87: //W
				        selected.forEach(function(obj){
				    		obj.parent.position.x += (1 + 0.05 *  obj.parent.scale.x);
				    	});
				        break;
				    case 68: //D
				        selected.forEach(function(obj){
				    		obj.parent.position.z += (1 + 0.05 *  obj.parent.scale.z);
				    	});
				        break;
				    case 65: //A
				        selected.forEach(function(obj){
				    		obj.parent.position.z -= (1 + 0.05 *  obj.parent.scale.z);
				    	});
				        break;
				    case 81: //Q
				        selected.forEach(function(obj){
				    		obj.parent.position.y += (1 + 0.05 *  obj.parent.scale.y);
				    	});
				        break;
				    case 69: //E
				        selected.forEach(function(obj){
				    		obj.parent.position.y -= (1 + 0.05 * obj.parent.scale.y);
				    	});
				        break;
				    case 39: //arrow right
				    	event.preventDefault();
				    	selected.forEach(function(obj){
				    		obj.parent.rotation.y-=(15).toRad();
				    	});
				        break;
				    case 37: //arrow left
				    	event.preventDefault();
				    	selected.forEach(function(obj){
				    		obj.parent.rotation.y+=(15).toRad();
				    	});
				        break;
				    case 38: //arrow up
				    	event.preventDefault();
				    	selected.forEach(function(obj){
				    		obj.parent.rotation.x-=(15).toRad();
				    	});
				        break;
				    case 40: //arrow down
				    	event.preventDefault();
				    	selected.forEach(function(obj){
				    		obj.parent.rotation.x+=(15).toRad();
				    	});
				        break;
				    case 90: //Z
				    	event.preventDefault();
				    	selected.forEach(function(obj){
				    		obj.parent.rotation.z+=(15).toRad();
				    	});
				        break;
				    case 88: //X
				    	event.preventDefault();
				    	selected.forEach(function(obj){
				    		obj.parent.rotation.z-=(15).toRad();
				    	});
				        break;
				    case 27: //Esc
				    	if (selected.length) {
				        	clearSelectList();
				        }
				        break;
				    case 46: //Delete
				    	if (selected.length) {
					    	selected.forEach(function(obj){
					    		scene.remove(obj.parent);
					    	});
					    	clearSelectList();
						}
				        break;
				    // case 17: //ctrl multiselect
				    // 	console.log(multiSelect);
				    // 	multiSelect = true;
				    //     break;
				}
			}
		    return true;
		});
		window.addEventListener('keydown', function(event){
			var key = event.which || event.keyCode;
			if (key === 17) {
				multiSelect = true;
			}
		});
		window.addEventListener('keyup', function(event){
			var key = event.which || event.keyCode;
			if (key === 17) {
				multiSelect = false;
			}
		});

		var find1 = document.querySelector('#find_1');
		find1.addEventListener('click', function(){
			drawChair(this);
		});

		var find2 = document.querySelector('#find_2');
		find2.addEventListener('click', function(){
			drawTumb(this);
		});

		var find3 = document.querySelector('#find_3');
		find3.addEventListener('click', function(){
			drawClock(this);
		});

		var find4 = document.querySelector('#find_4');
		find4.addEventListener('click', function(event){
			drawTable(this);
		});

		var wall1 = document.querySelector('#wall_1');
		wall1.addEventListener('click', function(){
			var txt = THREE.ImageUtils.loadTexture( "texture/wall1.jpg" );
			txt.wrapS = THREE.RepeatWrapping; 
			txt.wrapT = THREE.RepeatWrapping;

			txt.repeat.set( 4, 4 );
			plane2.material.map = txt;
			plane3.material.map = txt;
		});

		var wall2 = document.querySelector('#wall_2');
		wall2.addEventListener('click', function(){
			var txt = THREE.ImageUtils.loadTexture( "texture/wall2.jpg" );
			txt.wrapS = THREE.RepeatWrapping; 
			txt.wrapT = THREE.RepeatWrapping;

			txt.repeat.set( 4, 4 );
			plane2.material.map = txt;
			plane3.material.map = txt;
		});

		var floor1 = document.querySelector('#floor_1');
		floor1.addEventListener('click', function(){
			var txt = THREE.ImageUtils.loadTexture( "texture/floor1.jpg" );
			txt.wrapS = THREE.RepeatWrapping; 
			txt.wrapT = THREE.RepeatWrapping;

			txt.repeat.set( 4, 4 );
			plane.material.map = txt;
		});

		var floor2 = document.querySelector('#floor_2');
		floor2.addEventListener('click', function(){
			var txt = THREE.ImageUtils.loadTexture( "texture/floor2.jpg" );
			txt.wrapS = THREE.RepeatWrapping; 
			txt.wrapT = THREE.RepeatWrapping;

			txt.repeat.set( 4, 4 );
			plane.material.map = txt;
		});

		controls = new THREE.TrackballControls(camera);

        var axes = new THREE.AxisHelper(20); //drawing axis helper with size in 20px
		//scene.add(axes);
		render();
	}

	function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        controls.update();
    }
	return {
		initScene: initScene
	}
})();

