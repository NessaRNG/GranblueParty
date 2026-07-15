import { createApp } from './app'

const { app, router, store } = createApp()

// Load state of localStorage
const username = localStorage.getItem('username');
if (username) {
  store.commit({
    type: 'login_client',
    username: username,
  });
}

router.onReady(() => {
  app.$mount('#app')
})