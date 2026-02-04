<template>
  <section>
    <div class="container">
      <div class="box" id="content">
        <h1 class="title">Ask HN</h1>
        <hr class="hr">
        <div v-if="error" class="notification is-warning">
          <p><strong>API Currently Unavailable</strong></p>
          <p>{{ error }}</p>
          <button class="button is-warning mt-4" @click="retryFetch">Retry</button>
        </div>
        <ListItem v-else v-for="post in posts"
                  :key="post.id"
                  :title="post.title"
                  :link="post.url"
                  :score="post.score"
                  :user="post.by"
                  :comment_link="post.comments_url"
                  :comment_count="post.descendants"
        />
      </div>
    </div>
  </section>
</template>
<style lang="stylus">
  #content {
    margin-left: 10px
    margin-right: 10px
  }
  .notification {
    margin: 1rem 0
  }
</style>
<script>
import axios from 'axios'
import ListItem from '../components/ListItem'
import { getConfig } from '../config'

export default {
  components: { ListItem },
  data () {
    return {
      posts: [],
      error: null
    }
  },
  methods: {
    async fetchStories() {
      try {
        const { apiUrl } = getConfig()
        let response = await axios.get(`${apiUrl}/stories/ask`)
        this.posts = response.data.map(story => ({
          id: story.id,
          title: story.title,
          url: story.url,
          score: story.points,
          by: story.submitted_by,
          descendants: story.comments,
          comments_url: story.comments_url
        }))
        this.error = null
      } catch (err) {
        this.error = 'Unable to fetch stories. Please try again later.'
        console.error('Error fetching stories:', err)
      }
    },
    async retryFetch() {
      this.error = null
      await this.fetchStories()
    }
  },
  async created () {
    await this.fetchStories()
  }
}
</script>
