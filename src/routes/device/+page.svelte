<script>
    import { goto } from "$app/navigation";
    import DevicesList from "$lib/devices-list.svelte";
    import Button from "@smui/button";
    import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import List, { Graphic, Item, PrimaryText, SecondaryText, Text } from "@smui/list";
    import api from "$lib/api";
    import { page } from '$app/stores'
  import TelemetryList from "$lib/telemetry-list.svelte";
  import { beforeUpdate } from "svelte";
  import { base } from "$app/paths";
  
  
    let topAppBar;
    let deviceId = $page.url.searchParams.get('deviceId');
    let deviceName = $page.url.searchParams.get('deviceName');

    /*beforeUpdate(() => {
        deviceId =  url.searchParams.get('deviceId');
        deviceName = url.searchParams.get('deviceName');
    });*/

    async function _getDevice(){
        try{
            const res = await api.getDeviceByName(deviceName);
            //const res = await api.getDevice(deviceId);
            console.log(res);
            
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
                {#await _getDevice() then device}
                    <Text>
                        <PrimaryText>{deviceName}</PrimaryText>
                        <SecondaryText>{deviceId}</SecondaryText>
                    </Text>
                {/await}
                
            </Item>
        </List>
        </Section>
        
        <Section align="end" toolbar>
            <IconButton onclick={_logout} icon="logout" label="Logout" class="material-icons">
              logout
            </IconButton>
        </Section>
    </Row>
</TopAppBar>

<AutoAdjust {topAppBar}>
  <TelemetryList deviceId={deviceId} />
</AutoAdjust>