<script>
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();
</script>

<svelte:head>
	{#if pwaInfo?.webManifest?.linkTag}
		{@html pwaInfo.webManifest.linkTag}
	{/if}
</svelte:head>

{@render children()}