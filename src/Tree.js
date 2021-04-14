"use strict";
exports.__esModule = true;
exports.TF = void 0;
var TF = /** @class */ (function () {
    function TF() {
    }
    // this requires a faster (lexographic binary search) implementation
    TF.hasTreeWithName = function (name, treeList, idx) {
        if (treeList.length === 0)
            return [false, -1];
        if (treeList[0].name === name)
            return [true, idx];
        return TF.hasTreeWithName(name, treeList.slice(1), idx + 1);
    };
    TF.createChild = function (hasChildren, name, children) {
        return { hasChildren: hasChildren, name: name, children: children };
    };
    // takes the separaeted path and add sit to tree
    TF.insertPath = function (names, root) {
        // no more path to insert
        if (names.length === 0)
            return root;
        // check if child exists
        var _a = TF.hasTreeWithName(names[0], root.children, 0), childExists = _a[0], childIdx = _a[1];
        // child exists
        if (root.hasChildren && childExists) {
            var left = root.children.slice(0, childIdx);
            var right = root.children.slice(childIdx + 1);
            var newChild_1 = TF.insertPath(names.slice(1), root.children[childIdx]);
            var newChildren_1 = left.concat([newChild_1]).concat(right);
            return TF.createChild(true, root.name, newChildren_1);
        }
        //reached bottom of tree (no children) or child does not exist
        var newChild = TF.insertPath(names.slice(1), TF.createChild(false, names[0], []));
        var newChildren = root.children.concat([newChild]);
        return TF.createChild(true, root.name, newChildren);
    };
    TF.traverse = function (root) {
        if (!root.hasChildren) {
            return [root.name];
        }
        //get all the downstream paths
        var paths = root.children.reduce(function (acc, child) {
            return acc.concat(TF.traverse(child));
        }, []);
        // return all these paths with the new name appended
        return paths.reduce(function (acc, path) {
            return acc.concat([root.name + "/" + path]);
        }, []);
    };
    TF.getChildWithPath = function (names, root) {
        // child found
        if (names.length === 0)
            return root;
        // we're assuming there will be a child (naughty but okay)
        var _a = TF.hasTreeWithName(names[0], root.children, 0), _ = _a[0], childIdx = _a[1];
        //continue the search
        return TF.getChildWithPath(names.slice(1), root.children[childIdx]);
    };
    TF.narrowTraverse = function (path, root) {
        return TF.getChildWithPath(path.split("/"), root).children.reduce(function (acc, child) {
            return acc.concat([path + "/" + child.name]);
        }, []);
    };
    return TF;
}());
exports.TF = TF;
// tests ----------------------------------
var paths = [
    "obstetrics/labour/bleed",
    "obstetrics/labour/dystocia",
    "obstetrics/antepartum/abruption",
    "gynaecology/ovarian/serouscarcinoma",
    "gynaecology/fallopian/ectopic",
    "gynaecology/menorrhagia"
];
var root = TF.createChild(false, "VIVA", []);
var myTree = paths.reduce(function (acc, path) {
    return TF.insertPath(path.split("/"), acc);
}, root);
console.log(TF.narrowTraverse("obstetrics/labour", myTree));
var Tri = /** @class */ (function () {
    function Tri() {
    }
    Tri.create = function (name) { console.log(name); };
    return Tri;
}());
