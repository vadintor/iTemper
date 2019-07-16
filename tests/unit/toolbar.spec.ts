
import Vue from 'vue';
import Toolbar from '../../src/components/toolbar.vue';

import Vuetify from 'vuetify';

import { createLocalVue, mount } from '@vue/test-utils';

// import { shallow } from '@vue/test-utils';

describe('toolbar.spec.ts', () => {
  let wrp: any;
  let vm: any;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);

    wrp = mount(Toolbar, {
      localVue,
    });
    vm = wrp;
  });

  it('does not display element if there are no items', () => {
    // No items to display.
    // NOTE: By default, our component has some items, but we use
    // setData() here to override it with an empty array of items to
    // make sure we have not items at all and our test works as
    // expected.
    wrp.setData({ menuItems: [] });
    expect(wrp.find('.item-index-row').exists()).toBe(false);

  });

  it('has the expected html structure', () => {
    expect(wrp.element).toMatchSnapshot();
  });

  it('has default menu items ', () => {
    expect(wrp.vm.menuItems[3].route).toBeDefined();
  });
});
