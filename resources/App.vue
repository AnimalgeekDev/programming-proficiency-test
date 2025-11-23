<template>
  <div id="app">
    <PropertiesTable :users="users" :propertyTypes="propertyTypes" :properties="properties">
    </PropertiesTable>
  </div>
</template>

<script>
import PropertiesTable from '@/sections/PropertiesTable.vue';
import { users, propertyTypes, properties } from '@/mocks/api';

export default {
  name: 'App',
  components: {
    PropertiesTable,
  },
  data: () => ({
    users,
    propertyTypes,
    properties,
  }),
};
</script>
