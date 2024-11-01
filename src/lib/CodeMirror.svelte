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

<style>
    div {
        padding: 0;
        background-color: transparent;
    }
</style>
