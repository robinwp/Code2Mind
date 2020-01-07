import {KeyWord} from './status.enum';
import {Node} from './Node';
import {Util} from './util';

export default class Code2Mind {
  public static parse(source: string = ''): Node {
    if (source) {
      const lints = source.replace(/\r\n/g, '\n').split('\n');
      const root = new Node(Util.getUUid());
      lints.forEach((item, index) => {
        if (index === 0) {
          root.title = item;
        } else {
          Code2Mind.parseLine(item, root);
        }
      });
      return root;
    }
    return null;
  }

  private static parseLine(lintSource: string = '', root: Node) {
    if (!lintSource) {
      return;
    }
    const result = this.getToken(lintSource, 0);
    if (result.type !== 'END' && root.children.length) {
      const last = root.children.length - 1;
      this.parseLine(result.token, root.children[last]);
    } else {
      const node = new Node(Util.getUUid(), result.token, root.level + 1, root.uid);
      root.children.push(node);
    }
  }

  private static getToken(line: string, lintPos: number = 0) {
    let current: string = line.charAt(lintPos);
    if (current === KeyWord.TAB) {
      return {
        token: line.substring(lintPos + 1),
        type: 'TAB',
      };
    } else if (current === KeyWord.SPACE) {
      const nextCurrent = line.charAt(lintPos + 1);
      if (nextCurrent === KeyWord.SPACE) {
        return {
          token: line.substring(lintPos + 2),
          type: 'SPACE',
        };
      }
    }
    return {
      token: line.trim(),
      type: 'END',
    };
  }
}
