export class Car {
  constructor(img, stageWidth) {
    this.img = img;

    this.totalFrame = 8;
    this.curFrame = 0;

    this.imgWidth = 640;
    this.imgHeight = 320;

    // 레티나 디스플레이를 감안하여 절반사이트로 조정
    this.carWidth = 320;
    this.carHeight = 160;

    this.carWidthHalf = this.carWidth / 2;
    this.x = stageWidth + this.carWidth;

    this.y = 0;
    this.speed = Math.random() * 2 + 1;

    this.fps = 24;
    this.fpsTime = 1000 / this.fps;
  }

  //
  draw(ctx, t, dots) {
    // 이미지 스프라이트를 만들어 해당 프레임에 맞는 이미지 가져오기 ( 자동차 이미지는 하나이므로 해당 소스 주석 조치)
    // this.curFrame += 1;
    // if (this.curFrame == this.totalFrame) {
    //   this.curFrame = 0;
    // }

    // fps 시간 적용 코드 => 위 코드 대신 사용
    // if (!this.time) {
    //   this.time = t;
    // }
    // const now = t - this.time;
    // if (now > this.fpsTime) {
    //   this.time = t;
    //   this.curFrame += 1;
    //   if (this.curFrame == this.totalFrame) {
    //     this.curFrame = 0;
    //   }
    // }

    this.animate(ctx, dots);
  }

  //
  animate(ctx, dots) {
    // 자동차 이동 위치
    this.x -= this.speed;
    const closest = this.getY(this.x, dots);
    this.y = closest.y;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(closest.rotation);
    ctx.fillStyle = '#000000';

    // 검은 색 박스 이미지
    // ctx.fillRect(
    //   -this.carWidthHalf,
    //   -this.carHeight + 20,
    //   this.carWidth,
    //   this.carHeight
    // );

    ctx.drawImage(
      this.img,
      this.imgWidth * this.curFrame,
      0,
      this.imgWidth,
      this.imgHeight,
      -this.carWidthHalf,
      -this.carHeight + 40,
      this.carWidth,
      this.carHeight
    );

    ctx.restore();
  }

  getY(x, dots) {
    for (let i = 1; i < dots.length; i++) {
      if (x >= dots[i].x1 && x <= dots[i].x3) {
        return this.getY2(x, dots[i]);
      }
    }
    return {
      y: 0,
      rotation: 0,
    };
  }

  getY2(x, dot) {
    const total = 200;
    let pt = this.getPointOnQuard(
      dot.x1,
      dot.y1,
      dot.x2,
      dot.y2,
      dot.x3,
      dot.y3,
      0
    );
    let prevX = pt.x;
    for (let i = 1; i < total; i++) {
      const t = i / total;
      pt = this.getPointOnQuard(
        dot.x1,
        dot.y1,
        dot.x2,
        dot.y2,
        dot.x3,
        dot.y3,
        t
      );

      if (x >= prevX && x <= pt.x) {
        return pt;
      }
      prevX = pt.x;
    }
    return pt;
  }

  // Bezier Curve
  getQuadValue(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  getPointOnQuard(x1, y1, x2, y2, x3, y3, t) {
    const tx = this.quadTangent(x1, x2, x3, t);
    const ty = this.quadTangent(y1, y2, y3, t);
    const rotation = -Math.atan2(tx, ty) + (90 * Math.PI) / 180;

    return {
      x: this.getQuadValue(x1, x2, x3, t),
      y: this.getQuadValue(y1, y2, y3, t),
      rotation: rotation,
    };
  }

  // 기울기 구하는 공식 (Rotation)
  quadTangent(a, b, c, t) {
    return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
  }
}
