<template>
  <div>
    <table width="1200" border="1">
      <tr>
        <th v-for="(key, index) in Object.keys(data[0])" :key="index">{{ key }}</th>
      </tr>

      <tr v-for="(item, index) in data" :key="index">
        <td v-for="(value, key) in item" :key="key">{{ value }}</td>
      </tr>


    </table>

  </div>
</template>
<script>

export default {
  data() {
    return {
     
    };
  },
  mounted() {

  },
  methods: {

  }
};
</script>