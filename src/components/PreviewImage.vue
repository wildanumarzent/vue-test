<template>
  <div>
    <div class="card mt-5" style="width: 20rem">
      <img :src="previewImage" class="card-img-top" alt="..." />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Prewiew-Image',
  props: ['previewImage']
}
</script>
