<script>
    import List, { Item, Meta, PrimaryText, SecondaryText, Separator, Subheader, Text } from "@smui/list";
    import api from "./api";
    import Button from "@smui/button";
    import Card, { Content } from "@smui/card";
    import * as timeago from 'timeago.js';
  import CircularProgress from "@smui/circular-progress";
  import IconButton from "@smui/icon-button";

    let { deviceId, key, queueLength } = $props();

    let telemetry = $state([]);
    let loading = $state(false);

    async function _getTelemetry(){
        
        if(!key) return [];
        if(!deviceId) return [];
        loading = true;

        const startTs = new Date().getTime() - 1000 * 60 * 60 * 24 * 1000;
        const endTs = new Date().getTime();
        try{
            const res = await api.getTelemetry(deviceId, startTs, endTs, key);

            telemetry = res;
        } catch (e) {
            console.error(e);
            return e;
        }
        loading = false;
    }

    $effect(() => {
        _getTelemetry(queueLength);
    });
</script>
{#if loading}
    <CircularProgress style="height: 20px; width: 20px;" indeterminate   />
{:else if telemetry.length==0}
    <div class="flex items-center justify-center">
        <Subheader>
            Keine Daten
        </Subheader>
    </div>
{:else}
    {#each Object.entries(telemetry) as [key, value]}
        <List nonInteractive>
            <Item>
                <Text>
                    <PrimaryText>{key}</PrimaryText>
                    <SecondaryText>letzte {value.length} Einträge</SecondaryText>
                </Text>
                <Meta>
                    <IconButton class="material-icons" onclick={_getTelemetry}>refresh</IconButton>
                </Meta>
            </Item>
        </List>
        <Card class="mx-2 mb-4 p-2">
            <Content>
                {#each value as item}
                    <List twoLine dense nonInteractive>
                        <Item>
                            <Text>
                                <PrimaryText>{item.value}</PrimaryText>
                                <SecondaryText>{timeago.format(item.ts)}</SecondaryText>
                            </Text>
                        </Item>
                    </List>
                {/each}
            </Content>
        </Card>
    {/each}
{/if}
