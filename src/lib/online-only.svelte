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

{#if online}
    {@render body()}
{:else}
    <div class="flex justify-center items-center h-full">
        <h1 class="text-2xl">Brauche eine Internetverbindung!!</h1>
    </div>
{/if}