<script>
  import { onMount } from 'svelte';
	import '../app.scss';
  import { redirect } from '@sveltejs/kit';
  import { goto } from '$app/navigation';
	let { children } = $props();

	onMount(() => {
		const credentials = localStorage.getItem("credentials");
		try{
			const token = JSON.parse(credentials).token;
			if (!token) {
				goto('/login');
			}
		} catch (e) {
			goto('/login');
		}
		
	});
</script>

{@render children()}
