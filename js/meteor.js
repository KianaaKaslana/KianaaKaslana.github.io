// source/js/meteor.js
// 流星特效脚本
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'meteor-canvas';
  // 设置样式：固定定位，层级在背景图之上但在文字之下，不拦截点击
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none'; // 关键！让鼠标能透过画布点击下面的链接
  canvas.style.zIndex = '1'; // 这里的层级根据你的背景图调整，如果被挡住就改大一点，比如 99
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let meteors = [];

  // 初始化画布尺寸
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // 流星类
  class Meteor {
    constructor() {
      this.init();
    }

    init() {
      // 随机位置：主要从右上方划过
      this.x = Math.random() * width * 2 - width * 0.5; 
      this.y = Math.random() * -200;
      this.alpha = 1;
      this.speed = Math.random() * 2 + 4; // 速度
      this.length = Math.random() * 80 + 50; // 尾巴长度
      this.angle = Math.PI / 4; // 下落角度 (45度)
      this.hue=Math.random()*360;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha=this.alpha;
      ctx.beginPath();
      ctx.lineWidth = 2;
      // 流星颜色：浅蓝白色，看起来比较梦幻
      const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
      //gradient.addColorStop(0, 'rgba(172, 24, 103, 1)');
      //gradient.addColorStop(1, 'rgba(172, 24, 103, 0)');
      gradient.addColorStop(0,`hsla(${this.hue},100%,60%,1)`)
      gradient.addColorStop(1,`hsla(${this.hue},100%,60%,0)`)
      
      ctx.strokeStyle = gradient;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
      ctx.stroke();
      ctx.restore();
    }

    update() {
      this.x -= this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
      this.alpha -= 0.01;

      // 如果流星跑出屏幕或者消失，重置它
      if (this.y > height || this.x < -this.length || this.alpha <= 0) {
        this.init();
      }
    }
  }

  // 创建流星群
  function createMeteors(count) {
    for (let i = 0; i < count; i++) {
      // 错开时间生成，避免一开始就一起出现
      setTimeout(() => {
        meteors.push(new Meteor());
      }, Math.random() * 5000);
    }
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);
    meteors.forEach(m => {
      m.draw();
      m.update();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  // 这里的数字控制流星数量，不要太多，2-4个比较唯美，太多像下雨
  createMeteors(100); 
  animate();
})();