<script lang="ts">

    export let titles: Array<string> = [];
    export let data: Array<Array<any>>;
    export let weights: Array<number> = [];
</script>

<div>
    {#if titles}
        <div>
            {#each titles as title}
                <div>{title}</div>
            {/each}
        </div>
    {/if}
    <div>
        {#each data as row}
            <div class="row">
                {#each row as item, colIndex}
                    <div style={weights.length > colIndex ? "flex: " + weights[colIndex] : ""}>{item}</div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .row {
        font-family: "Milibus Sb", 'Consolas';
        padding: .2em 0;
        border-bottom: 0.1em solid #223344;
        display: flex;
        flex-direction: row;
    }

    .row > * {
        text-align: start;
    }
</style>