<script lang="ts">
</script>

<div class="Panel fill">
    <slot name="title"/>
    <div class="content flex-1">
        <slot name="content"/>
    </div>
</div>

<style>
    .Panel {
        padding: 1.5em;
        overflow: hidden;
        background-color: #22240f7f;
        color: #ffffff;
        backdrop-filter: blur(2px);
        border-radius: 0.2em;
        border: #ffff00 solid 0.1em;
        box-shadow: inset #ffff00 0 0 0.5em;
        display: flex;
        flex-direction: column;
    }

    .content {
        overflow: hidden;
    }
</style>
