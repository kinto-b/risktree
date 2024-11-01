import { is_whitespace, unsafeHash } from "$lib/util";

type VertexType = "state" | "choice"

export abstract class Vertex {
    label: string;
    id: string;
    prob: number;
    _acc: number | undefined; // Accumulated probability

    constructor(label: string) {
        this.label = label;
        this.id = this.hashId(label);
        this.prob = 1;
    }

    private hashId(label: string): string {
        return unsafeHash(label);
    }

    abstract mermaid(): string
}

export class State extends Vertex {
    constructor(label: string) {
        super(label);
    }

    mermaid(): string {
        const prob = this._acc === undefined ? this.prob : this._acc;
        return `${this.id}["${this.label} (${Math.round(100 * prob)}%)"]`
    }
}

export class Choice extends Vertex {
    constructor(label: string) {
        super(label);
    }

    mermaid(): string {
        return `${this.id}{"${this.label}"}`
    }
}

export class Edge {
    from: Vertex;
    to: Vertex;
    label: string;
    prob: number;

    constructor(from: Vertex, to: Vertex, label: string, prob: number) {
        this.from = from;
        this.to = to;
        this.label = label;
        this.prob = prob;
    }

    mermaid(): string {
        const prob = this.prob < 1 ? `(${Math.round(100 * this.prob)}%)` : '';
        const label = `"${this.label} ${prob}"`;
        return `${this.from.id} -->|${label}| ${this.to.id}`
    }
}

export class Parser {
    input: string = "";
    i: number = 0;
    line: number = 1;
    lineStart: number = 0;

    parse(input: string): { nodes: Vertex[], edges: Edge[] } {
        this.input = input
        this.i = 0;
        this.line = 1;
        this.lineStart = 0;

        let nodes: Vertex[] = [];
        let edges: Edge[] = [];


        while (this.i < input.length) {
            if (this.currentChar() === '[') {
                nodes.push(this.parseVertex("state"));
            } else if (this.currentChar() === '{') {
                nodes.push(this.parseVertex("choice"));
            } else if (this.currentChar() === '>') {
                const from = nodes.pop();
                if (from == undefined) {
                    this.error("[ or {", ">")
                }
                const edge = this.parseEdge(from);
                nodes.push(from);
                nodes.push(edge.to);
                edges.push(edge);
            } else if (is_whitespace(this.currentChar())) {
                this.advanceOne()
            } else {
                this.error("[, {, or >", this.currentChar())
            }
        }

        nodes = this.deduplicateVertices(nodes);

        return { nodes, edges };
    }

    private deduplicateVertices(vertices: Vertex[]): Vertex[] {
        const seen = new Set<string>();
        return vertices.filter((v) => {
            if (!seen.has(v.id)) {
                seen.add(v.id);
                return true;
            }
            return false;
        });
    }

    private currentChar(): string {
        return this.input[this.i]
    }

    private incrementLineCount() {
        this.line += 1;
        this.lineStart = this.i + 1;
    }

    private advanceOne() {
        if (this.currentChar() == '\n') {
            this.incrementLineCount();
        }
        this.i++;
    }

    private advanceCollect(until: string): string {
        let collected = '';
        while (this.currentChar() != until) {
            collected += this.currentChar();
            this.advanceOne();
            if (this.i > this.input.length) {
                this.error(until, 'EOF')
            }
        }
        return collected;
    }

    private parseVertex(type: VertexType): Vertex {
        this.i++; // [
        const until = type === 'state' ? ']' : '}';
        const label = this.advanceCollect(until).trim();
        this.i++; // ]

        if (type === 'state') {
            return new State(label)
        } else {
            return new Choice(label);
        }
    }

    private parseEdge(from: Vertex): Edge {
        this.i++; // >
        let to: Vertex | undefined;
        let label = '';
        let prob = 1.0;

        while (this.i < this.input.length && is_whitespace(this.currentChar())) {
            this.advanceOne();
        }

        if (this.input[this.i] === '|') {
            let result = this.parseEdgeLabel();
            label = result.label;
            prob = result.prob;
        }

        while (this.i < this.input.length && is_whitespace(this.currentChar())) {
            this.advanceOne();
        }

        if (this.input[this.i] === '[') {
            to = this.parseVertex("state");
        } else if (this.input[this.i] === '{') {
            to = this.parseVertex("choice");
        } else if (this.i < this.input.length) {
            this.error("[ or {", this.currentChar())
        }

        if (to == undefined) {
            this.error("[ or {", "EOF");
        } else {
            return new Edge(from, to, label, prob);
        }
    }

    private parseEdgeLabel(): { label: string, prob: number } {
        this.i++; // |
        let prob: number = 1.0;
        let label = this.advanceCollect("|");
        this.i++; // |

        const parts = label.split(':');
        if (parts.length === 2) {
            label = parts[0].trim();
            prob = parseFloat(parts[1].trim());
            if (Number.isNaN(prob)) {
                this.error("number", `'${parts[1].trim()}'`)
            }
            if (prob < 0 || prob > 1) {
                this.error("a number in the range [0,1]", `'${parts[1].trim()}'`)
            }
        }

        return { label, prob }
    }

    private error(expected: string, actual: string): never {
        throw new ParseError(expected, actual, this.line, this.i - this.lineStart)
    }
}

export class ParseError extends Error {
    expected: string
    actual: string
    line: number
    column: number

    constructor(expected: string, actual: string, line: number, column: number) {
        super(`Parse error at line ${line} column ${column}, expected ${expected} but got ${actual}`)
        this.expected = expected
        this.actual = actual
        this.line = line
        this.column = column
    }
}
