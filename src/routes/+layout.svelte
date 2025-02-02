<script>
	import { onMount } from 'svelte';
	import '../app.scss';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();
	
	onMount(() => {
		const credentials = localStorage.getItem("credentials");
		try{
			const token = JSON.parse(credentials).token;
			if (!token) {
				goto(`${base}/login`);
			}
		} catch (e) {
			goto(`${base}/login`);
		}
		
	});

	// https://vite-pwa-org.netlify.app/frameworks/sveltekit
	let webManifestLink = $state('');
	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register')
			registerSW({
				immediate: true,
				onRegistered(r) {
				// uncomment following code if you want check for updates
				// r && setInterval(() => {
				//    console.log('Checking for sw update')
				//    r.update()
				// }, 20000 /* 20s for testing purposes */)
				console.log(`SW Registered: ${r}`)
				},
				onRegisterError(error) {
					console.log('SW registration error', error)
				}
			})
		}
	});

	$effect(() => {
		webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
	});
</script>

<svelte:head> 
 	{@html webManifestLink} 
</svelte:head>

{@render children()}
