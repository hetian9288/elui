<script>
  export default {
    data() {
      return {
        tabName: 'province',
        data: {}
      }
    },
    methods: {
      to() {
        this.data = { "0": { "id": "3", "text": "河北" }, "1": { "id": "81", "text": "衡水市" }, "2": { "id": "1262", "text": "安平县" }, "3": { "id": "6848", "text": "大子文乡" } };
      }
    }
  };
</script>

## 地址选择框

地区数据四级:省、市、县、街道

数据详情: [json数据](http://passport.weihuo.top/address.json "json数据")


::: demo Address 组件提供四级地区选择。
```html
<template>
<div>
  <p>{{ data }}</p>
  <el-address
    v-model="data">
  </el-address>
  <el-button type="text" @click="to()">设置地区</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabName: 'province'
      };
    }
  };
</script>
```
:::

<style>
  .el-address {
    width:450px;
    margin: 20px 0 0;
  }
</style>