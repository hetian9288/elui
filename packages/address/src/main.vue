<template>
    <div class="el-address" tabindex="0" :disabled="disable" @blur="hide()">
        <div class="el-address__city-input" @click="show()">
            <div class="el-address__city-val" v-show="valInnerShow" v-html="valInnerText"></div>
            <div class="el-address__city-label" v-show="!valInnerShow">{{ label }}</div>
        </div>
        <div class="el-address__body" v-show="disable">
            <el-tabs :active-name="tabName" @tab-click="selectLevel">
                <el-tab-pane label="省份" name="province">
                    <div class="address-name">
                        <div class="name-item" v-for="item in province" :class="{ current : typeof (dataVal[0]) !== 'undefined' && dataVal[0] != null && dataVal[0].id == item.id }" :data-value="item.id" @click="citySelect($event)">{{ item.name }}</div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="城市" name="city">
                    <div class="address-name">
                        <div class="name-item" v-for="item in city" :class="{ current : dataVal[1] != null && typeof (dataVal[1]) !== 'undefined' && dataVal[1].id == item.id }" :data-value="item.id" @click="citySelect($event)">{{ item.name }}</div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="县区" name="county">
                    <div class="address-name">
                        <div class="name-item" v-for="item in county" :class="{ current : dataVal[2] && typeof (dataVal[2]) !== 'undefined' != null && dataVal[2].id == item.id }" :data-value="item.id" @click="citySelect($event)">{{ item.name }}</div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="街道" name="street">
                    <div class="address-name">
                        <div class="name-item" v-for="item in street" :class="{ current : dataVal[3] && typeof (dataVal[3]) !== 'undefined' != null && dataVal[3].id == item.id }" :data-value="item.id" @click="citySelect($event)">{{ item.name }}</div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
  import cityJson from './city.json';
  
  export default {
    name: 'el-address',
    props: {
      label: {
        type: String,
        default: '请选择地区'
      },
      url: {
        type: String
      },
      value: {},
      disabled: Boolean
    },
    data() {
      return {
        valInnerText: '',
        valInnerShow: false,
        disable: this.disabled,
        tabName: 'province',
        dataVal: { 0: null, 1: null, 2: null, 3: null },
        province: [],
        city: [],
        county: [],
        street: []
      };
    },
    methods: {
      show() {
        this.disable = !this.disable;
      },
      hide() {
        this.disable = false;
      },
      valShow() {
        for (let item in this.dataVal) {
          if (item !== null) {
            this.valInnerShow = true;
            return;
          }
        }
        this.valInnerShow = false;
      },
      selectLevel(tab, event) {
        this.tabName = tab.name;
        if (this.tabName === 'street') {
          this.street.splice(0, this.street.length);
          if (this.dataVal[2] !== null && typeof (this.value[2]) !== 'undefined') {
            this.street.splice(0, this.street.length);
            this.$http.jsonp('http://passport.weihuo.top/district.jsonp', { params: { 'upid': this.dataVal[2].id } }).then((response) => {
              if (response.body.code === 200) {
                for (var item in response.body.data.address) {
                  if (response.body.data.address[item].upid === parseInt(this.dataVal[2].id, 10)) {
                    this.street.push(response.body.data.address[item]);
                  }
                }
              }
            });
          }
        } else {
          switch (this.tabName) {
            case 'city':
              this.city.splice(0, this.city.length);
              if (this.dataVal[0] !== null && typeof (this.value[0]) !== 'undefined') {
                for (let item in cityJson.city) {
                  if (cityJson.city[item].upid === parseInt(this.dataVal[0].id, 10)) {
                    this.city.push(cityJson.city[item]);
                  }
                }
              }
              break;
            case 'county':
              this.county.splice(0, this.county.length);
              if (this.dataVal[1] !== null && typeof (this.value[1]) !== 'undefined') {
                for (let item in cityJson.city) {
                  if (cityJson.city[item].upid === parseInt(this.dataVal[1].id, 10)) {
                    this.county.push(cityJson.city[item]);
                  }
                }
              }
              break;
          }
        }
      },
      setSelectData(level, pid, el, onTabName, nextTabName) {
        if (level < 3) {
          el.splice(0, el.length);
          for (var item in cityJson.city) {
            if (cityJson.city[item].upid === parseInt(pid, 10)) {
              el.push(cityJson.city[item]);
            }
          }
          if (el.length <= 0) {
            this.disable = false;
            this.tabName = onTabName;
          } else {
            this.tabName = nextTabName;
          }
        } else if (level === 3) {
          el.splice(0, el.length);
          this.$http.jsonp('http://passport.weihuo.top/district.jsonp', { params: { 'upid': pid } }).then((response) => {
            if (response.body.code === 200) {
              for (var item in response.body.data.address) {
                if (response.body.data.address[item].upid === parseInt(pid, 10)) {
                  el.push(response.body.data.address[item]);
                }
              }
            }
            if (el.length <= 0) {
              this.disable = false;
              this.tabName = onTabName;
            } else {
              this.tabName = nextTabName;
            }
          });
        } else if (level === 4) {
          this.disable = false;
        }
      },
      setValText() {
        let a = [];
        for (var item in this.dataVal) {
          if (this.dataVal[item] !== null) {
            a.push(this.dataVal[item].text);
          }
        }
        this.valInnerText = a.join(' <span style="color:#cfcfcf">/</span> ');
      },
      citySelect(event) {
        let val = event.currentTarget.getAttribute('data-value');
        let text = event.currentTarget.innerHTML;
        switch (this.tabName) {
          case 'province':
            this.dataVal[0] = { 'id': val, 'text': text};
            this.dataVal[1] = null;
            this.dataVal[2] = null;
            this.dataVal[3] = null;
            this.setSelectData(1, val, this.city, 'province', 'city');
            break;
          case 'city':
            this.dataVal[1] = { 'id': val, 'text': text};
            this.dataVal[2] = null;
            this.dataVal[3] = null;
            this.setSelectData(2, val, this.county, 'city', 'county');
            break;
          case 'county':
            this.dataVal[2] = { 'id': val, 'text': text};
            this.dataVal[3] = null;
            this.setSelectData(3, val, this.street, 'county', 'street');
            break;
          case 'street':
            this.dataVal[3] = { 'id': val, 'text': text};
            this.setSelectData(4, val, this.street, 'street', null);
            break;
        }
        this.setValText();
      }
    },
    watch: {
      'dataVal': {
        handler: function(val, oldVal) {
          this.valShow();
          this.$emit('input', this.dataVal);
          this.$emit('change', this.dataVal);
        },
        deep: true
      },
      'value': {
        handler: function(val, oldVal) {
          this.dataVal = this.value;
          this.setValText();
          this.tabName = 'province';
        },
        deep: true
      }
    },
    created() {},
    mounted() {
      this.province = cityJson.province;
    }
  };
</script>
<style lang="css" scoped>
    .el-address{
        position: relative;
        background-color: #FFF;
    }
    .el-address:focus{
        outline: none;
    }
    .el-address__body{
        position: absolute;
        top:35px;
        z-index:999;
        z-index:9999;
        display: block;
        width: 100%;
        background-color: #FFFFFF;
    }
    .el-address__city-input{
        display: block;
        padding: 3px 10px;
        box-sizing: border-box;
        width: 100%;
        height: 36px;
        color: #1f2d3d;
        background-color: #fff;
        background-image: none;
        border: 1px solid #C0CCDA;
        border-radius: 4px;
        outline: none;
        font-size: inherit;
        line-height: 26px;
        position: relative;
        cursor: pointer;
    }
    .el-address__city-input:after {
        content:"\E600";
        font-family: 'element-icons' !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        position: absolute;
        right: 10px;
        top:9px;
    }
    .el-address__city-val{
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
    }
    .el-address__city-label{
        font-size: 14px;
        color: #99A9BF;
    }
    .el-tabs{
        width: 100%;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #C0CCDA;
    }
    .address-name{
        padding: 12px;
        padding-top: 0px;
    }
    .address-name:after{
        display: block;
        content: " ";
        clear: both;
    }
    .address-name .name-item{
        display: inline-block;
        float: left;
        padding: 0 16px;
        line-height: 24px;
        text-align: center;
        margin-bottom: 4px;
        margin-right: 4px;
        font-size: 12px;
        cursor: pointer;
    }
    .address-name .name-item:hover{
        background-color: #D3DCE6;
    }
    .address-name .name-item.current{
        color: #FFF;
        background-color: #FF4949;
    }
</style>
