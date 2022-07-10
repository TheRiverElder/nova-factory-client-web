<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { makeColor } from "../graphics/utils";
    import { getChamferPath, linkClosedPath } from "../utils/graphics";

    export let value: number = 0;
    export let maxValue: number = 1;
    export let valueMapper: (input: number) => number = (n) => n;
    export let colorMapper: (input: number) => number = (n) => n;
    export let valves: Array<number> = [];

    let canvas: HTMLCanvasElement;

    function draw() {
        if (!canvas) return;

        const g = canvas.getContext("2d");

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        const halfWidth = width / 2;
        const quaterWidth = width / 4;

        g.clearRect(0, 0, width, height);

        g.save();

        g.translate(0, height);
        g.scale(1, -1);

        const v = valueMapper(value);
        const ratio = v / maxValue;

        g.save();

        g.lineWidth = 2;

        linkClosedPath(g, getChamferPath(quaterWidth, 0, halfWidth, height, halfWidth, halfWidth * 0.25));
        g.clip();

        g.fillStyle = "#ffffff";
        g.fillRect(quaterWidth, 0, halfWidth, height);
        g.fillStyle = makeColor(colorMapper(value));
        g.fillRect(quaterWidth, 0, halfWidth, ratio * height);

        linkClosedPath(g, getChamferPath(quaterWidth, 0, halfWidth, height, halfWidth, halfWidth * 0.25));
        g.strokeStyle = "#ffffff";
        g.stroke();

        g.restore();

        for (const valve of valves) {
            const v = valueMapper(valve);
            const ratio = v / maxValue;

            linkClosedPath(g, getChamferPath(0, ratio * height - 2, width, 5, 3, 5));
            g.fillStyle = makeColor(colorMapper(valve));
            g.fill();
            g.strokeStyle = "#ffffff";
            g.stroke();
        }

        g.restore();
    }

    onMount(draw);
    afterUpdate(draw);
</script>

<div class="ValueBar fill overflow-hidden">
    <div class="canvas-wrapper flex-1 fill-x overflow-hidden">
        <canvas class="fill" bind:this={canvas} />
    </div>
    <slot />
</div>

<style>
    .ValueBar {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    .canvas-wrapper {
        flex: 1;
    }

    .canvas-wrapper,
    canvas {
        padding: 0;
        margin: 0;
    }
</style>
