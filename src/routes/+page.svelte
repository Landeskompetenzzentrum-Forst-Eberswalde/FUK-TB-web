<script>
  import { goto } from "$app/navigation";
  import DevicesList from "$lib/devices-list.svelte";
  import Button, { Icon, Label } from "@smui/button";
  import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import { base } from "$app/paths";
  import logo from '$lib/assets/favicon.png';
  import { Graphic } from "@smui/list";
  import { updated } from "$app/state";



  let topAppBar;
  let _devicesList;

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
          <IconButton onclick={_logout} icon="logout" label="Logout" class="material-icons">
            logout
          </IconButton>
          <Graphic class="rounded-full m-0" style="background-image:url('{logo}'); background-size: cover; background-position: center;"></Graphic>
          <Title>Geräte</Title>
        </Section>
        <Section align="end" toolbar>
          <Button onclick={() => _devicesList.updateDevices()} icon="logout" label="Logout">
            <Icon class="material-icons">refresh</Icon>
            <Label>Neu Laden</Label>
          </Button>
        </Section>
    </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
  <DevicesList bind:this={_devicesList} />
</AutoAdjust>