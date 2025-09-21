<script>
  import { onMount } from 'svelte';

  export let message = '';
  export let type = 'info';

  let visible = false;
  let frame;

  onMount(() => {
    frame = requestAnimationFrame(() => {
      visible = true;
    });

    return () => cancelAnimationFrame(frame);
  });
</script>

<div class={`toast ${type} ${visible ? 'show' : ''}`}>
  {message}
</div>
