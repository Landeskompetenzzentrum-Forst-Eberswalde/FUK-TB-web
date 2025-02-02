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
  import InfoDialog from "$lib/info-dialog.svelte";
  import SyncInfoCard from "$lib/sync-info-card.svelte";


  let topAppBar = $state(null);
  let _devicesList;
  let _infoOpen = $state(false);

  function _logout(e) {
    e.preventDefault();
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
          <Graphic class="rounded-full mx-2" style="background-image:url('{logo}'); background-size: cover; background-position: center;" onclick={() => _infoOpen = true}></Graphic>
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
  <SyncInfoCard />
  <DevicesList bind:this={_devicesList} />
</AutoAdjust>

<InfoDialog bind:isOpen={_infoOpen} title="Landesbetrieb Forst Brandenburg" text="Hier können Sie Ihre Geräte verwalten.">
  {#snippet children()}
    <Button>
      <Icon class="material-icons" onclick={_logout}>logout</Icon>
      <Label>Abmelden</Label>
    </Button>
  {/snippet}
</InfoDialog>