export type Tree = {
    "hasChildren": boolean;
    "name": string;
    "children": Tree[]
}

// hasTreeWithName
export type HTN = (name: string, treeList: Tree[], idx: number) => [boolean, number];

// createChild
export type CC = (hasChildren: boolean, name: string, children: Tree[]) => Tree;

// insertPath
export type IP = (names: string[], root: Tree) => Tree;

// traverse
export type Traverse = (root: Tree) => string[];

// getChildWithPath
export type GCP = (names: string[], root: Tree) => Tree;

// narrowTraverse
export type NT = (path: string, root: Tree) => string[];