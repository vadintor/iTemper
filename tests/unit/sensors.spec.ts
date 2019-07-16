
import Vue from 'vue';

import { log } from '@/services/logger';

import MySensors from '@/components/mysensors.vue';
import { SENSOR_LIST } from './senor-lists';

import Vuetify from 'vuetify';

import { createLocalVue, mount } from '@vue/test-utils';
// import { shallow } from '@vue/test-utils';

describe('sensors.spec.ts', () => {
  let wrp: any;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);

    wrp = mount(MySensors, {
      localVue,
      propsData: {sensorState: SENSOR_LIST},
    });

  });

  it('should be a component', () => {

    expect(wrp.name()).toBe('MySensors');
  });

  it('should have a prop for sensors data', () => {
    expect(wrp.props().sensorState).toBe(SENSOR_LIST);
  });

});
