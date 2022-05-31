<script lang="ts">
	import { onDestroy, onMount, setContext } from "svelte";
	import { Fission } from "./background";
	import { Connection } from "./game/Connection";
	import { KEY_GET_CONNECTION } from "./context";
	import type { Factory } from "./data/Factory";
	import type { Reactor } from "./data/Reactor";
	import { createGenericMessageHandler } from "./game/GenericMessageHandler";
	import MainPage from "./pages/MainPage.svelte";

	let factory: Factory = null;
	let reactor: Reactor = null;

	const onMessage = createGenericMessageHandler({
		onReceiveFactory: (f) => (factory = f),
		onReceiveReactor: (r) => (reactor = r),
	});
	const connection = new Connection(`ws://${window.location.hostname}:8989/`);
	connection.onMessageHandlers.add(onMessage);
	const onDestroyhandler = () => {
		connection.onMessageHandlers.delete(onMessage);
		connection.close();
		backgroundController = null;
	};
	connection.send({
		clientId: -1,
		head: "request",
		args: {
			requestList: [{ id: "factory_info" }, { id: "reactor_info", index: 0 }],
		},
	});

	setContext(KEY_GET_CONNECTION, () => connection);

	onMount(setupBackground);
	onDestroy(onDestroyhandler);

	let backgroundController: Fission;
	let backgroundCanvas: HTMLCanvasElement;

	function setupBackground() {
		const { width, height } = backgroundCanvas.getBoundingClientRect();
		backgroundCanvas.width = width;
		backgroundCanvas.height = height;
		backgroundController = new Fission(width, height, 8, 50);
		backgroundController.initializeModel(Math.min(Math.floor((width * height) / 10000), 200));

		let prevTime = Date.now();
		function animate() {
			if (backgroundCanvas && backgroundController) {
				const now = Date.now();
				backgroundController.tick(now - prevTime, now);
				backgroundController.render(backgroundCanvas, Date.now());
				prevTime = now;
				requestAnimationFrame(animate);
			}
		}
		animate();
	}
</script>

<div class="fill App">
	<canvas class="fill" bind:this={backgroundCanvas} />

	<div class="fill content">
		<MainPage {factory} {reactor} index={0} />
	</div>
</div>

<style>
	div.App {
		background-color: #070a0e;
		overflow: hidden;
		color: #ffffff;
		position: relative;
	}

	div.content,
	canvas {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	canvas {
		opacity: 0.5;
	}
</style>
