<script lang="ts">
	import { onDestroy, onMount, setContext } from "svelte";
	import { Fission } from "./background";
	import { Connection } from "./game/Connection";
	import { KEY_APPEND_MESSAGE, KEY_GET_CONNECTION } from "./context";
	import MainPage from "./pages/MainPage.svelte";
	import { GameConnection } from "./game/GameConnection";

	let backgroundController: Fission;
	let backgroundCanvas: HTMLCanvasElement;

	const connection = new Connection(`ws://${window.location.hostname}:8989/`);
	const gameConn = new GameConnection(connection);
	const onDestroyhandler = () => {
		connection.close();
		backgroundController = null;
	};

	setContext(KEY_GET_CONNECTION, () => gameConn);

	onMount(setupBackground);
	onDestroy(onDestroyhandler);

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

	let messages: Array<string> = [];

	function appendMessage(message: string) {
		messages.unshift(message);
		messages = messages;
		setTimeout(() => {
			messages.pop();
			messages = messages;
		}, 5000);
	}
	setContext(KEY_APPEND_MESSAGE, appendMessage);
</script>

<div class="fill App">
	<canvas class="fill" bind:this={backgroundCanvas} />

	<div class="fill content">
		<MainPage />
	</div>

	<div class="fill message-layer">
		{#each messages as message}
			<div class="message">
				<span>{message}</span>
			</div>
		{/each}
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
	div.message-layer,
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

	div.message-layer {
		padding: 2em;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		pointer-events: none;
	}

	.message {
		min-width: 10em;
		width: 20%;
		padding: 1em;
		margin: 1em;
		color: #ffff00;
		background-color: #0000007f;
	}
</style>
