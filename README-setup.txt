2019-09-17
cd e:\gitrepos\lab
vue --version // 3.11.0 
vue create vue-lab // lagrad som Vue-lab preset
cd vue-lab
vue add vuetify  // Default
main.ts:
    import Vuetify from 'vuetify';
    import 'vuetify/dist/vuetify.min.css';
    Vue.use(Vuetify);
git init
git add .