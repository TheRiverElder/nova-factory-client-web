<script lang="ts" context="module">
    export type DataSource = Array<Array<number>>;
    export type Point = [number, number];
</script>

<script lang="ts">
    import { beforeUpdate } from "svelte";
    import { isRegularNumber } from "../utils/math";
    import { shortenNumber } from "../utils/numebr-display";

    export let data: DataSource | null;
    export let lineCount: number = 1;
    export let minRange: number = 0;
    export let width: number;
    export let height: number;
    export let min: number = Number.NEGATIVE_INFINITY;
    export let max: number = Number.POSITIVE_INFINITY;
    export let padding: number = 0;
    export let lineColors: Array<string> = [];

    let valueTextWidth = 30;
    let labelTextHeight = 20;

    const offsetX = (x: number, dx: number) => x + dx;
    const offsetY = (y: number, dy: number) => y - dy;
    const chartX = (x: number) => x;
    const chartY = (y: number) => height - y;
    const lineX = (xRatio: number) => chartX(valueTextWidth + padding + (width - valueTextWidth - 2 * padding) * xRatio);
    const lineY = (yRatio: number) => chartY(labelTextHeight + padding + (height - labelTextHeight - 2 * padding) * yRatio);

    let axisPoints: [Point, Point, Point];
    let pointsList: Array<Array<Point>> = [];
    let pillerTopList: Array<Point> = [];
    let pathList: Array<string> = [];
    let valueTextInfo: [Point, Point, Point] = [
        [0, 0],
        [0, 0],
        [0, 0],
    ];
    let verticalGridXList: Array<number> = [];
    let horizontalGridYList: Array<number> = [];

    beforeUpdate(() => updateGraphParams());

    function updateGraphParams() {
        axisPoints = [
            [lineX(0), lineY(0)],
            [lineX(0), lineY(1)],
            [lineX(1), lineY(0)],
        ];
        if (!data) return;

        if (data && data.length > 0) {
            const rc = data.length;

            const valuesList = data.map((rec) => rec.slice(1, 1 + lineCount));
            const maxValue = Math.max(...valuesList.map((values) => Math.max(...values)));
            const minValue = Math.min(...valuesList.map((values) => Math.min(...values)));
            const midValue = (maxValue + minValue) / 2;

            let rangeMid = 0;
            let halfRange = 0;
            let rangeMax = 0;
            let rangeMin = 0;
            let range = 0;
            if (isRegularNumber(min)) {
                rangeMin = min;
                if (isRegularNumber(max)) {
                    rangeMax = max || minRange;
                    range = Math.max(0, rangeMax - rangeMin);
                    halfRange = range / 2;
                    rangeMid = rangeMin + halfRange;
                } else {
                    halfRange = (midValue - rangeMin) * 1.2 || minRange / 2;
                    rangeMid = rangeMin + halfRange;
                    rangeMax = rangeMid + halfRange;
                    range = Math.max(0, rangeMax - rangeMin);
                }
            } else if (isRegularNumber(max)) {
                rangeMax = max || minRange;
                halfRange = (rangeMax - midValue) * 1.2;
                rangeMid = rangeMax - halfRange;
                rangeMin = rangeMid - halfRange;
                range = Math.max(0, rangeMax - rangeMin);
            } else {
                rangeMid = midValue || minRange / 2;
                halfRange = Math.max(minRange, (maxValue - minValue) * 1.2) / 2;
                rangeMax = midValue + halfRange;
                rangeMin = midValue - halfRange;
                range = rangeMax - rangeMin;
            }
            // console.table({ maxValue, minValue, midValue, range, rangeMax, rangeMin });

            pointsList = [];
            for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
                const points: Array<Point> = [];
                for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
                    const x: number = lineX((dataIndex + 0.5) / rc);
                    const y: number = lineY((data[dataIndex][1 + lineIndex] - rangeMin) / range);
                    points.push([x, y]);
                }
                pointsList.push(points);
            }

            pathList = pointsList.map((points) => points.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" "));

            pillerTopList = [];
            for (let i = 0; i < pointsList[0].length; i++) {
                const x: number = pointsList[0][i][0];
                const y: number = Math.max(...pointsList.map((points) => points[i][1]));
                pillerTopList.push([x, y]);
            }

            const verticalGridCount = 12;
            const horizontalGridCount = 12;
            verticalGridXList = Array(Math.floor(verticalGridCount))
                .fill(0)
                .map((_, i) => lineX((i + 1) / verticalGridCount));
            horizontalGridYList = Array(Math.floor(horizontalGridCount))
                .fill(0)
                .map((_, i) => lineY((i + 1) / horizontalGridCount));

            valueTextInfo = [
                [0.0, rangeMin],
                [0.5, rangeMid],
                [1.0, rangeMax],
            ];
        } else {
            pointsList = [];
            pathList = [];
            pillerTopList = [];
            valueTextInfo = [
                [0, 0],
                [0, 0],
                [0, 0],
            ];
        }
    }
</script>

<div class="Chart">
    <svg class="fill" {width} {height}>
        <!-- 网格 -->
        {#each verticalGridXList as x}
            <line x1={x} y1={lineY(0)} x2={x} y2={lineY(1)} stroke="#ffffff1f" />
        {/each}
        {#each horizontalGridYList as y}
            <line x1={lineX(0)} y1={y} x2={lineX(1)} y2={y} stroke="#ffffff1f" />
        {/each}

        <!-- 数据点垂线 -->
        {#each pillerTopList as [x, y]}
            <line x1={x} y1={lineY(0)} x2={x} y2={y} stroke="#ffffff7f" />
        {/each}

        <!-- 折线 -->
        {#each pathList as path, lineIndex}
            <path x={0} y={0} d={path} stroke={lineColors[lineIndex] || "#ffff00"} fill="transparent" stroke-width={2} />
        {/each}

        <!-- 数据点与横坐标 -->
        {#each pointsList as points, lineIndex}
            {#each points as [x, y], xIndex}
                <circle cx={x} cy={y} r={2} fill={lineColors[lineIndex] || "#ffff00"} />
                <text {x} y={offsetY(y, lineIndex % 2 ? +5 : -15)} fill="#ffffff">{shortenNumber(data[xIndex][1 + lineIndex])}</text>
                <text {x} y={offsetY(lineY(0), -10)} fill="#ffffff">{data[xIndex][0]}</text>
            {/each}
        {/each}

        <!-- 坐标轴 -->
        <line x1={axisPoints[0][0]} y1={axisPoints[0][1]} x2={axisPoints[1][0]} y2={axisPoints[1][1]} stroke="#ffffff" />
        <line x1={axisPoints[0][0]} y1={axisPoints[0][1]} x2={axisPoints[2][0]} y2={axisPoints[2][1]} stroke="#ffffff" />

        <!-- 纵坐标 -->
        {#each valueTextInfo as [ratio, value]}
            <text x={offsetX(lineX(0), -5)} y={lineY(ratio)} fill="#ffffff">{value.toFixed(2)}</text>
        {/each}
    </svg>
</div>

<style>
    .Chart {
        font-size: 0.3em;
        color: #ffffff;
    }

    svg text {
        text-anchor: middle;
    }
</style>
