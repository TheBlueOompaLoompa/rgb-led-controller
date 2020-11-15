<script>
	import { updateSetting, getSettings } from './requester';
	import { generateGradient } from './patterns';
	import { int2Rgb, rgb2hex } from './rgb';

	let settings = {on: false, mode: 0, color: [{r: 0, g: 0, b: 0}], speed: 30, gradient: 0, brightness: 255, loops: 1};

	let color = "";

	let selected;

	settings = getSettings();

	settings.mode = settings.mode.toString();

	console.log(settings);

	try {
		color = rgb2Hex(settings.color[0].r, settings.color[0].g, settings.color[0].b);
	} catch (error) {
		color = "#000000";
	}
</script>

<svelte:head>
	<title>Poop On You</title>
</svelte:head>

<label for="onoff">Lights: </label>
<label class="switch">
	<input type="checkbox" name="onoff" bind:checked={settings.on} on:change={ () => { console.log(settings.on); updateSetting("on", settings.on) }}>
	<span class="slider round"></span>
</label>
<br><br>
<label for="speedtext">Speed: </label>
<!--<input type="number" name="speedtext" id="speedtext" bind:value={settings.speed} on:change={ () => { updateSetting("speed", parseInt(settings.speed, 10));} }>-->
<input type="range" name="speed" id="speed" bind:value={ settings.speed } on:change={ () => { updateSetting("speed", parseInt(settings.speed, 10));} }>

<label for="brightness">Brightness</label>
<input type="range" name="brightness" id="brightness" bind:value={ settings.brightness } on:change={ () => { updateSetting("brightness", parseInt(settings.brightness, 10));} }>

<label for="mode">Mode: </label>
<!-- svelte-ignore a11y-no-onchange -->
<select name="mode" id="mode" bind:value={ settings.mode } on:change={ () => { 
	updateSetting("mode", parseInt(settings.mode, 10)); 
	if(settings.mode == 2 || settings.mode == 3) { 
		settings.color = generateGradient(settings.gradient); 
		updateSetting("color", settings.color); 
	} 
}}>
	<option value=0>Solid &#x2B1B;</option>
	<option value=1>Rainbow &#x1F308;</option>
	<option value=2>Gradient &#x1F36D;</option>
	<option value=3>Wave Gradient &#x1F30A;</option>
	<option value=4>In & Out Fading ↔️</option>
</select>

{#if settings.mode == 0}
	<label for="color">Color: </label>
	<input type="color" name="color" id="color" bind:value={color} on:change={() => { 
		settings.color = [int2Rgb(parseInt(color.replace('#', ''), 16))];
		console.log(color);
		updateSetting("color", settings.color); 
	} }>
{:else if settings.mode >= 2 && settings.mode <= 4}
	<br>
	<label for="gradient">Pattern: </label>
	<!-- svelte-ignore a11y-no-onchange -->
	<select name="gradient" id="gradient" bind:value={settings.gradient} on:change={ () => {settings.color = generateGradient(settings.gradient); updateSetting("color", settings.color); updateSetting("gradient", settings.gradient)} }>
		<option value=0>Christmas &#x1F384;</option>
		<option value=1>Thanksgiving &#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467;</option>
		<option value=2>Easter &#x1F95A;</option>
		<option value=3>Halloween &#x1F383;</option>
		<option value=4>Mom's Favorite &#x1F49C;&#x1F499;</option>
	</select>
{/if}

{#if settings.mode >= 1 && settings.mode <= 3}
	<label for="loops">Loops &#x1F504;: </label>
	<input type="number" min=1 name="loops" bind:value={ settings.loops } on:change={ () => { updateSetting("loops", parseInt(settings.loops, 10)); } }>
{/if}

<style>
	:global(body) {
		background-color: rgb(17, 17, 17);
		color: white;
	}

	input#speed {
		background-color: white;
	}
	
	/* Switch */

	.switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
	}

	.switch input { 
	opacity: 0;
	width: 0;
	height: 0;
	}

	.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	-webkit-transition: .4s;
	transition: .4s;
	}

	.slider:before {
	position: absolute;
	content: "";
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	-webkit-transition: .4s;
	transition: .4s;
	}

	input:checked + .slider {
	background-color: #2196F3;
	}

	input:focus + .slider {
	box-shadow: 0 0 1px #2196F3;
	}

	input:checked + .slider:before {
	-webkit-transform: translateX(26px);
	-ms-transform: translateX(26px);
	transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
	border-radius: 34px;
	}

	.slider.round:before {
	border-radius: 50%;
	}
</style>