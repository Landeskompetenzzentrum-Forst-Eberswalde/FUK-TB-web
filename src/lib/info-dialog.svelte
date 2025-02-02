<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Button, { Label } from '@smui/button';
    let { title, children, isOpen = $bindable() } = $props();
</script>

<Dialog bind:open={isOpen}>
    <Title>{title}</Title>
    <Content>
        {@render children()}
    </Content>
</Dialog>