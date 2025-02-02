<script>
    import Button, { Icon, Label } from "@smui/button";
    import Card, { ActionIcons, Actions, Content } from "@smui/card";

    import api from "$lib/api";

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
    <Card>
        <Content>
            <div>
                {localQueueLength} Einträge noch nicht hochgeladen.
            </div>
            <div>

            </div>
        </Content>
        <Actions>
            <ActionIcons>
                <Button variant="raised" onclick={_syncQueue}>
                    <Icon class="material-icons">sync</Icon>
                    <Label>Werte hochladen</Label>
                </Button>
            </ActionIcons>
        </Actions>
    </Card>
{/if}