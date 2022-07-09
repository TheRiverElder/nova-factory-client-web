<script lang="ts">
    import { getContext } from "svelte";
    import { KEY_APPEND_COMMAND, TYPE_APPEND_COMMAND } from "../context";
    import type { CellPrototype } from "../data/CellPrototype";
    import { translate } from "../language";

    export let shop: Array<CellPrototype>;

    const appendCommand: TYPE_APPEND_COMMAND = getContext(KEY_APPEND_COMMAND);

    function buyItem(item: CellPrototype) {
        appendCommand(`buy ${item.uid}`);
    }
</script>

<div class="StorageView fill">
    <div>商品数量：{shop.length}</div>
    {#each shop as item}
        <div class="item">
            <span>{translate(item.name)}</span>
            <span class="spacer" />
            <span>{item.price}</span>
            <button on:click={() => buyItem(item)}>{translate("buy")}</button>
        </div>
    {/each}
</div>

<style>
    .StorageView {
        padding: 1em;
        display: flex;
        flex-direction: column;
    }

    div.item {
        margin-top: 1em;
        padding: 0 1em;
        width: 100%;
        display: flex;
        align-items: center;
    }

    button {
        margin: 0;
    }

    .spacer {
        height: 100%;
        flex: 1;
    }
</style>
