<script>
    import Button, { Icon, Label } from "@smui/button";
    import Card, { ActionIcons, Actions, Content } from "@smui/card";

    import api from "$lib/api";
  import OnlineOnly from "./online-only.svelte";

    let syncing = $state(false);

    let localQueueLength = $state(api.getLocalQueue().length);

    function _syncQueue() {
        syncing = true;
        api.syncLocalQueue().finally(() => {
            syncing = false;
            localQueueLength = api.getLocalQueue().length;
        });
    }

</script>


{#if localQueueLength > 0}
    <Card class="my-2">
        <Content>
            <div>
                {localQueueLength} Einträge sind noch nicht hochgeladen.
            </div>
            <div>

            </div>
        </Content>
        <Actions>
            <ActionIcons>
                <OnlineOnly>
                    {#snippet body(online)}
                        <Button variant="raised" onclick={_syncQueue} disabled={!online}>
                            <Icon class="material-icons">sync</Icon>
                            <Label>Werte hochladen</Label>
                        </Button>
                    {/snippet}
                </OnlineOnly>
            </ActionIcons>
        </Actions>
    </Card>
{/if}