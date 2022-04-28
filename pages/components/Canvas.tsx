import React, { useRef, useEffect } from "react";

const Canvas = (props: any) => {
  const canvasRef = useRef(null);

  function test() {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");
    console.log(canvas.width, canvas.height);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "yellow";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let bTree = new BTree(null, [0]);
    Array(20)
      .fill(0)
      .forEach((item, index) => {
        bTree.add(Math.floor(Math.random() * 20));
      });
    bTree.dump(context);
  }

  return (
    <div>
      <canvas ref={canvasRef} {...props} width="4000" height="1000" />
      <button onClick={() => test()}>Test</button>
    </div>
  );
};

export default Canvas;

let totalDeep = 0;

class BTree {
  tag = [0];
  value: number | null = null;
  left: BTree | null = null;
  right: BTree | null = null;

  constructor(value: number | null, tag: number[]) {
    this.value = value;
    this.tag = tag;
  }

  add(newValue: number) {
    if (this.value == null) {
      this.value = newValue;
      totalDeep = 1;
    } else {
      if (newValue > this.value) {
        if (this.right == null) {
          this.right = new BTree(newValue, [...this.tag, 1]);
          totalDeep = Math.max(totalDeep, this.right.tag.length);
        } else {
          this.right.add(newValue);
        }
      } else if (newValue < this.value) {
        if (this.left == null) {
          this.left = new BTree(newValue, [...this.tag, 0]);
          totalDeep = Math.max(totalDeep, this.left.tag.length);
        } else {
          this.left.add(newValue);
        }
      }
    }
  }

  dump(context: any) {
    let curPoint = this.dumpSelf(context);
    if (this.left) {
      let leftPoint = this.left.dump(context);
      // 连线
      drawLine(context, curPoint, leftPoint);
    }
    if (this.right) {
      let rightPoint = this.right.dump(context);
      // 连线
      drawLine(context, curPoint, rightPoint);
    }
    // console.log(curPoint, this.value);
    return curPoint;
  }

  calY() {
    var y = 0;
    this.tag.forEach((item, index) => {
      //   let step = 1 << (totalDeep - index);
      //   y += unitHeight * step;
      y += 2 * unitHeight * 2;
    });
    // return y - unitHeight * (1 << totalDeep) + topPadding;
    return y + topPadding;
  }

  calX() {
    var startX = 0;
    this.tag.forEach((item, index) => {
      let step = 1 << (totalDeep - 1 - index);
      console.log(this.value, step);
      startX += unitWidth * step * item;
    });
    return leftPadding + startX;
  }

  dumpSelf(context: any) {
    let startX = this.calX();
    let startY = this.calY();
    let curWidth = unitWidth * (1 << (totalDeep - this.tag.length));

    // context.fillStyle = "red";
    // context.fillRect(startX, startY, curWidth, unitHeight);

    context.fillStyle = "green";
    context.font = "20px Arial";

    let textWidth = context.measureText(this.value).width;

    context.fillText(
      this.value,
      startX + curWidth / 2 - textWidth / 2,
      startY + unitHeight
    );

    return [startX + curWidth / 2, startY + unitHeight];
  }
}

let unitHeight = 20;
let unitWidth = 20;
let topPadding = 0;
let leftPadding = 0;

function drawLine(context: any, start: number[], end: number[]) {
  context.beginPath();
  context.moveTo(start[0], start[1]);
  context.lineTo(end[0], end[1] - unitHeight);
  context.stroke();
}
