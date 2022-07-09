<script lang="ts">
    import { getContext } from "svelte";
    import { KEY_APPEND_MESSAGE, KEY_GET_CONNECTION, TYPE_APPEND_MESSAGE, TYPE_GET_CONNECTION } from "../context";
    import { simpleResponse } from "../utils/lang";

    export let commands: string = "";

    const appendMessage: TYPE_APPEND_MESSAGE = getContext(KEY_APPEND_MESSAGE);
    const getConnection: TYPE_GET_CONNECTION = getContext(KEY_GET_CONNECTION);
    const gameConn = getConnection();

    function execute() {
        const action = "执行指令";
        simpleResponse(gameConn.execute(commands), action, appendMessage);
    }

    function clear() {
        commands = "";
    }

    function format() {
        // TODO
    }
</script>

<div class="GameCommandView fill">
    <div class="input-wrapper flex-1">
        <textarea class="fill" bind:value={commands} />
    </div>
    <div class="button-bar">
        <button on:click={execute}>执行</button>
        <button on:click={clear}>清空</button>
        <button on:click={format}>格式化</button>
    </div>
</div>

<style>
    .GameCommandView {
        display: flex;
        flex-direction: column;
    }

    .input-wrapper {
    }

    textarea {
        resize: none;
        overflow: auto;
        background-color: #00000000;
        color: #ffff00;
        font-family: Consolas;
    }

    .button-bar {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    button {
        margin-top: 1em;
        font-size: 1em;
        padding: 0.5em 1em;
        outline: none;
        font-weight: bold;
        border: #ffff00 solid 0.1em;
        background-color: #ffff00;
    }
</style>
