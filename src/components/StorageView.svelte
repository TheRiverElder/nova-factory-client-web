<script lang="ts">
    import { getContext } from "svelte";

    import { KEY_APPEND_COMMAND, KEY_APPEND_MESSAGE, TYPE_APPEND_COMMAND, TYPE_APPEND_MESSAGE } from "../context";

    import type { Cell } from "../data/Cell";
    import { translate } from "../language";

    export let storage: Array<Cell>;
    export let reactorUid: number;
    export let selectedSlotNumber: number;

    const appendCommand: TYPE_APPEND_COMMAND = getContext(KEY_APPEND_COMMAND);
    const appendMessage: TYPE_APPEND_MESSAGE = getContext(KEY_APPEND_MESSAGE);

    function sellItem(item: Cell) {
        appendCommand(`sell ${item.uid}`);
    }

    function useItem(item: Cell) {
        console.log(reactorUid, selectedSlotNumber, item.uid);
        if (reactorUid < 0) {
            appendMessage(`未选择反应堆`);
            return;
        }
        if (selectedSlotNumber < 0) {
            appendMessage(`未选择槽位`);
            return;
        }
        appendCommand(`use ${reactorUid} ${selectedSlotNumber} ${item.uid}`);
    }
</script>

<div class="StorageView fill">
    <div>库存数量：{storage.length}</div>
    {#each storage as item}
        <div class="item">
            <span>{translate(item.id)}</span>
            <span class="spacer" />
            <button on:click={() => sellItem(item)}>{translate("sell")}</button>
            <button on:click={() => useItem(item)}>{translate("use")}</button>
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
