import { Graph } from "$lib/graph";
import { Parser } from "$lib/parser";
import type { RenderResult } from "mermaid";
import mermaid from "mermaid";


export function renderMermaid(input: string): Promise<RenderResult> {
    const parser = new Parser()
    let { nodes, edges } = parser.parse(input);
    const graph = new Graph(nodes, edges);
    const diagramCode = graph.diagramCode();
    console.log(diagramCode);
    return mermaid.render("mermaid", diagramCode);
}
