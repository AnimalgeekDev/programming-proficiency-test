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
  methods: {
    normalizeRowIndex(index) {
      return index + 1;
    },
  },
};
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="(header, index) in headers" :key="index">{{ header.value }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(property, rowIndex) in properties" :key="rowIndex">
          <td>{{ normalizeRowIndex(rowIndex) }}</td>
          <td v-for="(header, index) in headers" :key="index">{{ property[header.key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>
