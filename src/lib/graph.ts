import { Edge, Vertex } from "$lib/parser";

export class Graph {
    nodes: Map<string, Vertex> = new Map(); // ID to Vertex
    edges: Map<string, Edge[]> = new Map(); // ID to ID
    private diagram: string = 'graph TD';
    private propagated: boolean = false;

    constructor(nodes: Vertex[], edges: Edge[]) {
        for (let v of nodes) {
            this.nodes.set(v.id, v);
            this.edges.set(v.id, [])
        }

        for (let e of edges) {
            this.edges.get(e.from.id)?.push(e);
            this.diagram += "\n" + e.mermaid()
        }
    }

    diagramCode(): string {
        this.propagateProbability();
        let diagram = this.diagram;
        this.nodes.forEach((v, _) => {
            diagram += "\n" + v.mermaid();
        })
        return diagram;
    }

    private propagateProbability() {
        if (this.propagated) return;

        const order = this.topologicalOrder();

        for (let node of order) {
            const fr = this.nodes.get(node);
            // @ts-ignore
            if (fr._acc === undefined) {
                // @ts-ignore
                fr._acc = this.nodes.get(node).prob
            }

            // @ts-ignore
            for (let e of this.edges.get(node)) {
                // @ts-ignore
                this.nodes.get(e.to.id)._acc =
                    // @ts-ignore
                    (this.nodes.get(e.to.id)._acc ?? 0) +
                    // @ts-ignore
                    this.nodes.get(e.to.id).prob * fr._acc * e.prob
            }
        }

        this.propagated = true;
    }


    private topologicalOrder() {
        let stack: string[] = [];
        let visited: Map<string, boolean> = new Map();
        this.nodes.forEach((_, k) => visited.set(k, false))

        this.nodes.forEach((_, k) => {
            if (!visited.get(k)) {
                this.DFS(k, visited, stack);
            }
        })

        return stack.reverse();
    }


    private DFS(node: string, visited: Map<string, boolean>, stack: string[]) {
        visited.set(node, true);
        // @ts-ignore
        for (let e of this.edges.get(node)) {
            if (!visited.get(e.to.id)) {
                this.DFS(e.to.id, visited, stack);
            }
        }
        stack.push(node);
    }
}
