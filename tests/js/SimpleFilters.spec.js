import { shallowMount, createLocalVue } from '@vue/test-utils';
import SimpleFilters from '@/components/SimpleFilters.vue';

const localVue = createLocalVue();

describe('SimpleFilters.vue', () => {
  let wrapper;
  const defaultProps = {
    propertiesType: [
      { id: 1, name: 'home' },
      { id: 2, name: 'garage' },
    ],
    users: [
      { id: 1, name: 'User One' },
      { id: 2, name: 'User Two' },
    ],
  };

  beforeEach(() => {
    wrapper = shallowMount(SimpleFilters, {
      propsData: defaultProps,
      localVue,
      mocks: {
        $route: { query: {} },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('initializes all filter fields as null', () => {
    expect(wrapper.vm.propertyType).toBeFalsy();
    expect(wrapper.vm.userId).toBeFalsy();
    expect(wrapper.vm.fromStartDate).toBeFalsy();
    expect(wrapper.vm.fromEndDate).toBeFalsy();
    expect(wrapper.vm.toStartDate).toBeFalsy();
    expect(wrapper.vm.toEndDate).toBeFalsy();
  });

  it('created() parses numeric query params and date strings from window.location.search', () => {
    const search = '?propertyType=2&userId=3&fromStartDate=2025-01-02';
    window.history.pushState({}, 'test', `/${search}`);

    const w = shallowMount(SimpleFilters, { propsData: defaultProps, localVue });

    expect(w.vm.propertyType).toBe(2);
    expect(w.vm.userId).toBe(3);

    expect(w.vm.fromStartDate).toBe('2025-01-02');

    w.vm.emitFilterChange();
    const emitted = w.emitted('filterChange')[0][0];
    expect(emitted.fromStartDate).toBeInstanceOf(Date);
    expect(emitted.fromStartDate.getFullYear()).toBe(2025);
    expect(emitted.fromStartDate.getMonth()).toBe(0);
    expect(emitted.fromStartDate.getDate()).toBe(2);
    expect(emitted.fromStartDate.getHours()).toBe(0);
    w.destroy();
  });

  it('clearFilters clears values and emits event', async () => {
    wrapper.vm.propertyType = 1;
    wrapper.vm.userId = 2;
    wrapper.vm.fromStartDate = '2025-01-01';

    wrapper.vm.clearFilters();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.propertyType).toBeNull();
    expect(wrapper.emitted('filterChange')).toBeTruthy();
  });

  it('convertToDateWithoutHour returns null for null input', () => {
    expect(wrapper.vm.convertToDateWithoutHour(null)).toBeNull();
  });

  it('emitFilterChange emits object with expected keys', () => {
    wrapper.vm.propertyType = 1;
    wrapper.vm.emitFilterChange();

    const emitted = wrapper.emitted('filterChange')[0][0];
    expect(emitted).toHaveProperty('propertyType');
    expect(emitted).toHaveProperty('userId');
  });

  it('watchers clear end dates and emit filterChange when starts are after ends', async () => {
    wrapper.setData({ fromEndDate: '2025-01-01', toEndDate: '2025-01-01' });

    wrapper.vm.fromStartDate = '2025-12-31';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.fromEndDate).toBeNull();
    expect(wrapper.emitted('filterChange')).toBeTruthy();

    wrapper.setData({ toEndDate: '2025-01-01' });
    wrapper.vm.toStartDate = '2025-12-31';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.toEndDate).toBeNull();
    expect(wrapper.emitted('filterChange').length).toBeGreaterThanOrEqual(2);
  });
});
