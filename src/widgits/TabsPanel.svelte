
<script lang="ts" context="module">
    export interface TabInfo {
        value: number | string;
        text: string;
    }
</script>

<script lang="ts">
    export let tabs: Array<TabInfo> = [];
    export let tabIndex: number = 0;
    export let tab: number | string = tabs[tabIndex].value;

    function setTabIndex(index: number) {
        tabIndex = index;
        tab = tabs[tabIndex].value;
    }
</script>

<div class="TabsPanel fill">
    <div class="tabs">
        {#each tabs as tab, i (tab.value)}
            <div class="tab" class:current={tabIndex === i} on:click={() => setTabIndex(i)}>{tab.text}</div>
        {/each}
    </div>
    <div class="content flex-1">
        <slot />
    </div>
</div>

<style>
    .TabsPanel {
        display: flex;
    }

    div.tabs {
        height: 100%;
        width: 2em;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 1em;
    }

    div.content {
        height: 100%;

        background-color: #22240f7f;
        color: #ffffff;
        backdrop-filter: blur(2px);
        border-radius: 0.2em;
        border: #ffff00 solid 0.1em;
        box-shadow: inset #ffff00 0 0 0.5em;
    }

    div.tab {
        width: 100%;
        padding: 1em 0.2em;
        writing-mode: vertical-lr;
        cursor: pointer;

        font-weight: bold;
        background-color: #22240f7f;
        color: #ffffff;
        backdrop-filter: blur(2px);
        border: #ffff00 solid 0.1em;
        box-shadow: inset #ffff00 0 0 0.5em;
        border-right: none;
    }

    div.tab.current {
        background-color: #ffff00;
        color: #22240f;
        backdrop-filter: blur(2px);
        border: #ffff00 solid 0.1em;
        box-shadow: none;
    }
</style>
