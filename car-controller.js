// 자동차 클래스 임포트
import { Car } from './car.js';

export class CarController {
  constructor() {
    this.img = new Image();
    this.img.onload = () => {
      this.loaded();
    };
    // 자동차 이미지 추가
    this.img.src = 'car.png';

    this.items = [];
    this.cur = 0;
    this.isLoaded = false;
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  }

  loaded() {
    this.isLoaded = true;
    this.addCar();
  }

  addCar() {
    this.items.push(new Car(this.img, this.stageWidth));
  }

  // 자동차 그리는 함수
  draw(ctx, t, dots) {
    if (this.isLoaded) {
      this.cur += 1;
      if (this.cur > 500) {
        this.cur = 0;
        this.addCar();
      }

      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        if (item.x < -item.width) {
          this.items.splice(i, 1);
        } else {
          item.draw(ctx, t, dots);
        }
      }
    }
  }
}
