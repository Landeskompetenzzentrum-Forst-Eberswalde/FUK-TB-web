<script>
    import List, { Item, PrimaryText, SecondaryText, Subheader, Text } from "@smui/list";
    import api from "./api";

    let { deviceId } = $props();

    async function _getTelemetry(){
        const startTs = new Date().getTime() - 1000 * 60 * 60 * 24 * 1000;
        const endTs = new Date().getTime();

        try{
            const res = await api.getTelemetry(deviceId, startTs, endTs);
            console.log(res);
            return res;
        } catch (e) {
            console.error(e);
            return e;
        }
    }
</script>

{#await _getTelemetry() then telemetry}
    
    {#each Object.entries(telemetry) as [key, value]}
        <Subheader>{key}</Subheader>
        {#each value as item}
            <List twoLine dense nonInteractive>
                <Item>
                    <Text>
                        <PrimaryText>{item.value}</PrimaryText>
                        <SecondaryText>{new Date(item.ts).toISOString()}</SecondaryText>
                    </Text>
                </Item>
            </List>
        {/each}
    {/each}
{/await}