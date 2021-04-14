import * as TreeType from './TreeTypes'

export default class TF {
    // this requires a faster (lexographic binary search) implementation
    static hasTreeWithName: TreeType.HTN = (name, treeList, idx) => {
        if (treeList.length === 0) return [false, -1];
        if (treeList[0].name === name) return [true, idx];
        return TF.hasTreeWithName(name, treeList.slice(1), idx + 1);
    }

    static createChild: TreeType.CC = (hasChildren, name, children) => {
        return { hasChildren, name, children }
    }

    // takes the separaeted path and add sit to tree
    static insertPath: TreeType.IP = (names, root) => {
        // no more path to insert
        if (names.length === 0) return root;

        // check if child exists
        const [childExists, childIdx] = TF.hasTreeWithName(names[0], root.children, 0)

        // child exists
        if (root.hasChildren && childExists) {
            const left  = root.children.slice(0, childIdx);
            const right = root.children.slice(childIdx + 1);

            const newChild = TF.insertPath(names.slice(1), root.children[childIdx])
            const newChildren = left.concat([newChild]).concat(right);
                
            return TF.createChild( true, root.name, newChildren);
        }

        //reached bottom of tree (no children) or child does not exist
        const newChild = TF.insertPath(names.slice(1), TF.createChild(false, names[0], []));
        const newChildren = root.children.concat( [newChild] );

        return TF.createChild( true, root.name, newChildren );
    }

    static traverse: TreeType.Traverse = (root) => {
        if (!root.hasChildren) {
            return [root.name]
        }

        //get all the downstream paths
        const paths = root.children.reduce((acc: string[], child) => {
            return acc.concat(TF.traverse(child))
        }, []);

        // return all these paths with the new name appended
        return paths.reduce((acc: string[], path) => {
            return acc.concat([root.name + "/" + path])
        }, []);
    }

    static getChildWithPath: TreeType.GCP = (names, root) => {
        // child found
        if (names.length === 0) return root;

        // we're assuming there will be a child (naughty but okay)
        const [_, childIdx] = TF.hasTreeWithName(names[0], root.children, 0)

        //continue the search
        return TF.getChildWithPath(names.slice(1), root.children[childIdx])
    }

    static narrowTraverse: TreeType.NT = (path, root) => {
        return TF.getChildWithPath(path.split("/"), root).children.reduce((acc: string[], child) => {
            return acc.concat([child.name])
        }, []);
    }

}

// tests ----------------------------------

const paths = [
    "obstetrics/labour/bleed",
    "obstetrics/labour/dystocia",
    "obstetrics/antepartum/abruption",
    "gynaecology/ovarian/serouscarcinoma",
    "gynaecology/fallopian/ectopic",
    "gynaecology/menorrhagia"
]

const root = TF.createChild(false, "VIVA", []);

const myTree = paths.reduce((acc, path) => {
    return TF.insertPath(path.split("/"), acc);
}, root)

console.log(TF.narrowTraverse("obstetrics/labour", myTree));