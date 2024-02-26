<template>
<div class="card mb-3 h-100" style="border: none;">
  <div class="card-header" style="background-color: #a9abad; color: #fff;">{{ header }}</div>
  <div class="card-body" style="background-color: #e1e1e1;">
    <slot name="body"></slot>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item" style="background-color: #e1e1e1;">
        <div class="row">
            <div class="col"><slot name="requisitante"></slot></div>
            <div class="col"><slot name="designado"></slot></div>
        </div>
    </li>
  </ul>
</div>
</template>

<script>
export default {
    props: {
        header: {
            type: String,
            required: true,
            default: 'Colocar ID.'
        }
    }
}
</script>