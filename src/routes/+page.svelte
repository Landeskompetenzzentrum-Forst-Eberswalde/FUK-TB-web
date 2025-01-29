<script>
  import { goto } from "$app/navigation";
  import DevicesList from "$lib/devices-list.svelte";
  import Button from "@smui/button";
  import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';


  let topAppBar;

  function _logout() {
      localStorage.removeItem("credentials");
      goto('/login');
  }

</script>
<TopAppBar
      variant="fixed"
      color={'primary'}
      bind:this={topAppBar}
    >
    <Row>
        <Section>
            <Title>Geräte</Title>
        </Section>
        <Section align="end" toolbar>
            <IconButton onclick={_logout} icon="logout" label="Logout" class="material-icons">
              logout
            </IconButton>
        </Section>
    </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
  <DevicesList />
</AutoAdjust>