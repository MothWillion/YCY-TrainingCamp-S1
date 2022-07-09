class BrakeBanner {
	constructor(selector) {
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff
		});
		document.querySelector(selector).appendChild(this.app.view);

		this.stage = this.app.stage;

		this.assetsConfig = {
			btn: 'images/btn.png',
			btnCircle: 'images/btn_circle.png'
		};

		this.loader = new PIXI.Loader();

		this.addResource(this.assetsConfig);

		this.loader.onComplete.add(() => {
			this.showButton();
		});
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
		this.stage.addChild(container);
		let btnGroup = Object.keys(this.assetsConfig).filter(x => x.indexOf('btn') > -1);
		btnGroup.forEach(x => {
			let texture = this.getTextrue(x);
			let texture2;
			texture.pivot.x = texture.pivot.y = texture.width / 2;
			container.addChild(texture);
			if(x === 'btnCircle') {
				texture2 = this.getTextrue(x);
				texture2.pivot.x = texture2.pivot.y = texture2.width / 2;
				container.addChild(texture2);

				texture.scale.x = texture.scale.y = .8;
				gsap.to(texture.scale, {duration: 1, x: 1.3, y: 1.3, repeat: -1});
				gsap.to(texture, {duration: 1, alpha: 0, repeat: -1});
			}
		});
		container.x = container.y = 200;
	}
	// 获取资源
	getTextrue(name) {
		return new PIXI.Sprite(this.loader.resources[name].texture);
	}
}