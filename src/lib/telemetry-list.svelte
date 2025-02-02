<script>
    import List, { Item, Meta, PrimaryText, SecondaryText, Separator, Subheader, Text } from "@smui/list";
    import api from "./api";
    import Button, { Icon } from "@smui/button";
    import Card, { Content } from "@smui/card";
    import * as timeago from 'timeago.js';
    import CircularProgress from "@smui/circular-progress";
    import IconButton from "@smui/icon-button";

    let { deviceId, key, queueLength } = $props();

    let telemetry = $state([]);
    let localTelemetry = $state([]);
    let loading = $state(false);

    async function _getLocalQueue(){
        const notSyncedTelemetry = api.getLocalQueue();
        localTelemetry = notSyncedTelemetry.filter(item => item.deviceId === deviceId && item.values.values[key]);
    }

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
        } finally {
            _getLocalQueue();
            loading = false;
        }
    }

    $effect(() => {
        _getTelemetry(queueLength);
    });
</script>
{#if loading}
    <CircularProgress style="height: 20px; width: 20px;" indeterminate   />
{:else if telemetry.length==0 && key}
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
                {#if localTelemetry.length > 0}
                    {#each localTelemetry as item}
                        <List twoLine dense nonInteractive>
                            <Item>
                                <Text>
                                    <PrimaryText>{item.values.values[key]}</PrimaryText>
                                    <SecondaryText>{timeago.format(item.values.ts)}</SecondaryText>
                                </Text>
                                <Meta>
                                    <Icon class="material-icons" color="primary">hourglass_top</Icon>
                                </Meta>
                            </Item>
                        </List>
                    {/each}
                {/if}
                {#each value as item}
                    <List twoLine dense nonInteractive>
                        <Item>
                            <Text>
                                <PrimaryText>{item.value}</PrimaryText>
                                <SecondaryText>{timeago.format(item.ts)}</SecondaryText>
                            </Text>
                            <Meta>
                                <Icon class="material-icons" color="primary">check</Icon>
                            </Meta>
                        </Item>
                    </List>
                {/each}
            </Content>
        </Card>
    {/each}
{/if}
