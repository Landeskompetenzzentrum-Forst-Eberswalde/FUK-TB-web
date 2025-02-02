<script>
    import { onMount } from "svelte";

    let { body } = $props();

    let online = $state(true);
    onMount(() => {
        window.addEventListener('online', () => {
            online = true;
        });
        window.addEventListener('offline', () => {
            online = false;
        });
    });
</script>

{@render body(online)}
{#if !online}
    <br/>
    <caption class="small">Brauche eine Internetverbindung!!</caption>
{/if}