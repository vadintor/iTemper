
import Vue from 'vue';

import App from '@/app.vue';
import {log} from '@/services/logger';

import Sensors from '@/components/sensors.vue';

import Vuetify from 'vuetify';

import { createLocalVue, mount } from '@vue/test-utils';

// import { shallow } from '@vue/test-utils';

describe('app.spec.ts', () => {
  const wrp: any = [];

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);

    // wrp = shallow(App, {
    //   localVue,
    // });
    // vm.$el === document.getElementById('app')

  });

  it('must have a app id', () => {
    // No items to display.
    // NOTE: By default, our component has some items, but we use
    // setData() here to override it with an empty array of items to
    // make sure we have not items at all and our test works as
    // expected.

    expect(wrp.attributes().id).toBe('app');
  });

  it('has the expected html structure', () => {
    expect(wrp.element).toMatchSnapshot();
  });
});
