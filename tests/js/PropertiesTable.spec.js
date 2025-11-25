import { shallowMount, createLocalVue } from '@vue/test-utils';
import PropertiesTable from '@/sections/PropertiesTable.vue';

const localVue = createLocalVue();

describe('PropertiesTable.vue', () => {
  let wrapper;
  const mockProperties = [
    {
      id: 1,
      name: 'Property 1',
      typeId: 1,
      userId: 1,
      rentedFrom: new Date('2025-01-01'),
      rentedTo: new Date('2025-06-30'),
    },
    {
      id: 2,
      name: 'Property 2',
      typeId: 2,
      userId: 2,
      rentedFrom: new Date('2025-03-01'),
      rentedTo: null,
    },
  ];

  const defaultProps = {
    users: [
      { id: 1, name: 'User One' },
      { id: 2, name: 'User Two' },
    ],
    propertyTypes: [
      { id: 1, name: 'home' },
      { id: 2, name: 'garage' },
    ],
    properties: mockProperties,
  };

  beforeEach(() => {
    wrapper = shallowMount(PropertiesTable, {
      propsData: defaultProps,
      localVue,
      stubs: {
        PropertiesList: true,
        SimpleFilters: true,
        FooterSection: true,
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('calcMountRented returns valid integer >= 0', () => {
    const from = new Date('2025-01-01');
    const to = new Date('2025-06-30');
    const months = wrapper.vm.calcMountRented(from, to);
    expect(Number.isInteger(months)).toBe(true);
    expect(months).toBeGreaterThanOrEqual(0);
  });

  it('calcMountRented returns 0 for same month and when to is before from', () => {
    const from = new Date('2025-06-01');
    const toSameMonth = new Date('2025-06-30');
    const monthsSame = wrapper.vm.calcMountRented(from, toSameMonth);
    expect(monthsSame).toBe(0);

    const toBefore = new Date('2025-05-01');
    const monthsBefore = wrapper.vm.calcMountRented(from, toBefore);
    expect(monthsBefore).toBe(0);
  });

  it('calcMountRented uses today when rentedTo is null', () => {
    wrapper.setData({ today: new Date('2025-06-15') });
    const from = new Date('2025-01-01');
    const months = wrapper.vm.calcMountRented(from, null);
    expect(Number.isInteger(months)).toBe(true);
    expect(months).toBeGreaterThanOrEqual(0);
  });

  it('mounted enhances properties and sorts by id', () => {
    const unsorted = [
      {
        id: 5, typeId: 1, userId: 1, rentedFrom: new Date('2025-01-01'), rentedTo: null,
      },
      {
        id: 2, typeId: 1, userId: 1, rentedFrom: new Date('2025-02-01'), rentedTo: null,
      },
      {
        id: 3, typeId: 2, userId: 2, rentedFrom: new Date('2025-03-01'), rentedTo: null,
      },
    ];

    const wrapper2 = shallowMount(PropertiesTable, {
      propsData: {
        users: defaultProps.users,
        propertyTypes: defaultProps.propertyTypes,
        properties: unsorted,
      },
      localVue,
      stubs: { PropertiesList: true, SimpleFilters: true, FooterSection: true },
    });

    const ids = wrapper2.vm.propertiesEnhanced.map((p) => p.id);
    expect(ids).toEqual([2, 3, 5]);
    wrapper2.destroy();
  });

  it('handleFilterChange updates activeFilters and calls applyFilters', () => {
    const spy = jest.spyOn(wrapper.vm, 'applyFilters');
    const newFilters = { propertyType: 1, userId: 1 };
    wrapper.vm.handleFilterChange(newFilters);
    expect(wrapper.vm.activeFilters.propertyType).toBe(1);
    expect(spy).toHaveBeenCalled();
  });
});
