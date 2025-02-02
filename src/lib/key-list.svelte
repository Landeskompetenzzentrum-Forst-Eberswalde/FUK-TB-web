<script>
    import { Subheader } from "@smui/list";
    import api from "./api";
    import Chip, { Set, Text } from "@smui/chips";

    let { deviceId, seletectedKey = $bindable() } = $props();

    async function _getTelemetry(){
        const startTs = new Date().getTime() - 1000 * 60 * 60 * 24 * 1000;
        const endTs = new Date().getTime();

        try{
            const res = await api.getKeys(deviceId, startTs, endTs);
            return res;
        } catch (e) {
            console.error(e);
            return e;
        }
    }
</script>
<Subheader>1. Auswahl</Subheader>
{#await api.getKeys(deviceId) then keys}
    <Set chips={keys} choice={true} bind:selected={seletectedKey}>
        {#snippet chip(chip)}
            <Chip {chip} touch>
                <Text>{chip}</Text>
            </Chip>
        {/snippet}
    </Set>
{/await}