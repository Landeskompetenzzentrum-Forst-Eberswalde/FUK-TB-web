<script>
  import { onMount } from 'svelte';
	import '../app.scss';
  import { redirect } from '@sveltejs/kit';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
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
</script>

{@render children()}
