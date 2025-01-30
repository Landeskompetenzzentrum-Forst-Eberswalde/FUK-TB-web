<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import api from "./api";
  import List, {
    Item,
    Graphic,
    Meta,
    Text,
    PrimaryText,
    SecondaryText,
  } from '@smui/list';


    async function _getDevices(){
        try{
            const res = await api.getDevices();
            console.log(res);
            return res;
        } catch (e) {
            return e;
        }
    }

</script>


{#await _getDevices()}
    Loading
{:then devices} 
    <List>
        {#each devices as device}
            <Item onSMUIAction={() => goto(`${base}/device?deviceId=${device.id.id}&deviceName=${device.name}`)}>
                {device.name}
            </Item>
        {/each}
    </List>
{:catch error}
    <div>{error}</div>
{/await}