<script>
import PropertiesList from '@/components/PropertiesList.vue';
import SimpleFilters from '@/components/SimpleFilters.vue';
import PropertyColumnEnum from '@/enums/PropertyColumnEnum';

export default {
  name: 'PropertiesTable',
  components: {
    PropertiesList,
    SimpleFilters,
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
      isMagicFilter: false,
    };
  },
  methods: {
    calcMountRented(rentedFrom, rentedTo) {
      if (rentedTo) {
        return rentedFrom.getDate() - rentedTo.getDate();
      }
      return rentedFrom.getDate() - this.today.getDate();
    },
  },
  mounted() {
    this.headers = Object.entries(PropertyColumnEnum).map(([key, value]) => ({ key, value }));

    this.propertiesEnhanced = this.properties.map((m) => ({
      ...m,
      typeId: this.propertyTypes.find((pt) => pt.id === m.typeId)?.name || null,
      userId: this.users.find((u) => u.id === m.userId)?.name || null,
      monthsRented: m.rentedFrom !== null ? this.calcMountRented(m.rentedFrom, m.rentedTo) : 0,
      isRentable: m.rentedTo !== null ? m.rentedTo.getDate() < this.today.getDate() : true,
    }));
  },
};
</script>
<template>
  <div>
    <h1>Lista de propiedades</h1>
    <div>
      <SimpleFilters :users="users" :propertiesType="propertyTypes"></SimpleFilters>
    </div>
    <div>
      <PropertiesList :headers="headers" :properties="propertiesEnhanced"></PropertiesList>
    </div>
  </div>
</template>
<style scoped></style>
