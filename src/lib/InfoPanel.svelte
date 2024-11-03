<script>
    let showPanel = false;
</script>

<div id="menu">
    <button class="icon-button" on:click={() => (showPanel = !showPanel)}>
        <img src="/info.svg" alt="Info" width="30" height="30" />
    </button>
</div>

{#if showPanel}
    <div class="info-panel">
        <div class="info-content">
            <h2>Welcome to risktree!</h2>
            <p>A tool for making probability guesstimates.</p>
            <p>
                Sometimes you want to know how likely something is, but you
                don't have any data. The best you can do is to form an educated
                guess. But you don't have to do that right off!
            </p>
            <p>
                It's often easier to estimate probabilities of events which are
                causally upstream of whatever you're interested in than the
                thing itself. You can form a more reliable guesstimate using a
                decision tree and a little bit of math.
            </p>
            <h2>Syntax</h2>
            <p>
                Use square brackets to declare events, curly braces to declare
                choices, and arrows to declare pathways.
            </p>
            <pre>&#123;a choice&#125; >|a path: prob| [a state]</pre>
            <p>Path labels and/or probabilities may be omitted, e.g.</p>
            <pre>&#123;a choice&#125; >|: prob| [a state]</pre>

            <h2>Limitations</h2>
            <p>
                The graph should not include multiple convergent paths with
                separate root nodes. If you create a graph like this, you will
                end up with leaf nodes having greater than 100% probability.
            </p>
        </div>
    </div>
{/if}

<style>
    #menu {
        position: fixed;
        display: flex;
        top: 10px;
        right: 10px;
        z-index: 2;
        margin: 0;
    }

    .icon-button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .info-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: 300px; /* Adjust the width as needed */
        height: 100vh;
        background-color: #f0f0f0;
        padding: 0 20px 0 20px;
        position: absolute;
        z-index: 1;
        bottom: 0;
        box-shadow: -3px 0 6px rgba(0, 0, 0, 0.28);
    }

    .info-content {
        top: 20px;
    }

    h2 {
        font-size: inherit;
        display: block;
        font-family: Calibri, Helvetica, sans-serif;
        color: #0008;
        margin: 1em -10px 10px -20px;
        border-bottom: 1px solid #0004;
        padding: 15px 0 7px 20px;
    }
</style>
