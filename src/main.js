const { createApp } = require('vue');
import App from './App.vue';
import VueGoogleMaps from '@fawmi/vue-google-maps';
import constants from './constants';

createApp(App)
  .use(VueGoogleMaps, {
    load: {
      key: constants.apiKey,
      libraries: 'places',
    },
  })
  .mount('#app');
