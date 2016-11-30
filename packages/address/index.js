import Address from './src/main';

/* istanbul ignore next */
Address.install = function(Vue) {
  Vue.component(Address.name, Address);
};

export default Address;
