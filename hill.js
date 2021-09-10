export class Hill {
  constructor(color, speed, total) {
    this.color = color; // 색상
    this.speed = speed; // 속성
    this.total = total; // 포인트 갯수
  }

  resize(stageWidth, stageHeight) {
    // 스테이지 사이즈를 파라미터로 전달받음
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.points = [];
    // 스테이지 보다 크게 그려지도록 -2
    this.gap = Math.ceil(this.stageWidth / (this.total - 2));

    for (let i = 0; i < this.total; i++) {
      this.points[i] = {
        x: i * this.gap,
        y: this.getY(),
      };
    }
  }

  // 실제로 언덕을 그리는 함수
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    let cur = this.points[0];
    let prev = cur;

    // 곡선의 좌표를 언덕을 걷는 양의 좌표로 써야 하기 때문에
    let dots = [];
    // 움직이도록 speed 추가
    cur.x += this.speed;

    // 언덕이 움직이면 시작점이 잘려 보이게 되는데
    if (cur.x > -this.gap) {
      // 언덕의 x좌표의 시작점이 화면밖으로 나오기 전에 새로운 언덕의 포인트를 배열에 추가
      // unshift() 메서드는 새로운 요소를 배열의 맨 앞쪽에 추가
      this.points.unshift({
        x: -(this.gap * 2),
        y: this.getY(),
      });
    } else if (cur.x > this.stageWidth + this.gap) {
      // 일정영역에서 사라지면 배열에서 빼줌
      this.points.splice(-1);
    }

    ctx.moveTo(cur.x, cur.y);

    let prevCx = cur.x;
    let prevCy = cur.y;

    for (let i = 1; i < this.points.length; i++) {
      cur = this.points[i];
      // 움직이도록 speed 추가
      cur.x += this.speed;

      const cx = (prev.x + cur.x) / 2;
      const cy = (prev.y + cur.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);

      dots.push({
        x1: prevCx,
        y1: prevCy,
        x2: prev.x,
        y2: prev.y,
        x3: cx,
        y3: cy,
      });

      prev = cur;
      prevCx = cx;
      prevCy = cy;
    }

    ctx.lineTo(prev.x, prev.y);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.stageHeight);
    ctx.fill();

    return dots;
  }

  // 랜덤하게 hill 높이를 리턴하는 함수
  getY() {
    // 스테이지 높이를 8로 나눔
    const min = this.stageHeight / 8;
    const max = this.stageHeight - min;
    return min + Math.random() * max;
  }
}
