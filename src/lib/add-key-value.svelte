<script>
    import Button, { Icon, Label } from "@smui/button";
    import Card, { ActionIcons, Content } from "@smui/card";
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import { onMount } from "svelte";
    import { on } from "svelte/events";
    import api from "./api";
  import { Subheader } from "@smui/list";

    let { deviceId, key, queueLength = $bindable(), isDevelopment =false } = $props();
    let entryValue = $state(null);
    let entryKey = $state(null);
    let readOnly = $derived(key ? true : (!isDevelopment ? true : false));

    let existingKeys = $state([]);

    function _isValid(){
        let valid = true;
        if(entryValue && entryKey && entryKey.length > 3 && entryValue.length > 0){
            valid = false;
        }
        return valid;
    }
    async function _addKeyValueTolocalQueue(){
        try{
            await api.addKeyValueTolocalQueue(deviceId, entryKey, entryValue).finally(() => {
                entryKey = null;
                entryValue = null;
            });
            
        } catch (e) {
            console.error(e);
        }
        queueLength = api.getLocalQueue().length;
    }

    $effect(() => {
        if(key){
            entryKey = key;
        }
    });
</script>

<Subheader>2. Neuen Wert eingeben</Subheader>
<Card class="mx-2 p-2">
    <Content>
        <div class="flex flex-col">
            {#if isDevelopment}
                <Textfield label="Name des Attributs" bind:value={entryKey} disabled={readOnly}>
                    {#snippet helper()}
                        <HelperText persistent>Name des Attributes ohne Leerzeichen</HelperText>
                    {/snippet}
                </Textfield>
                <div class="h-4"></div>
            {/if}
            <Textfield label="Wert" bind:value={entryValue}>
                {#snippet helper()}
                    <HelperText persistent>Wert in Zahlen</HelperText>
                {/snippet}
            </Textfield>
            <div class="h-4"></div>
        </div>
    </Content>
    <ActionIcons>
        <Button variant="raised" onclick={_addKeyValueTolocalQueue} disabled={_isValid(entryKey, entryValue)}>
            <Icon class="material-icons">add</Icon>
            <Label>Hinzufügen</Label>
        </Button>
    </ActionIcons>
</Card>