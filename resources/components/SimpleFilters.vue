<script>
export default {
  name: 'SimpleFilters',
  props: {
    propertiesType: {
      type: Array,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      propertyType: null,
      userId: null,
      fromStartDate: null,
      fromEndDate: null,
      toStartDate: null,
      toEndDate: null,
    };
  },
  methods: {
    clearFilters() {
      this.propertyType = null;
      this.userId = null;
      this.fromStartDate = null;
      this.fromEndDate = null;
      this.toStartDate = null;
      this.toEndDate = null;
    },
  },
  watch: {
    fromStartDate(newDate) {
      if ((new Date(newDate)).getTime() > (new Date(this.fromEndDate)).getTime()) {
        this.fromEndDate = null;
      }
    },
    toStartDate(newDate) {
      if (new Date(newDate).getTime() > (new Date(this.toEndDate)).getTime()) {
        this.toEndDate = null;
      }
    },
  },
  setup() {
    // * Escuche los parámetros de URL para filtrar al cargar la página, por ejemplo?user=1
  },
};
</script>
<template>
  <div>
    <label for="filter">Tipo de propiedad:</label>
    <select type="text" id="propertyType" v-model="propertyType">
      <option value=""></option>
      <option v-for="{ id, name } in propertiesType" :key="id" :value="id">{{ name }}</option>
    </select>

    <label for="filter">Usuario:</label>
    <select type="text" id="user" v-model="userId">
      <option value=""></option>
      <option v-for="{ id, name } in users" :key="id" :value="id">{{ name }}</option>
    </select>

    <div>
      <div>Fecha inicio de alquiler</div>
      <label for="filter">Desde:</label>
      <input type="date" id="date" v-model="fromStartDate" />
      <label for="filter">Hasta:</label>
      <input type="date" id="date" v-model="fromEndDate" />
    </div>

    <div>
      <div>Fecha fin de alquiler</div>
      <label for="filter">Desde:</label>
      <input type="date" id="date" v-model="toStartDate" />
      <label for="filter">Hasta:</label>
      <input type="date" id="date" v-model="toEndDate" />
    </div>

    <div>
      <button @click="clearFilters">Limpiar filtros</button>
    </div>
  </div>
</template>
<style scoped></style>
