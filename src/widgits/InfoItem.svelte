<script lang="ts" context="module">
    import { shortenNumber } from "../utils/numebr-display";

    function wrap(value: any): string {
        if (value === undefined || value === null) return "--";
        else if (typeof value === "number") return shortenNumber(value);
        else return value;
    }
</script>

<script lang="ts">
    export let title: string = "";
    export let value: any = "";
    export let unit: string = "";
</script>

<div class="InfoItem fill">
    <div class="title flex-1">
        <span>{title}</span>
    </div>
    <div class="content">
        <span class="value">{wrap(value)}</span>
        <span class="unit">{unit}</span>
    </div>
</div>

<style>
    .InfoItem {
        padding: 0.5em;
    }

    .title {
        /* width: 61.8%; */
        font-style: italic;
        text-align: start;
        /* border-bottom: 0.05em solid #ffffff; */
    }

    .content {
        font-family: "Milibus Sb", "Consolas";
        font-size: 1.5em;
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
    }

    .content > .value {
        font-size: 1em;
    }

    .content > .unit {
        margin-left: 1em;
        font-size: 0.5em;
    }
</style>
