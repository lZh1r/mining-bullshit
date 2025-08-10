export class Tree<T extends Treeable<T>> {
    public nodeArray: TreeNode<T>[][] = [];
    public rootNode: TreeNode<T>;
    private addedToArray: Set<T> = new Set();

    private getChildNodesOf(
        value: T,
        lookupMap: Map<T, T[]>,
        cache = new Map<T, TreeNode<T>[]>()): TreeNode<T>[] {
        if (cache.has(value)) {
            return cache.get(value)!;
        }
        const rawChildren = lookupMap.get(value);
        if (!rawChildren || rawChildren.length === 0) {
            return [];
        }
        const children: TreeNode<T>[] = rawChildren.map(entry => ({
                value: entry,
                children: this.getChildNodesOf(entry, lookupMap)
        }));
        cache.set(value, children);
        return children;
    }

    private populateNodeArray(node: TreeNode<T>, currentDepth = 1) {
        for (const child of node.children) {
            if (!this.nodeArray[currentDepth]) this.nodeArray[currentDepth] = [];
            if (this.addedToArray.has(child.value)) return;
            this.addedToArray.add(child.value);
            this.nodeArray[currentDepth].push(child);
            this.populateNodeArray(child, currentDepth+1);
        }
    }

    constructor(
        values: T[]
    ) {
       const childrenLookupMap = new Map<T, T[]>();
       let rootValue: T | undefined;
       let isRootFound = false;
        for (const value of values) {
            if (!value.ancestors) {
                if (!isRootFound) {
                    rootValue = value;
                    isRootFound = true;
                } else {
                    throw new Error("Invalid values used for tree construction:" +
                        " multiple root values are not allowed!");
                }
            } else {
                for (const parent of value.ancestors) {
                    childrenLookupMap.set(parent, [...(childrenLookupMap.get(parent) ?? []), value]);
                }
            }
        }
        if (!rootValue) throw new Error("Invalid values used for tree construction: no root found!");
        this.rootNode = {
            value: rootValue,
            children: this.getChildNodesOf(rootValue, childrenLookupMap)
        };
        this.nodeArray[0] = [this.rootNode];
        this.populateNodeArray(this.rootNode);
    }

    get depth() {
        return this.nodeArray.length;
    }
}

interface TreeNode<T extends Treeable<T>> {
    value: T,
    children: TreeNode<T>[]
}

export interface Treeable<T> {
    ancestors: T[] | null
}
