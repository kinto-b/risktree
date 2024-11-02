<script lang="ts">
    import { debounce } from "$lib/util";
    import { EditorState } from "@codemirror/state";
    import { basicSetup, EditorView } from "codemirror";
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    export let doc: string = ""; // prop to accept initial editor content
    let handleUpdateDebounced = debounce(handleUpdate, 300);
    let editorContainer: HTMLElement;

    const editorTheme = EditorView.theme({
        // Custom theme to remove borders, outlines, and add padding
        "&": {
            outline: "none",
            border: "none",
            padding: "0",
            backgroundColor: "transparent",
            "z-index": 1,
        },
        ".cm-scroller": {
            outline: "none",
            border: "none",
        },
        ".cm-content": {
            outline: "none",
        },
        "&.cm-focused": {
            outline: "none",
        },
        ".cm-activeLine": {
            backgroundColor: "transparent",
        },
        ".cm-gutters": {
            width: "40px",
            background: "#d5d3d4",
        },
        ".cm-lineNumbers": {
            "padding-left": "15px",
        },
    });

    let editorListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
            const newDoc = update.state.doc.toString();
            handleUpdateDebounced(newDoc);
        }
    });

    onMount(() => {
        const startState = EditorState.create({
            doc,
            extensions: [basicSetup, editorTheme, editorListener],
        });

        const view = new EditorView({
            state: startState,
            parent: editorContainer,
        });

        return () => {
            view.destroy();
        };
    });

    function handleUpdate(newDoc: string) {
        if (newDoc === doc) return;
        doc = newDoc;
        dispatch("update", doc);
    }
</script>

<div bind:this={editorContainer}></div>
<div id="gutter"></div>

<style>
    div {
        padding: 0;
        background-color: transparent;
    }

    #gutter {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 100%;
        background: #d5d3d4;
    }
</style>
