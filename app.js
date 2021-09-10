// Hill 클래스 추가
import { Hill } from './hill.js';
// 자동차 컨트롤러 추가
import { CarController } from './car-controller.js';
// 해 클래스 추가
import { Sun } from './sun.js';

class App {
  constructor() {
    // 캔버스 생성
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // 해 인스턴스 생성
    this.sun = new Sun();

    // 언덕 인스턴스 생성    색상을 녹색 계열로: #88f19f, #6cc37f, #3b6343;
    this.hills = [
      new Hill('#88f19f', 0.2, 12),
      new Hill('#6cc37f', 0.5, 8),
      new Hill('#3b6343', 1.4, 6),
    ];

    this.carController = new CarController();

    // 스크린 사이즈 가져오기 위해 리사이즈
    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    // 애니메이션 프레임
    requestAnimationFrame(this.animate.bind(this));
  }

  // 레티나 디스플레이 에서도 선명하게 보이도록
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.sun.resize(this.stageWidth, this.stageHeight);

    // 언덕 그리기
    for (let i = 0; i < this.hills.length; i++) {
      this.hills[i].resize(this.stageWidth, this.stageHeight);
    }

    this.carController.resize(this.stageWidth, this.stageHeight);
  }

  animate(t) {
    // 애니메이션 프레임
    requestAnimationFrame(this.animate.bind(this));

    // 캔버스를 깨끗하게 지워주는 코드
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.sun.draw(this.ctx, t);

    let dots;
    for (let i = 0; i < this.hills.length; i++) {
      dots = this.hills[i].draw(this.ctx);
    }

    this.carController.draw(this.ctx, t, dots);
  }
}

window.onload = () => {
  new App();
};
