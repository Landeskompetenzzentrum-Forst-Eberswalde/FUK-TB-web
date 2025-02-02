<script>
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import Chip, { Set, Text as ChipText } from '@smui/chips';

    import api from "./api";
    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';
    import { onMount } from "svelte";

    let activeFilter = $state([]);
    let filters = $state([]);

    let allDevices = $state([]);
    let filteredDevices = $derived(_filterDevices());

    function _filterDevices(){
        if(activeFilter.length === 0) return allDevices;
        const filtered =  allDevices.filter(device => {
            return activeFilter.find(filter => {
                return device.label.includes(filter);
            });
        });
        
        return filtered;
    }
    async function _getDevices(){
        try{
            const res = await api.getDevices();
            let newFilters = [];

            //add filters from devices labels
            for(let device of res) {
                const words = device.label.split(' ').filter(n => n && n!='');
                newFilters = [...newFilters, ...words];
            }
            
            //remove duplicates
            filters = newFilters.filter((v, i, a) => a.indexOf(v) === i);
            
            allDevices = res;
            console.log('refreshed');
        } catch (e) {
            console.log('error', e);
            return e;
        }
    }
    export function updateDevices(){
        _getDevices();
    }
    onMount(() => {
        _getDevices();
    })

</script>

<Set chips={filters} filter={true} bind:selected={activeFilter} >
    {#snippet chip(chip)}
      <Chip {chip} touch>
        <ChipText>{chip}</ChipText>
      </Chip>
    {/snippet}
</Set>

<List twoLine>
    {#each filteredDevices as device}
        <Item onSMUIAction={() => goto(`${base}/device?deviceId=${device.id.id}&deviceName=${device.name}`)}>
            <Text>
                <PrimaryText>{device.name}</PrimaryText>
                <SecondaryText>{device.additionalInfo.description}</SecondaryText>
            </Text>
        </Item>
    {/each}
</List>