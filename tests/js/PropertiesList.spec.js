import { shallowMount, createLocalVue } from '@vue/test-utils';
import PropertiesList from '@/components/PropertiesList.vue';

const localVue = createLocalVue();

describe('PropertiesList.vue', () => {
  let wrapper;
  const mockProperties = [
    { id: 1, name: 'Property 1' },
    { id: 2, name: 'Property 2' },
    { id: 3, name: 'Property 3' },
    { id: 4, name: 'Property 4' },
    { id: 5, name: 'Property 5' },
  ];

  const mockHeaders = [
    { key: 'id', value: { text: 'ID', type: 'string' } },
    { key: 'name', value: { text: 'Name', type: 'string' } },
  ];

  beforeEach(() => {
    wrapper = shallowMount(PropertiesList, {
      propsData: { headers: mockHeaders, properties: mockProperties },
      localVue,
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('initial page and itemsPerPage default values', () => {
    expect(wrapper.vm.page).toBe(1);
    expect(wrapper.vm.itemsPerPage).toBe(3);
  });

  it('resetPage sets page to 1', () => {
    wrapper.vm.page = 4;
    wrapper.vm.resetPage();
    expect(wrapper.vm.page).toBe(1);
  });

  it('posiblePages computes correctly', () => {
    expect(wrapper.vm.posiblePages).toBe(Math.ceil(mockProperties.length / 3));
  });

  it('determinateCellValue formats dates and booleans correctly', () => {
    const testDate = new Date('2025-06-15');
    const dateStr = wrapper.vm.determinateCellValue(testDate, 'date');

    expect(typeof dateStr).toBe('string');

    expect(dateStr).toContain('15');
    expect(dateStr).toContain('2025');

    expect(wrapper.vm.determinateCellValue(true, 'boolean')).toBe('Yes');
    expect(wrapper.vm.determinateCellValue(false, 'boolean')).toBe('No');

    expect(wrapper.vm.determinateCellValue(null, 'date')).toBeNull();
    expect(wrapper.vm.determinateCellValue('hello', 'string')).toBe('hello');
  });
});
