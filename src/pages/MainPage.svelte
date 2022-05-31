<script lang="ts" context="module">
</script>

<script lang="ts">
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import FactoryInfoView from "../components/FactoryInfoView.svelte";
    import ReactorInfoView from "../components/ReactorInfoView.svelte";
    import SlotInfoView from "../components/SlotInfoView.svelte";
    import type { Factory } from "../data/Factory";
    import type { Reactor } from "../data/Reactor";
    import { Context2dReactorGraphic } from "../graphics/Context2dReactorGraphic";
    import Panel from "../widgits/Panel.svelte";

    let canvas: HTMLCanvasElement;

    export let index: number;
    export let reactor: Reactor | null;
    export let factory: Factory | null;

    function setIndex(i: number) {
        index = i;
    }

    const graphic = new Context2dReactorGraphic();

    onMount(() => {
        onResize();
        graphic.init(canvas, (n) => (displaySlotInfoNumber = n));
    });
    afterUpdate(() => {
        if (reactor) {
            graphic.render(reactor);
        }
    });
    onDestroy(() => graphic.dispose());

    let displaySlotInfoNumber: number = -1;

    function onResize() {
        const canvasRect = canvas.getBoundingClientRect();
        canvas.width = canvasRect.width;
        canvas.height = canvasRect.height;
        if (reactor) {
            graphic.render(reactor);
        }
    }
</script>

<svelte:window on:resize={onResize} />

<div class="fill MainPage">
    <div class="left">
        <Panel>
            <h3 class="title" slot="title">发电厂信息</h3>
            <div slot="content">
                {#if factory}
                    <FactoryInfoView {factory} {setIndex} {index} />
                {/if}
            </div>
        </Panel>
    </div>

    <div class="middle">
        <Panel>
            <h1 class="title" slot="title">
                {#if reactor}
                    反应堆 {index} 号
                {/if}
            </h1>
            <div class="canvas-wrapper fill" slot="content">
                <canvas class="fill" bind:this={canvas} />
            </div>
        </Panel>
    </div>

    <div class="right">
        <div class="right-up">
            <Panel>
                <h3 class="title" slot="title">反应堆信息</h3>
                <div slot="content">
                    {#if reactor}
                        <ReactorInfoView {reactor} {index} />
                    {/if}
                </div>
            </Panel>
        </div>
        <div class="right-down">
            <Panel>
                <h3 class="title" slot="title">单元槽信息</h3>
                <div slot="content">
                    {#if reactor && displaySlotInfoNumber >= 0}
                        <SlotInfoView cellSlot={reactor.slots[displaySlotInfoNumber]} {reactor} reactorIndex={index} />
                    {/if}
                </div>
            </Panel>
        </div>
    </div>
</div>

<style>
    div.MainPage {
        display: flex;
        flex-direction: row;
        font-size: 2vh;
        padding: 1em;
    }

    div.right,
    div.middle,
    div.right {
        height: 100%;
    }

    div.middle {
        flex: 6;
        text-align: center;
        margin-left: 1em;
        margin-right: 1em;
        display: flex;
        flex-direction: column;
    }

    .canvas-wrapper {
        padding: 2em;
        overflow: hidden;
    }

    h1 {
        font-size: 5vh;
        text-shadow: #000000 0 0 0.1em;
    }

    div.left,
    div.right {
        flex: 3;
        display: flex;
        flex-direction: column;
    }

    div.right-up {
        flex: 1;
        margin-bottom: 1em;
    }

    div.right-down {
        flex: 1;
    }

    div.right-up,
    div.right-down {
        display: flex;
        flex-direction: row;
    }

    canvas {
        cursor: pointer;
        box-shadow: #ffff00 0 0 0.5em;
        border-radius: 0.2em;
        border: #ffff00 solid 0.1em;
    }

    .title {
        margin-top: 0;
    }
</style>
