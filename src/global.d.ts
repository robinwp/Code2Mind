interface LineStyle {
  curvature: number; // 连接线曲度
  stroke: string; // 连接线颜色
  strokeWidth: number; // 连接线粗细
}


interface Config {
  themes: string;
  heightSpac: number;// 垂直间隔
  widthSpac: number;// 水平间隔
  lineStyle: LineStyle; // 连接线样式
  el: string; // 挂载的元素
  width: number;
  height: number;
}

interface Bound {
  width: number;
  height: number;
  clientHeight: number;
  clientWidth: number;
  leftWidht: number;
  rightWidth: number;
  leftHeight: number;
  rightHeight: number;
}
