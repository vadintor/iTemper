
import { Store } from '@/store/';
declare module 'vue/types/vue' {

  interface VueConstructor {
    $store: Store;
  }
}
