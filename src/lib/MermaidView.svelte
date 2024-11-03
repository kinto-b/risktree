<script lang="ts">
    import { renderMermaid } from "$lib/mermaid";
    import mermaid from "mermaid";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import panzoom from "svg-pan-zoom";

    onMount(() => {
        mermaid.initialize({ startOnLoad: true });
        loaded = true;
    });

    export let code = "";
    let loaded = false;
    let container: HTMLDivElement;
    let pzoom: typeof panzoom | undefined;

    function handlePanZoom(id: string) {
        pzoom?.destroy();
        pzoom = undefined;
        void Promise.resolve().then(() => {
            const graphDiv = document.querySelector<HTMLElement>(id);
            if (!graphDiv) {
                return;
            }
            pzoom = panzoom(graphDiv, {
                controlIconsEnabled: false,
                fit: true,
                center: true,
            });
        });
    }

    async function updateDiagram(code: string) {
        const { svg, bindFunctions } = await renderMermaid(
            code,
            "mermaid-graph",
        );
        // console.log(svg);

        if (svg.length > 0) {
            handlePanZoom("#mermaid-graph");
            container.innerHTML = svg;
            const graphDiv =
                document.querySelector<SVGSVGElement>("#mermaid-graph");
            if (!graphDiv) {
                throw new Error("mermaid-graph not found");
            }
            graphDiv.setAttribute("height", "100%");
            graphDiv.style.maxWidth = "100%";
            if (bindFunctions) {
                bindFunctions(graphDiv);
            }
        }
    }

    $: loaded && updateDiagram(code);
</script>

<div id="container" bind:this={container} transition:fade></div>

<style>
    #container {
        height: 100vh;
    }
</style>
