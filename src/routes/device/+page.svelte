<script>
    import { goto } from "$app/navigation";
    import DevicesList from "$lib/devices-list.svelte";
    import Button, { Icon } from "@smui/button";
    import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import List, { Graphic, Item, PrimaryText, SecondaryText, Text } from "@smui/list";
    import api from "$lib/api";
    import { page } from '$app/stores'
    import TelemetryList from "$lib/telemetry-list.svelte";
    import { base } from "$app/paths";
    import AddKeyValue from "$lib/add-key-value.svelte";
    import KeyList from "$lib/key-list.svelte";
    import { dev } from "$app/environment";
    import { onMount } from "svelte";
    import Badge from '@smui-extra/badge';
    import logo from '$lib/assets/favicon.png';
  
  
    let topAppBar = $state(null);
    let deviceId = $page.url.searchParams.get('deviceId');
    let deviceName = $page.url.searchParams.get('deviceName');

    let seletectedKey = $state('');

    let device = $state(null);

    let syncing = $state(false);  
    let localQueueLength = $state(api.getLocalQueue().length);     

    async function _getDevice(){
        try{
            const res = await api.getDeviceByName(deviceName);
            //const res = await api.getDevice(deviceId);
            console.log(res);
            device = res;
            
            return res;
        } catch (e) {
            return e;
        }
    }
  
    function _back() {
        window.history.back();
    }
    function _logout() {
        localStorage.removeItem("credentials");
        goto(`${base}/login`);
    }
    function _syncQueue() {
        syncing = true;
        api.syncLocalQueue().finally(() => {
            syncing = false;
            localQueueLength = api.getLocalQueue().length;
        });
    }

    onMount(() => {
        _getDevice();
    });

    $effect(() => {
        if(localQueueLength > 0) {
            _syncQueue();
        }
    });
  
  </script>



<TopAppBar
      variant="fixed"
      color={'primary'}
      bind:this={topAppBar}
    >
    <Row>
        
        <Section>
            <IconButton onclick={_back} icon="arrow_back" label="Back" class="material-icons">
                arrow_back
            </IconButton>
            <List twoLine>
            <Item>
                {#if device}
                    <Text>
                        <PrimaryText>{deviceName}</PrimaryText>
                        <SecondaryText>{deviceId}</SecondaryText>
                    </Text>
                {/if}
                
            </Item>
        </List>
        </Section>
        
        <Section align="end" toolbar>
            <IconButton icon="logout" label="Logout" class="material-icons relative" onclick={_syncQueue} disabled={syncing || localQueueLength == 0}>
                sync
                {#if localQueueLength > 0}
                    <Badge position="inset" aria-label="unread count" class="bg-red">{localQueueLength}</Badge>
                {/if}
            </IconButton>
        </Section>
    </Row>
</TopAppBar>

<AutoAdjust {topAppBar}>
    {#if device}
        <KeyList deviceId={deviceId} bind:seletectedKey />

        {#if device.label.includes('manually')}
            <div class="h-4"></div>
            <AddKeyValue deviceId={deviceId} bind:key={seletectedKey} bind:queueLength={localQueueLength} />
        {/if}
        <div class="h-4"></div>
        <TelemetryList deviceId={deviceId} key={seletectedKey} bind:queueLength={localQueueLength}  />
    {/if}
</AutoAdjust>
