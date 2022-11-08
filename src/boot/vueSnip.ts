import VueSnip from 'vue-snip';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.use(VueSnip);
});
