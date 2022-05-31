<script lang="ts">
    import type { ReactorBrief } from "../data/Factory";

    export let brief: ReactorBrief;
</script>

<div>
    <div>
        <div>
            "index": {brief.index}
            "size": {brief.size}
            "running": {brief.running}
            "temperature": {brief.temperature}
        </div>
        <div>Enter</div>
    </div>
    <div>temperatureGraph</div>
</div>
