<script lang="ts">
    import { renderMermaid } from "$lib/mermaid";
    import { fade } from "svelte/transition";
    import panzoom from "svg-pan-zoom";

    export let code = "";
    let container: HTMLDivElement;
    let hide = false;
    let pzoom: typeof panzoom | undefined;

    function handlePanZoom(id: string) {
        hide = true;
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

    $: updateDiagram(code);
</script>

<div id="container" bind:this={container} transition:fade></div>

<style>
    #container {
        height: 100vh;
    }
</style>
