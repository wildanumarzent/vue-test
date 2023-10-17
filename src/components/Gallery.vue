<template>
  <div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 px-5">
      <template v-for="(image, index) in listImage" :key="index">
        <div>
          <img
            class="h-auto max-w-full rounded-lg"
            :src="image.data.data.display_url"
            :alt="image.data.data.title"
          />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'gallery-image',
  props: ['listImage']
}
</script>
