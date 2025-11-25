<script>
import PropertiesList from '@/components/PropertiesList.vue';
import SimpleFilters from '@/components/SimpleFilters.vue';
import PropertyColumnEnum from '@/enums/PropertyColumnEnum';
import FooterSection from '@/sections/FooterSection.vue';

export default {
  name: 'PropertiesTable',
  components: {
    PropertiesList,
    SimpleFilters,
    FooterSection,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    propertyTypes: {
      type: Array,
      required: true,
    },
    properties: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      today: new Date(),
      headers: [],
      propertiesEnhanced: [],
      propertiesFiltered: [],
      isMagicFilter: false,
      activeFilters: {
        propertyType: null,
        userId: null,
        fromStartDate: null,
        fromEndDate: null,
        toStartDate: null,
        toEndDate: null,
      },
    };
  },
  methods: {
    calcMountRented(rentedFrom, rentedTo) {
      if (rentedTo !== null) {
        let months = (rentedTo.getFullYear() - rentedFrom.getFullYear()) * 12;
        months -= rentedFrom.getMonth();
        months += rentedTo.getMonth();
        return months <= 0 ? 0 : months;
      }

      return rentedFrom.getDate() - this.today.getDate();
    },
    handleFilterChange(filters) {
      this.activeFilters = { ...filters };
      this.applyFilters();
    },
    applyFilters() {
      let filtered = [...this.propertiesEnhanced];

      if (this.activeFilters.propertyType) {
        filtered = filtered.filter(
          (p) => p.typeId === this.activeFilters.propertyType,
        );
      }

      if (this.activeFilters.userId) {
        filtered = filtered.filter(
          (p) => p.userId === this.activeFilters.userId,
        );
      }

      if (this.activeFilters.fromStartDate) {
        filtered = filtered.filter(
          (p) => p.rentedFrom >= this.activeFilters.fromStartDate,
        );
      }

      if (this.activeFilters.fromEndDate) {
        filtered = filtered.filter(
          (p) => p.rentedFrom <= this.activeFilters.fromEndDate,
        );
      }

      if (this.activeFilters.toStartDate) {
        filtered = filtered.filter(
          (p) => p.rentedTo >= this.activeFilters.toStartDate,
        );
      }

      if (this.activeFilters.toEndDate) {
        filtered = filtered.filter(
          (p) => p.rentedTo <= this.activeFilters.toEndDate,
        );
      }

      this.propertiesFiltered = filtered;
    },
  },
  mounted() {
    this.headers = Object.entries(PropertyColumnEnum).map(([key, value]) => ({ key, value }));

    this.propertiesEnhanced = this.properties.map((m) => ({
      ...m,
      type: this.propertyTypes.find((pt) => pt.id === m.typeId)?.name || null,
      userName: this.users.find((u) => u.id === m.userId)?.name || null,
      monthsRented: m.rentedFrom !== null ? this.calcMountRented(m.rentedFrom, m.rentedTo) : 0,
      isRentable: m.rentedTo !== null ? m.rentedTo.getDate() < this.today.getDate() : true,
    })).sort((a, b) => (a.id > b.id ? 1 : -1));

    this.propertiesFiltered = this.propertiesEnhanced;
  },
};
</script>
<template>
  <div class="min-h-screen w-full flex flex-col">
    <header class="flex items-center">
      <h1 class="w-full text-3xl font-bold bg-blue-500 text-white p-4">
        Lista de propiedades administradas
      </h1>
    </header>

    <main class="overflow-auto p-4">
      <SimpleFilters
        :users="users"
        :propertiesType="propertyTypes"
        @filterChange="handleFilterChange" />
      <PropertiesList :headers="headers" :properties="propertiesFiltered"></PropertiesList>
    </main>

    <FooterSection></FooterSection>
  </div>
</template>
<style scoped></style>
