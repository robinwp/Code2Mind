export interface LineStyle {
    curvature: number;
    stroke: string;
    strokeWidth: number;
}
export interface Config {
    themes: string;
    heightSpac: number;
    widthSpac: number;
    lineStyle: LineStyle;
    el: string | HTMLElement;
    width: number;
    height: number;
}
export interface Bound {
    width: number;
    height: number;
    clientHeight: number;
    clientWidth: number;
    leftWidht: number;
    rightWidth: number;
    leftHeight: number;
    rightHeight: number;
}
