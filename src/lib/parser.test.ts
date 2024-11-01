// parser.test.ts
import { Choice, ParseError, Parser, State } from '$lib/parser';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Parser', () => {
    let parser: Parser;

    beforeEach(() => {
        parser = new Parser();
    });

    it('parses single state', () => {
        const input = `[state one]`;
        let { nodes, edges: _ } = parser.parse(input);

        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeInstanceOf(State);
        expect(nodes[0].label).toBe('state one');
    });

    it('parses multiple states with deduplication', () => {
        const input = `[state one]\n[state one]\n[state two]`;
        let { nodes, edges: _ } = parser.parse(input);

        expect(nodes).toHaveLength(2); // Only two unique states should be present
        expect(nodes[0].label).toBe('state one');
        expect(nodes[1].label).toBe('state two');
    });

    it('parses choices', () => {
        const input = `{choice one}\n{choice two}`;
        let { nodes, edges: _ } = parser.parse(input);

        expect(nodes).toHaveLength(2);
        expect(nodes[0]).toBeInstanceOf(Choice);
        expect(nodes[0].label).toBe('choice one');
        expect(nodes[1]).toBeInstanceOf(Choice);
        expect(nodes[1].label).toBe('choice two');
    });

    it('parses edges between states and choices', () => {
        const input = `[state one]\n{choice one}\n[state one] >|label:0.5| {choice one}`;
        let { nodes: _, edges } = parser.parse(input);

        expect(edges).toHaveLength(1);
        const edge = edges[0];
        expect(edge.from.label).toBe('state one');
        expect(edge.to.label).toBe('choice one');
        expect(edge.label).toBe('label');
        expect(edge.prob).toBe(0.5);
    });

    it('parses edge with default prob when prob is missing', () => {
        const input = `[state one] >|label| {choice one}`;
        let { nodes: _, edges } = parser.parse(input);

        expect(edges).toHaveLength(1);
        const edge = edges[0];
        expect(edge.label).toBe('label');
        expect(edge.prob).toBe(1); // Default if none is provided
    });

    it('parses edge with default label when label is missing', () => {
        const input = `[state one] >|:0.1| {choice one}`;
        let { nodes: _, edges } = parser.parse(input);

        expect(edges).toHaveLength(1);
        const edge = edges[0];
        expect(edge.label).toBe('');
        expect(edge.prob).toBe(0.1); // Default if none is provided
    });

    it('Error unclosed node', () => {
        const input = `{choice one}\n>\n[state one`;
        try {
            parser.parse(input);
        } catch (err) {
            expect(err).toBeInstanceOf(ParseError)
            const parseErr = err as ParseError; // Satisfy the linter
            expect(parseErr.expected).toBe(']')
            expect(parseErr.actual).toBe('EOF')
            expect(parseErr.line).toBe(3)
        }
    });

    it('Error unclosed edge', () => {
        const input = `[state one]>`;
        try {
            parser.parse(input);
        } catch (err) {
            expect(err).toBeInstanceOf(ParseError)
            const parseErr = err as ParseError; // Satisfy the linter
            expect(parseErr.expected).toBe('[ or {')
            expect(parseErr.actual).toBe('EOF')
            expect(parseErr.line).toBe(1)
        }
    });

    it('Error hanging edge', () => {
        const input = `>[state one]`;
        try {
            parser.parse(input);
        } catch (err) {
            expect(err).toBeInstanceOf(ParseError)
            const parseErr = err as ParseError; // Satisfy the linter
            expect(parseErr.expected).toBe('[ or {')
            expect(parseErr.actual).toBe('>')
            expect(parseErr.line).toBe(1)
            expect(err).toBeInstanceOf(ParseError)
        }
    });

    it('Error unexpected character', () => {
        const input = `[state one]->[state two]`;
        try {
            parser.parse(input);
        } catch (err) {
            expect(err).toBeInstanceOf(ParseError)
            const parseErr = err as ParseError; // Satisfy the linter
            expect(parseErr.expected).toBe('[, {, or >')
            expect(parseErr.actual).toBe('-')
            expect(parseErr.line).toBe(1)
            expect(err).toBeInstanceOf(ParseError)
        }
    });

    it('Error unexpected character', () => {
        const input = `[state one]>...[state two]`;
        try {
            parser.parse(input);
        } catch (err) {
            expect(err).toBeInstanceOf(ParseError)
            const parseErr = err as ParseError; // Satisfy the linter
            expect(parseErr.expected).toBe('[ or {')
            expect(parseErr.actual).toBe('.')
            expect(parseErr.line).toBe(1)
            expect(err).toBeInstanceOf(ParseError)
        }
    });


});
