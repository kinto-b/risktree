<script lang="ts">
    import { browser } from "$app/environment";
    import CodeMirror from "$lib/CodeMirror.svelte";
    import { renderMermaid } from "$lib/mermaid";
    import mermaid from "mermaid";
    import { onMount } from "svelte";

    onMount(() => {
        mermaid.initialize({ startOnLoad: true });
    });

    let svgContainer: HTMLElement;
    let diagramCode: string = `{We score} >|yes: 0.5| [We win!]
{We score} >|no: 0.5| {We score on retry}
{We score on retry} >|yes: 0.5| [We win!]
{We score on retry} >|no: 0.5| [We lose!]`;
    let diagramError: boolean = false;

    async function renderDiagram() {
        // console.log(diagramCode);
        if (browser) {
            const { svg } = await renderMermaid(diagramCode);
            svgContainer.innerHTML = svg;
        }
    }

    function handleUpdate(e: CustomEvent) {
        diagramCode = e.detail;
    }

    $: diagramCode && !diagramError && renderDiagram();
</script>

<div class="container">
    <div class="editor">
        <CodeMirror bind:doc={diagramCode} on:update={handleUpdate} />
    </div>
    <span class="chart" bind:this={svgContainer}> </span>
</div>

<style>
    .container {
        display: flex;
        height: 100vh;
    }
    .editor {
        flex: 1;
        padding: 10px;
    }
    .chart {
        flex: 2;
        padding: 10px;
    }
</style>
