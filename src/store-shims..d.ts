import { Store } from '@/store/store';
declare module 'vue/types/vue' {

  interface VueConstructor {
    $store: Store;
  }
}
