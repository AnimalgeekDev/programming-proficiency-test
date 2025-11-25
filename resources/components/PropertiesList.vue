<script>
export default {
  name: 'PropertiesList',
  props: {
    headers: {
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
      posibleItemsPerPage: [3, 5, 10, 15, 20],
      itemsPerPage: 3,
      page: 1,
    };
  },
  watch: {
    properties() {
      this.resetPage();
    },
    itemsPerPage() {
      this.resetPage();
    },
  },
  computed: {
    posiblePages() {
      return Math.ceil(this.properties.length / this.itemsPerPage);
    },
    propertiesPaginated() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.properties.slice(start, end);
    },
  },
  methods: {
    resetPage() {
      this.page = 1;
    },
    handleChangePage(newPage) {
      this.page = newPage;
    },
    determinateCellValue(value, type) {
      if (type === 'date' && value) {
        const date = new Date(value);
        return date.toLocaleDateString();
      }

      if (type === 'boolean') {
        return value ? 'Yes' : 'No';
      }

      return value;
    },
  },
};
</script>

<template>
  <div class="w-full overflow-x-auto bg-white rounded-lg shadow-sm">
    <div v-if="propertiesPaginated && propertiesPaginated.length > 0"
        class="inline-block min-w-full align-middle">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            </th>
            <th v-for="(header, hIndex) in headers" :key="hIndex"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500">
              <span class="uppercase tracking-wider">{{ header.value.text }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(property, rowIndex) in propertiesPaginated" :key="rowIndex"
            :class="[(rowIndex % 2) ? 'bg-gray-50' : '', 'hover:bg-gray-100']">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ property.id }}
            </td>
            <td v-for="(header, cIndex) in headers" :key="cIndex"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
              {{ determinateCellValue(property[header.key], header.value.type) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="w-full flex justify-center mt-4 mr-4">
        <select class="w-16 mr-8 rounded text-center" v-model="itemsPerPage">
          <option v-for="value in posibleItemsPerPage" :key="value" :value="value">
            {{ value }}
          </option>
        </select>
        <div v-for="number in posiblePages" :key="number" class="mx-1">
          <button :class="{ 'bg-blue-700': page === number }"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-m"
            @click="handleChangePage(number)">
            {{ number }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="flex w-full justify-center items-center h-40">
      <!-- eslint-disable max-len -->
      <div class="flex w-3/4 justify-center items-center h-full border border-gray-300 rounded-2xl">
        NO HAY PROPIEDADES CON LOS FILTROS SELECCIONADOS
      </div>
    </div>
  </div>
</template>
