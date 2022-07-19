class BrakeBanner {
	constructor(selector) {
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x000000,
			resizeTo: window,
			autoDensity: true,
			resolution: 2
		});
		document.querySelector(selector).appendChild(this.app.view);

		this.stage = this.app.stage;

		this.assetsConfig = {
			btn: 'images/btn.png',
			btnCircle: 'images/btn_circle.png',
			bikeLever: 'images/brake_lever.png',
			bike: 'images/brake_bike.png',
			bikeHandlerbar: 'images/brake_handlerbar.png',
		};

		this.loader = new PIXI.Loader();

		this.resources = [];

		this.addResource(this.assetsConfig);

		this.container = new PIXI.Container();
		this.stage.addChild(this.container);

		this.loader.onComplete.add(() => {
			this.show();
			// container内部资源加载完成才能取到它的宽高
			this.container.x = window.innerWidth - this.container.width;
			this.container.y = window.innerHeight - this.container.height;
		});
		let resize = () => {
			this.container.x = window.innerWidth - this.container.width;
			this.container.y = window.innerHeight - this.container.height;
		};
		window.addEventListener('resize', resize);
		resize();
	}
	// 添加资源
	addResource(config) {
		Object.keys(config).forEach(x => {
			this.loader.add(x, config[x]);
		});
		this.loader.load();
	}
	// 显示
	show() {
		const bikeContainer = new PIXI.Container();
		this.container.addChild(bikeContainer);
		let bikeGroup = Object.keys(this.assetsConfig).filter(x => x.indexOf('bike') > -1);
		bikeGroup.forEach(x => {
			let texture = this.getTextrue(x);
			if (x === 'bikeLever') {
				texture.pivot.x = 455;
				texture.pivot.y = 455;
				texture.x = 722;
				texture.y = 900;
				texture.tint = 0x00ffff
			}
			if(x === 'bike') {
				texture.tint = 0xff0000
			}
			if(x === 'bikeHandlerbar') {
				texture.tint = 0xff00ff
			}
			bikeContainer.addChild(texture);
		});
		bikeContainer.scale.x = bikeContainer.scale.y = .25;
		const buttonContainer = new PIXI.Container();
		this.container.addChild(buttonContainer);
		let btnGroup = Object.keys(this.assetsConfig).filter(x => x.indexOf('btn') > -1);
		btnGroup.forEach(x => {
			let texture = this.getTextrue(x);
			let texture2;
			texture.pivot.x = texture.pivot.y = texture.width / 2;
			buttonContainer.addChild(texture);
			if (x === 'btnCircle') {
				texture2 = this.getTextrue(x, true);
				texture2.pivot.x = texture2.pivot.y = texture2.width / 2;
				buttonContainer.addChild(texture2);

				texture.scale.x = texture.scale.y = .8;
				gsap.to(texture.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 });
				gsap.to(texture, { duration: 1, alpha: 0, repeat: -1 });
			}
		});
		buttonContainer.x = buttonContainer.y = 300;
		buttonContainer.scale.x = buttonContainer.scale.y = .5;
		buttonContainer.interactive = true;
		buttonContainer.buttonMode = true;
		buttonContainer.on('mousedown', () => {
			// this.resources['bikeLever'].rotation = Math.PI / 180 * -30;
			gsap.to(this.resources['bikeLever'], { duration: 1, rotation: Math.PI / 180 * -30 });
			pause();
		});
		buttonContainer.on('mouseup', () => {
			// this.resources['bikeLever'].rotation = 0;
			gsap.to(this.resources['bikeLever'], { duration: 1, rotation: 0 });
			start();
		});
		const particlesContainer = new PIXI.Container();
		this.stage.addChild(particlesContainer);
		particlesContainer.pivot.x = particlesContainer.x = window.innerWidth / 2;
		particlesContainer.pivot.y = particlesContainer.y = window.innerHeight / 2;
		particlesContainer.rotation = Math.PI / 180 * 30;
		let particles = [];
		const colors = [0xf1cf54, 0xb5cea8, 0xcf09d3, 0xf8b62a, 0x3b8f09];
		for (let i = 0; i < 10; i++) {
			let particle = new PIXI.Graphics();
			particle.beginFill(colors[Math.floor(Math.random() * colors.length)]);
			particle.drawCircle(0, 0, 5);
			particle.endFill();

			const pItem = {
				sx: window.innerWidth * Math.random(),
				sy: window.innerHeight * Math.random(),
				m: particle
			}
			particle.x = pItem.sx;
			particle.y = pItem.sy;
			particlesContainer.addChild(particle);
			particles.push(pItem);
		}
		let speed = 0;
		const loop = () => {
			speed += .1;
			speed = Math.min(20, speed);
			particles.forEach(x => {
				x.m.y += speed;
				x.m.scale.x -= .0003 * speed;
				x.m.scale.y += .003 * speed;
				x.m.scale.x = Math.max(.01
					, x.m.scale.x);
				x.m.scale.y = Math.min(40, x.m.scale.y);
				// 计算旋转后的高度
				if (x.m.y > window.innerHeight * 1.2) {
					x.m.y = - window.innerHeight * .2;
				}
			})
		}
		const start = () => {
			speed = 0;
			gsap.ticker.add(loop)
		}
		const pause = () => {
			gsap.ticker.remove(loop)
			particles.forEach(x => {
				x.m.scale.x = x.m.scale.y = 1;
				gsap.to(x.m, { duration: .6, x: x.sx, y: x.sy, ease: 'elastic.out' });
			})
		}
		start();
	}
	// 获取资源
	getTextrue(name, isNew) {
		// 如果要求新建一个资源实例的话
		if (isNew) return new PIXI.Sprite(this.loader.resources[name].texture);
		// 缓存一下我们的资源实例
		if (!this.resources[name]) {
			this.resources[name] = new PIXI.Sprite(this.loader.resources[name].texture);
		}
		return this.resources[name];
	}

}