export class MindNode {
  uid: string;
  title: string;
  children: MindNode[];
  parentUid: string;
  level: number;
  bound: Bound;
  isLeft: boolean;
  isRight: boolean;
  top: number;
  left: number;

  constructor(uid: string = '', title: string = '', level: number = 0, parentUid: string = null, children: MindNode[] = []) {
    this.uid = uid;
    this.title = title;
    this.children = children;
    this.parentUid = parentUid;
    this.level = level;
  }
}
