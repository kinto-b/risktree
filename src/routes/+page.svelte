<script lang="ts">
    import { browser } from "$app/environment";
    import CodeMirror from "$lib/CodeMirror.svelte";
    import InfoPanel from "$lib/InfoPanel.svelte";
    import MermaidView from "$lib/MermaidView.svelte";
    import { renderMermaid } from "$lib/mermaid";
    import mermaid from "mermaid";
    import { onMount } from "svelte";

    onMount(() => {
        mermaid.initialize({ startOnLoad: true });
    });

    let svgContainer: HTMLElement;
    let diagramCode: string = `
{Conservatives control lower house} >|yes: 0.5| {Conservatives propose law}
{Conservatives control lower house} >|no: 0.5| {Progressives propose law}

{Conservatives propose law} >|yes: 0.8| [Law proposed]
{Progressives propose law} >|yes: 0.4| [Law proposed]

[Law proposed] > {Conservatives control upper house} 

{Conservatives control upper house} >|yes: 0.5| {Conservatives pass law}
{Conservatives control upper house} >|no: 0.5|  {Progressives pass law}

{Conservatives pass law} >|yes: 0.9| [Law passed]
{Progressives pass law} >|yes: 0.5| [Law passed]
`;
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

    $: diagramCode && !diagramError; // && renderDiagram();
</script>

<div class="container">
    <div class="editor">
        <CodeMirror bind:doc={diagramCode} on:update={handleUpdate} />
    </div>
    <div class="chart">
        <MermaidView bind:code={diagramCode} />
    </div>
</div>
<InfoPanel></InfoPanel>

<style>
    :global(body) {
        margin: 0;
        margin-top: 10px;
    }

    .container {
        display: flex;
        height: 100vh;
    }
    .editor {
        flex: 1;
        padding: 0;
        padding-right: 40px;
        border-right: 1px solid black;
    }
    .chart {
        flex: 2;
        padding: 10px;
    }
</style>
