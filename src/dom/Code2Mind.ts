import Code2MindParse from '../parse/Code2MindParse';
import {MindNode} from '../parse/MindNode';
import '../themes/default/index.css';
import {Util} from '../util';

const setAttrs = (el: Element, attrs: Object) => {
  const keys = Object.keys(attrs);
  keys.forEach((item) => {
    el.setAttribute(item, attrs[item]);
  });
};

const createdSvgEl = (tagName: string, attrs: Object): SVGElement => {
  const tagEl = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  setAttrs(tagEl, attrs);
  return tagEl;
};

const createdDiv = (node: MindNode): HTMLElement => {
  const div = document.createElement('div');
  let className = 'code2mind-main';
  if (node.level > 0) {
    className += ' code2mind-main-item';
  }
  if (node.level > 1) {
    className += ' code2mind-main-item2';
  }
  div.className = className;
  div.innerText = node.title;
  return div;
};

export class Code2Mind {
  config: Config;
  el: HTMLElement;
  result: MindNode;

  constructor(options: Config) {
    this.config = Object.assign({
      heightSpac: 50,
      widthSpac: 100,
      width: 0,
      height: 0,
      lineStyle: {
        curvature: 80,
        stroke: '#DEDEDE',
        strokeWidth: 2,
      },
      themes: 'default',
      el: '#code2mind',
    }, options);
    this.el = document.querySelector(this.config.el);
    if (!options.width) {
      this.config.width = this.el.offsetWidth;
    }
    if (!options.height) {
      this.config.height = this.el.offsetHeight;
    }
    if (!this.el) throw `${this.config.el}，对应的dom不存在`;
    this.el.style.position = 'relative';
  }

  html2svg(width: number, height: number, x: number, y: number, node: Node): SVGElement {
    const svg = createdSvgEl('svg', {
      width,
      height
    });
    const foreignObject = createdSvgEl('foreignObject', {
      width: '100%',
      height: '100%',
      x,
      y,
      externalResourcesRequired: true
    });
    foreignObject.appendChild(node);
    svg.appendChild(foreignObject);
    return svg;
  };

  setCssStyle(node, zoom) {
    if (node.children && node.children.length > 0) {
      for (let i = 0, size = node.children.length; i < size; i++) {
        this.setCssStyle(node.children.item(i), zoom);
      }
    }
    const style = getComputedStyle(node, null);
    node.style.cssText = style.cssText;
    node.className = '';
  }

  svg2img(svg: SVGElement): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      // btoa(unescape
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    });
  }

  picture(zoom: number = 1, padding: number = 10) {
    if (zoom <= 0) {
      throw '缩放比例必须是大于0';
    }
    const node = document.getElementById('code2mindContent');
    // const bound = node.getBoundingClientRect();
    const cloneNode = node.cloneNode(true);
    // @ts-ignore
    setAttrs(cloneNode, {
      style: `top:0;left:0;transform-origin:0 0;transform:scale(${zoom})`,
    });
    const width = this.result.bound.clientWidth * zoom + padding * 2;
    const height = this.result.bound.clientHeight * zoom + padding * 2;
    const svg = this.html2svg(width, height, padding, padding, cloneNode);
    const div = document.createElement('div');
    setAttrs(div, {
      style: 'top:0;left:0;position:absolute;z-index:-555;width:0;height:0;overflow:hidden;'
    });
    div.appendChild(svg);
    document.body.appendChild(div);
    this.setCssStyle(cloneNode, zoom);

    const code2mindSvg = document.getElementById('code2mindSvg').cloneNode(true);
    // @ts-ignore
    setAttrs(code2mindSvg, {
      width,
      height,
      style: `transform-origin:0 0;transform:scale(${zoom})`
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    // @ts-ignore
    this.svg2img(code2mindSvg).then((img2) => {
      ctx.drawImage(img2, padding, padding);
    }).then(() => {
      return this.svg2img(svg);
    }).then((img) => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        Util.download(blob, null, null);
      });
    }).finally(() => {
      document.body.removeChild(div);
    });
  }

  render(source: string = '') {
    this.el.innerHTML = '';
    const result = Code2MindParse.parse(source);
    this.result = result;
    if (result) {
      const cloneSvg = this.el.cloneNode(true);
      // @ts-ignore
      setAttrs(cloneSvg, {
        style: 'z-index: -9000;visibility:hidden;'
      });
      document.body.appendChild(cloneSvg);
      this.calcBound(cloneSvg, result);
      document.body.removeChild(cloneSvg);
      this.layout(result, result.bound.leftWidht > 0 ? (result.bound.leftWidht + this.config.widthSpac) : 0, (result.bound.height >= result.bound.clientHeight) ? 0 : (result.bound.clientHeight / 2), false);
      const top = this.config.height / 2 - result.bound.clientHeight / 2;
      const left = this.config.width / 2 - result.bound.clientWidth / 2;
      const svg = createdSvgEl('svg', {
        width: result.bound.clientWidth.toString(),
        height: result.bound.clientHeight.toString(),
        id: 'code2mindSvg',
      });
      const div = document.createElement('div');
      setAttrs(div, {
        id: 'code2mindContent',
        style: `top:${top}px;left:${left}px;position:relative;z-index:1;width:${result.bound.clientWidth}px;height:${result.bound.clientHeight}px;`
      });
      this.drawMind(div, result, svg);
      this.el.appendChild(div);
      const svgwarpdiv = document.createElement('div');
      setAttrs(svgwarpdiv, {
        style: `top:${top}px;left:${left}px;position:absolute;`
      });
      svgwarpdiv.appendChild(svg);
      this.el.appendChild(svgwarpdiv);
    }
  }

  drawMind(el: HTMLElement, node: MindNode, svg: SVGElement) {
    const div = createdDiv(node);
    div.style.top = node.top + 'px';
    div.style.left = node.left + 'px';
    if (node.children.length) {
      const x = node.level === 0 ? (node.left + node.bound.width / 2) : (node.isLeft ? node.left : (node.left + node.bound.width));
      const y = ((node.level === 0 || node.level === 1) ? (node.top + node.bound.height / 2) : (node.top + node.bound.height)) - 1;
      node.children.forEach((item) => {
        const x1 = item.isLeft ? (x - this.config.lineStyle.curvature) : (x + this.config.lineStyle.curvature);
        const x2 = item.isLeft ? (item.left + item.bound.width) : item.left;
        const y2 = (item.level === 1 ? (item.top + item.bound.height / 2) : (item.top + item.bound.height)) - 1;
        const d = `M ${x} ${y} C ${x1} ${y} ${item.isLeft ? (x2 + this.config.lineStyle.curvature) : (x2 - this.config.lineStyle.curvature)} ${y2} ${x2} ${y2}`;
        const path = createdSvgEl('path', {
          d,
          stroke: this.config.lineStyle.stroke,
          'stroke-width': this.config.lineStyle.strokeWidth,
          fill: 'none',
        });
        svg.append(path);
        this.drawMind(el, item, svg);
      });
    }
    el.appendChild(div);
  }

  layout(node: MindNode, x: number, y: number, isLeft: boolean) {
    const len = node.children.length;
    if (len) {
      if (node.level === 0) {
        let leftY = y + node.bound.height / 2 - node.bound.leftHeight / 2;
        let rightY = y + node.bound.height / 2 - node.bound.rightHeight / 2;
        node.children.forEach((item, idx) => {
          if (item.isLeft) {
            let w = x - this.config.widthSpac - item.bound.width;
            leftY += idx === 0 ? 0 : (node.children[idx - 2].bound.clientHeight + this.config.heightSpac);
            this.layout(item, w, leftY - item.bound.height / 2 + item.bound.clientHeight / 2, true);
          } else if (item.isRight) {
            let w = x + this.config.widthSpac + node.bound.width;
            rightY += idx - 1 === 0 ? 0 : (node.children[idx - 2].bound.clientHeight + this.config.heightSpac);
            this.layout(item, w, rightY - item.bound.height / 2 + item.bound.clientHeight / 2, false);
          }
        });
      } else {
        let w = x + this.config.widthSpac + node.bound.width;
        if (isLeft) {
          w = x - this.config.widthSpac;
        }
        let h = y + node.bound.height / 2 - node.bound.clientHeight / 2;
        if (node.level === 1) {
          h -= node.bound.height / 2;
        }
        node.children.forEach((item, idx) => {
          h += (idx === 0 ? 0 : node.children[idx - 1].bound.clientHeight) + (idx === 0 ? 0 : this.config.heightSpac);
          this.layout(item, isLeft ? (w - item.bound.width) : w, h - item.bound.height / 2 + item.bound.clientHeight / 2, isLeft);
        });
      }
    }
    if (isLeft) {
      node.isLeft = isLeft;
    }
    node.top = y;
    node.left = x;
  }

  calcBound(el: Node, node: MindNode) {
    const bound: Bound = {
      clientWidth: 0,
      clientHeight: 0,
      width: 0,
      height: 0,
      leftWidht: 0,
      leftHeight: 0,
      rightWidth: 0,
      rightHeight: 0,
    };
    const div = createdDiv(node);
    // 计算宽度和高度
    el.appendChild(div);
    bound.clientWidth = bound.width = div.offsetWidth;
    bound.clientHeight = bound.height = div.offsetHeight;
    const len = node.children.length;
    if (len) {
      let w = 0;
      let h = 0;
      let leftH = 0;
      let rightH = 0;
      let leftW = 0;
      let rightW = 0;
      node.children.forEach((item, index) => {
        this.calcBound(el, item);
        if (node.level === 0) {
          if (index % 2 === 0) {
            item.isLeft = true;
            leftH += item.bound.clientHeight + this.config.heightSpac;
            if (item.bound.clientWidth > leftW) {
              leftW = item.bound.clientWidth;
            }
          } else {
            item.isRight = true;
            rightH += item.bound.clientHeight + this.config.heightSpac;
            // rightW += item.bound.clientWidth;
            if (item.bound.clientWidth > rightW) {
              rightW = item.bound.clientWidth;
            }
          }
        } else {
          h += item.bound.clientHeight;
          if (item.bound.clientWidth > w) {
            w = item.bound.clientWidth;
          }
        }
      });
      if (node.level === 0) {
        leftH = leftH - this.config.heightSpac;
        leftH = (leftH > bound.clientHeight ? leftH : bound.clientHeight);
        rightH = rightH - this.config.heightSpac;
        rightH = (rightH > bound.clientHeight ? rightH : bound.clientHeight);
        bound.leftHeight = leftH;
        bound.rightHeight = rightH;
        bound.leftWidht = leftW;
        bound.rightWidth = rightW;
        bound.clientHeight = Math.max(leftH, rightH);
        bound.clientWidth = leftW + rightW + bound.width + this.config.widthSpac * (leftW === 0 ? 0 : (rightW === 0 ? 1 : 2));
      } else {
        h += (len - 1) * this.config.heightSpac;
        h = (h > bound.clientHeight ? h : bound.clientHeight);
        w += bound.clientWidth + this.config.widthSpac;
        bound.clientWidth = w;
        bound.clientHeight = h;
      }
    }
    node.bound = bound;
  };

}
