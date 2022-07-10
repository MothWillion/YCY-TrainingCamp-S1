class BrakeBanner {
	constructor(selector) {
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
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
			this.showBike();
			this.showButton();
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
	// 显示按钮
	showButton() {
		const container = new PIXI.Container();
		this.container.addChild(container);
		let btnGroup = Object.keys(this.assetsConfig).filter(x => x.indexOf('btn') > -1);
		btnGroup.forEach(x => {
			let texture = this.getTextrue(x);
			let texture2;
			texture.pivot.x = texture.pivot.y = texture.width / 2;
			container.addChild(texture);
			if (x === 'btnCircle') {
				texture2 = this.getTextrue(x, true);
				texture2.pivot.x = texture2.pivot.y = texture2.width / 2;
				container.addChild(texture2);

				texture.scale.x = texture.scale.y = .8;
				gsap.to(texture.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 });
				gsap.to(texture, { duration: 1, alpha: 0, repeat: -1 });
			}
		});
		container.x = container.y = 400;
		container.interactive = true;
		container.buttonMode = true;
		container.on('mousedown', () => {
			// this.resources['bikeLever'].rotation = Math.PI / 180 * -30;
			gsap.to(this.resources['bikeLever'], { duration: 1, rotation: Math.PI / 180 * -30 });
		});
		container.on('mouseup', () => {
			// this.resources['bikeLever'].rotation = 0;
			gsap.to(this.resources['bikeLever'], { duration: 1, rotation: 0 })
		});

	}
	showBike() {
		const container = new PIXI.Container();
		this.container.addChild(container);
		let bikeGroup = Object.keys(this.assetsConfig).filter(x => x.indexOf('bike') > -1);
		bikeGroup.forEach(x => {
			let texture = this.getTextrue(x);
			if (x === 'bikeLever') {
				texture.pivot.x = 455;
				texture.pivot.y = 455;
				texture.x = 722;
				texture.y = 900;
			}
			container.addChild(texture);
		});
		container.scale.x = container.scale.y = .3;
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