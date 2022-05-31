<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { makeColor } from "../graphics/utils";

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
        const halfWidth = width / 2;
        const quaterWidth = width / 4;

        g.clearRect(0, 0, width, height);

        g.save();

        g.translate(halfWidth, height);
        g.scale(1, -1);

        const v = valueMapper(value);
        const ratio = v / maxValue;

        g.fillStyle = "#ffffff";
        g.fillRect(-quaterWidth, 0, halfWidth, height);
        g.fillStyle = makeColor(colorMapper(value));
        g.fillRect(-quaterWidth, 0, halfWidth, ratio * height);

        for (const valve of valves) {
            const v = valueMapper(valve);
            const ratio = v / maxValue;
            g.fillStyle = makeColor(colorMapper(valve));
            g.fillRect(-halfWidth, ratio * height, width, 5);
        }

        g.restore();
    }

    onMount(draw);
    afterUpdate(draw);
</script>

<div>
    <canvas bind:this={canvas} width="50" height="300" />
</div>
