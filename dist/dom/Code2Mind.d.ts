import { MindNode } from '../parse/MindNode';
import '../themes/default/index.css';
import { Config } from '../global';
export declare class Code2Mind {
    config: Config;
    el: HTMLElement;
    result: MindNode;
    constructor(options: Config);
    html2svg(width: number, height: number, x: number, y: number, node: Node): SVGElement;
    setCssStyle(node: any, zoom: any): void;
    svg2img(svg: SVGElement): Promise<HTMLImageElement>;
    picture(zoom?: number, padding?: number): void;
    render(source?: string): void;
    drawMind(el: HTMLElement, node: MindNode, svg: SVGElement): void;
    layout(node: MindNode, x: number, y: number, isLeft: boolean): void;
    calcBound(el: Node, node: MindNode): void;
}
