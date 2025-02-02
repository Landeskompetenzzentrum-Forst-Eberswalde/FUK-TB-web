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
        Subheader,
        Group,
        Separator,
    } from '@smui/list';
    import { onMount } from "svelte";
  import Card, { Content, PrimaryAction } from "@smui/card";
  import { Icon } from "@smui/common";

    let activeFilter = $state([]);
    let filters = $state([]);

    let allDevices = $state([]);
    let filteredDevices = $derived(_filterDevices());

    let grouped = $state({});

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

            // Group res devices list by newFilters unique
            grouped = res.reduce((acc, device) => {
                const words = device.label.split(' ').filter(n => n && n!='');
                let key = words.find(word => newFilters.includes(word));
                if(!key) key = '';
                if(!acc[key]) acc[key] = [];
                acc[key].push(device);
                return acc;
            }, {});

            
            //remove duplicates
            filters = newFilters.filter((v, i, a) => a.indexOf(v) === i);
            
            allDevices = res;
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
<!--
<Set chips={filters} filter={true} bind:selected={activeFilter} >
    {#snippet chip(chip)}
      <Chip {chip} touch>
        <ChipText>{chip}</ChipText>
      </Chip>
    {/snippet}
</Set>
-->


<Subheader class="font-bold">Manuelle Eingabe (lesen und schreiben)</Subheader>
{#each grouped['manually'] as device}
    <Card class="m-2">
        <PrimaryAction onclick={() => goto(`${base}/device?deviceId=${device.id.id}&deviceName=${device.name}`)}>
            <Content>
                <Text>
                    <PrimaryText>{device.name}</PrimaryText>
                    <SecondaryText>{device.additionalInfo.description}</SecondaryText>
                </Text>
            </Content>
        </PrimaryAction>
    </Card>
{/each}

<Group class="mt-9">
    <List twoLine dense>
        <Subheader class="font-bold">Andere (nur lesbar)</Subheader>
        <Separator />
        {#each grouped[''] as device}
            <Item onSMUIAction={() => goto(`${base}/device?deviceId=${device.id.id}&deviceName=${device.name}`)}>
                <Text>
                    <PrimaryText>{device.name}</PrimaryText>
                    <SecondaryText>{device.additionalInfo.description}</SecondaryText>
                </Text>
                <Meta>
                    <Icon class="material-icons">visibility</Icon>
                </Meta>
            </Item>
        {/each}
    </List>
</Group>

<Group class="mt-4">
    <List twoLine dense>
        <Subheader class="font-bold">Entwickler Geräte</Subheader>
        <Separator />
        {#each grouped['development'] as device}
            <Item onSMUIAction={() => goto(`${base}/device?deviceId=${device.id.id}&deviceName=${device.name}`)}>
                <Text>
                    <PrimaryText>{device.name}</PrimaryText>
                    <SecondaryText>{device.additionalInfo.description}</SecondaryText>
                </Text>
                <Meta>
                    <Icon class="material-icons">developer_mode</Icon>
                </Meta>
            </Item>
        {/each}
    </List>
</Group>