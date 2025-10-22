<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label: string = 'Click me';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('svelte-button-click');
  }
</script>

<button 
  class="svelte-button" 
  {disabled} 
  on:click={handleClick}
>
  {label}
</button>

<style>
  .svelte-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #8b5cf6;
    color: white;
  }
  
  .svelte-button:hover {
    background-color: #7c3aed;
  }
  
  .svelte-button:active {
    transform: scale(0.98);
  }
  
  .svelte-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
