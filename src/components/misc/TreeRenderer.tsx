import type {Tree, Treeable, TreeNode} from "../../util/Tree.ts";
import {type JSX, type Ref, useEffect, useMemo, useRef} from "react";
import type {DisplayItem} from "../../util/utils.ts";

export function TreeRenderer<T extends Treeable<T> & DisplayItem>(
    {tree, nodeElement, displayMode = "vertical"}:
    {
        tree: Tree<T>,
        nodeElement: ({node, ref}: {node: TreeNode<T>, ref: Ref<HTMLDivElement> | undefined}) => JSX.Element,
        displayMode: "vertical" | "vertical-reversed" | "horizontal" | "reverse-horizontal"
    }
) {

    const nodeRefs = useRef(new Map<T, HTMLElement>());
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const treeContainerRef = useRef<HTMLDivElement>(null);

    function drawTreeNodeConnections() {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const containerRect = treeContainerRef.current!.getBoundingClientRect();
        switch (displayMode) {
            case "vertical": {
                nodeRefs.current.forEach((element, object) => {
                    const childRect = element.getBoundingClientRect();
                    if (childRect.width !== 0 && childRect.height !== 0) for (const parent of object.ancestors ?? []) {
                        const parentRect = nodeRefs.current.get(parent)!.getBoundingClientRect();
                        if (parentRect.bottom !> containerRect.top &&
                            childRect.y !< containerRect.bottom && childRect.left < containerRect.right &&
                            childRect.right > containerRect.left) {
                            ctx.beginPath();
                            ctx.moveTo(childRect.x + (childRect.width / 2), childRect.top);
                            ctx.lineTo(parentRect.x + (childRect.width / 2), parentRect.bottom);
                            ctx.stroke();
                        }
                    }
                });
            } break;
            case "vertical-reversed": {
                nodeRefs.current.forEach((element, object) => {
                    const childRect = element.getBoundingClientRect();
                    if (childRect.width !== 0 && childRect.height !== 0) for (const parent of object.ancestors ?? []) {
                        const parentRect = nodeRefs.current.get(parent)!.getBoundingClientRect();
                        if (parentRect.top !< containerRect.bottom &&
                            childRect.bottom !> containerRect.top && childRect.left < containerRect.right &&
                            childRect.right > containerRect.left) {
                            ctx.beginPath();
                            ctx.moveTo(childRect.x + (childRect.width / 2), childRect.bottom);
                            ctx.lineTo(parentRect.x + (childRect.width / 2), parentRect.top);
                            ctx.stroke();
                        }
                    }
                });
            } break;
            case "horizontal": {
                nodeRefs.current.forEach((element, object) => {
                    const childRect = element.getBoundingClientRect();
                    if (childRect.width !== 0 && childRect.height !== 0) for (const parent of object.ancestors ?? []) {
                        const parentRect = nodeRefs.current.get(parent)!.getBoundingClientRect();
                        if (parentRect.top !< containerRect.bottom &&
                            childRect.bottom !> containerRect.top && childRect.left < containerRect.right &&
                            parentRect.right > containerRect.left) {
                            ctx.beginPath();
                            ctx.moveTo(childRect.left, childRect.y + childRect.height / 2);
                            ctx.lineTo(parentRect.right, parentRect.y + parentRect.height / 2);
                            ctx.stroke();
                        }
                    }
                });
            } break;
            case "reverse-horizontal": {
                nodeRefs.current.forEach((element, object) => {
                    const childRect = element.getBoundingClientRect();
                    if (childRect.width !== 0 && childRect.height !== 0) for (const parent of object.ancestors ?? []) {
                        const parentRect = nodeRefs.current.get(parent)!.getBoundingClientRect();
                        if (parentRect.top !< containerRect.bottom &&
                            childRect.bottom !> containerRect.top && parentRect.left < containerRect.right &&
                            childRect.right > containerRect.left) {
                            ctx.beginPath();
                            ctx.moveTo(childRect.right, childRect.y + childRect.height / 2);
                            ctx.lineTo(parentRect.left, parentRect.y + parentRect.height / 2);
                            ctx.stroke();
                        }
                    }
                });
            } break;
        }
    }

    const nodesToDisplay = useMemo(() => {
        switch (displayMode) {
            case "horizontal":
            case "vertical": return tree.nodeArray;
            case "reverse-horizontal":
            case "vertical-reversed": return tree.nodeArray.reverse();
        }
    }, [tree.nodeArray]);

    useEffect(() => {
        drawTreeNodeConnections();
    }, [nodeRefs.current]);

    useEffect(() => {
        treeContainerRef.current!.addEventListener("scroll", drawTreeNodeConnections);
        addEventListener("resize", drawTreeNodeConnections);
        return () => {
            treeContainerRef.current!.removeEventListener("scroll", drawTreeNodeConnections);
            removeEventListener("resize", drawTreeNodeConnections);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className="fixed left-0 top-0 pointer-events-none z-0"
                    width={screen.width}
                    height={screen.height}/>
            <div ref={treeContainerRef} className={`space-y-4 z-1 overflow-scroll
             max-h-[70vh] max-w-[90vw] overflow-x-hidden h-full 
             [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-card-content-background
             [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:w-3
            ${(displayMode === "horizontal" || displayMode === "reverse-horizontal") && 
            "flex overflow-x-scroll justify-evenly space-x-4 overflow-y-hidden"}`}>
                {
                    nodesToDisplay.map((value, index) =>
                        <div key={`${index}/${tree.depth}`}
                             className={`flex place-self-center space-x-4 
                             ${(displayMode === "horizontal" || displayMode === "reverse-horizontal") &&
                             "flex-col space-y-4 space-x-0"}`}>
                            {value.map(node =>
                                nodeElement({
                                    node: node,
                                    ref: e => nodeRefs.current.set(node.value, e!)
                                })
                            )}
                        </div>
                    )
                }
            </div>
        </>
    );
}