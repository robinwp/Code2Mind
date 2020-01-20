import { Bound } from "../global";
export declare class MindNode {
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
    constructor(uid?: string, title?: string, level?: number, parentUid?: string, children?: MindNode[]);
}
