<template>
  <section
    class="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]"
  >
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
      <a
        href="#"
        class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
      >
        <span class="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
        <span class="text-sm font-medium">Media file upload</span>
        <svg
          class="w-2.5 h-2.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
      </a>
      <h1
        class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
      >
        Please upload your image to share images with each other.
      </h1>
      <p
        class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200"
      >
        Here at Upload Image we focus on markets where technology, innovation, and capital can
        unlock long-term value and drive economic growth.
      </p>
      <div class="w-full max-w-md mx-auto">
        <label
          for="default-email"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Email sign-up</label
        >
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"></div>
          <input
            type="file"
            id="default-email"
            class="block w-full p-2 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your email here..."
            ref="file"
            @change="selectImage"
          />
          <button
            :disabled="!currentImage"
            @click="upload"
            class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Upload
          </button>
        </div>
        <div v-if="currentImage" class="progress">
          <div
            class="progress-bar progress-bar-info"
            role="progressbar"
            :aria-valuenow="progress"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{ width: progress + '%' }"
          >
            {{ progress }}%
          </div>
        </div>
        <div v-if="previewImage">
          <div class="card" style="width: 18rem">
            <img :src="previewImage" class="card-img-top" alt="..." />
          </div>
        </div>
        <div v-if="message" class="alert alert-secondary" role="alert">
          {{ message }}
        </div>
      </div>
    </div>
    <div
      class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"
    ></div>
  </section>

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
</template>

<script>
import uploadImageServices from './services/uploadImageServices'

export default {
  name: 'upload-image',
  data() {
    return {
      currentImage: undefined,
      previewImage: undefined,

      progress: 0,
      message: '',
      listImage: []
    }
  },
  methods: {
    selectImage() {
      let file = this.$refs.file.files.item(0)
      if (file.size > 1024 * 1024) {
        alert('File too big (> 1MB)')
        return false
      }

      if (!['image/png', 'image/jpeg', 'image/svg'].includes(file.type)) {
        alert('file not supported. suport JPG, PNG, JPEG, SVG')
        return false
      }

      this.previewImage = URL.createObjectURL(file)
      this.currentImage = file
      this.progress = 0
      this.message = ''
    },
    upload() {
      this.progress = 0

      uploadImageServices
        .upload(this.currentImage, (event) => {
          this.progress = Math.round((100 * event.loaded) / event.total)
        })
        .then((response) => {
          this.message = response.data.message
          return uploadImageServices.getFiles()
        })
        .then(() => {
          this.listImage = JSON.parse(uploadImageServices.getFiles())
        })
        .catch((err) => {
          this.progress = 0
          this.message = 'Could not upload the image! ' + err
          this.currentImage = undefined
        })
    }
  },
  mounted() {
    this.listImage = JSON.parse(uploadImageServices.getFiles())
  }
}
</script>
