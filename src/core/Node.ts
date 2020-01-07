export class Node {
  uid: string;
  title: string;
  children: Node[];
  parentUid: string;
  level: number;

  constructor(uid: string = '', title: string = '', level: number = 0, parentUid: string = null, children: Node[] = []) {
    this.uid = uid;
    this.title = title;
    this.children = children;
    this.parentUid = parentUid;
    this.level = level;
  }
}
