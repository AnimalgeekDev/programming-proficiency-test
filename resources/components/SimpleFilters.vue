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
      this.emitFilterChange();
    },
    convertToDateWithoutHour(date) {
      if (!date) return null;
      const d = new Date(date);
      return new Date(d.setHours(0, 0, 0, 0));
    },
    emitFilterChange() {
      this.$emit('filterChange', {
        propertyType: this.propertyType,
        userId: this.userId,
        fromStartDate: this.convertToDateWithoutHour(this.fromStartDate),
        fromEndDate: this.convertToDateWithoutHour(this.fromEndDate),
        toStartDate: this.convertToDateWithoutHour(this.toStartDate),
        toEndDate: this.convertToDateWithoutHour(this.toEndDate),
      });
    },
  },
  watch: {
    fromStartDate(newDate) {
      console.log(newDate);
      if ((new Date(newDate)).getTime() > (new Date(this.fromEndDate)).getTime()) {
        this.fromEndDate = null;
      }
      this.emitFilterChange();
    },
    toStartDate(newDate) {
      if (new Date(newDate).getTime() > (new Date(this.toEndDate)).getTime()) {
        this.toEndDate = null;
      }
      this.emitFilterChange();
    },
    fromEndDate() {
      this.emitFilterChange();
    },
    toEndDate() {
      this.emitFilterChange();
    },
  },
  created() {
    const urlFilters = {};
    const urlSearchParams = new URLSearchParams(window.location.search);

    urlSearchParams.forEach((value, key) => {
      urlFilters[key] = value;
    });

    const {
      propertyType,
      userId,
      fromStartDate,
      fromEndDate,
      toStartDate,
      toEndDate,
    } = urlFilters;

    if (propertyType != null && propertyType !== '') {
      const maybePropertyType = Number(propertyType);
      this.propertyType = !Number.isNaN(maybePropertyType) ? maybePropertyType : propertyType;
    }

    if (userId != null && userId !== '') {
      const maybeUserId = Number(userId);
      this.userId = !Number.isNaN(maybeUserId) ? maybeUserId : userId;
    }

    this.fromStartDate = fromStartDate;
    this.fromEndDate = fromEndDate;
    this.toStartDate = toStartDate;
    this.toEndDate = toEndDate;

    console.log(this.fromStartDate);
  },
};
</script>
<template>
  <div class="border border-gray-300 rounded-2xl m-4 py-8 px-4">
    <div class="flex gap-4">
      <div class="flex mr-4">
        <label class="mr-2" for="propertyType">Tipo de propiedad:</label>
        <select id="propertyType" type="text"
          class="w-48 bg-white border border-gray-400 rounded-md"
          v-model="propertyType" @change="emitFilterChange">
          <option value=""></option>
          <option v-for="{ id, name } in propertiesType" :key="id" :value="id" class="capitalize">
            {{ name }}
          </option>
        </select>
      </div>

      <div class="flex mr-4">
        <label class="mr-2" for="userId">Usuario:</label>
        <select id="userId" type="text"
          class="w-48 bg-white border border-gray-400 rounded-md" v-model="userId"
          @change="emitFilterChange">
          <option value=""></option>
          <option v-for="{ id, name } in users" :key="id" :value="id" class="capitalize">
            {{ name }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-col my-4">
      <div>Fecha inicio de alquiler</div>
      <div class="flex flex-row ml-3 my-1">
        <label class="w-12 mr-3" for="fromStartDate">Desde:</label>
        <input id="fromStartDate" type="date"
          class="text-center border w-36 rounded-s border-gray-400"
          v-model="fromStartDate" />
      </div>
      <div class="flex flex-row ml-3 my-1">
        <label class="w-12 mr-3" for="fromEndDate">Hasta:</label>
        <input id="fromEndDate" type="date"
          class="text-center border w-36 rounded-s border-gray-400"
          v-model="fromEndDate" />
      </div>
    </div>

    <div class="flex flex-col my-4">
      <div>Fecha fin de alquiler</div>
      <div class="flex flex-row ml-3 my-1">
        <label class="w-12 mr-3" for="toStartDate">Desde:</label>
        <input id="toStartDate" type="date"
          class="text-center border w-36 rounded-s border-gray-400"
          v-model="toStartDate" />
      </div>
      <div class="flex flex-row ml-3 my-1">
        <label class="w-12 mr-3" for="toEndDate">Hasta:</label>
        <input id="toEndDate" type="date" class="text-center border w-36 rounded-s border-gray-400"
          v-model="toEndDate" />
      </div>
    </div>

    <div class="mt-6">
      <button
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-m"
        @click="clearFilters">
        Limpiar filtros
      </button>
    </div>
  </div>
</template>
<style scoped></style>
