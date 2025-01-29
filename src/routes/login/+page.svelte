<script>
    import Card, {
        Content,
        PrimaryAction,
        Actions,
        ActionButtons,
        ActionIcons
    } from '@smui/card';
    import Button, { Icon, Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import CircularProgress from '@smui/circular-progress';
    import api from '$lib/api';
    import { goto } from '$app/navigation';
    import Snackbar, { Label as SnackbarLabel } from '@smui/snackbar';

    let email = $state(null);
    let password = $state(null);
    let loading = $state(false);
    let snackbar;
    let snackbarText = $state('Error');

    async function _login() {
        loading = true;
        try{
            const res = await api.login(email, password);
            if(res.token){
                localStorage.setItem("credentials", JSON.stringify(res));
                goto('/');
            }else{
                console.log(res);
                snackbarText = res.message;
                snackbar.open()
            }
            
            
        } catch (e) {
            snackbarText = e;
            snackbar.open()
            console.log(e);
        }
        loading = false;
    }
</script>

<div class="h-screen flex items-center justify-center">
    <Content class="flex flex-col">
        <Textfield variant="standard" bind:value={email} class="mb-4" input$autocomplete="email" type="email"></Textfield>
        <Textfield bind:value={password} type="password" class="mb-4"></Textfield>
        <Button onclick={_login} variant="raised" color="primary" disabled={loading}>
            {#if loading}
                <Icon>
                    <CircularProgress style="height: 20px; width: 20px;" indeterminate />
                </Icon>
            {/if}
            <Label>Anmelden</Label>
        </Button>
    </Content>
</div>

<Snackbar bind:this={snackbar}>
    <SnackbarLabel>{snackbarText}</SnackbarLabel>
</Snackbar>