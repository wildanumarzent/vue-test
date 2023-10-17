<template>
  <section
    class="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]"
  >
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
      <LabelHeader />
      <div class="w-full max-w-md mx-auto">
        <label
          for="default-email"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Upload File</label
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
          <ProgressBar :progress="progress" />
        </div>
        <div v-if="previewImage">
          <PreviewImage :previewImage="previewImage" />
        </div>
      </div>
    </div>
    <div
      class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"
    ></div>
  </section>
  <div v-if="loadImage">
    <Skeleton />
  </div>
  <div v-else>
    <Gallery :listImage="listImage" />
  </div>
</template>

<script>
import uploadImageServices from './services/uploadImageServices'
import Skeleton from './components/Skeleton.vue'
import Gallery from './components/Gallery.vue'
import LabelHeader from './components/LabelHeader.vue'
import ProgressBar from './components/ProgressBar.vue'
import PreviewImage from './components/PreviewImage.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  name: 'upload-image',
  data() {
    return {
      currentImage: undefined,
      previewImage: undefined,

      progress: 0,
      message: '',
      listImage: [],
      loadImage: undefined
    }
  },
  components: {
    Skeleton,
    Gallery,
    LabelHeader,
    ProgressBar,
    PreviewImage
  },
  methods: {
    selectImage() {
      let file = this.$refs.file.files.item(0)
      if (file.size > 2024 * 2024) {
        alert('File too big (> 2MB)')
        // this.showToatWarning('File too big (> 2MB)')
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
      this.loadImage = true
      uploadImageServices
        .upload(this.currentImage, (event) => {
          this.progress = Math.round((100 * event.loaded) / event.total)
        })
        .then((response) => {
          this.message = response.data.message
          return uploadImageServices.getFiles()
        })
        .then(() => {
          this.loadImage = true
          this.listImage = JSON.parse(uploadImageServices.getFiles())
          this.previewImage = undefined
          this.currentImage = undefined
          this.file = ''
          this.showToatSuccess('Image successfully uploaded')
          this.loadImage = false
        })
        .catch((err) => {
          this.progress = 0
          this.showToatWarning('Could not upload the image! ' + err)
          this.currentImage = undefined
        })
      this.loadImage = false
    },
    showToatWarning(message) {
      toast.warning(message, {
        autoClose: 2000
      })
    },
    showToatSuccess(message) {
      toast.success(message, {
        autoClose: 2000
      })
    },
    showToatInfo(message) {
      toast.info(message, {
        autoClose: 2000
      })
    }
  },
  mounted() {
    this.listImage = JSON.parse(uploadImageServices.getFiles())
  }
}
</script>
