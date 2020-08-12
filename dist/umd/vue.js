(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    // 把data中的数据 都使用Object.defineProperty重新定义
    // Object.defineProperty 兼容性不好，不能兼容ie8及以下
    function observe(data) {
      console.log(data, '===observe');
    }

    function initState(vm) {
      var opts = vm.$options; // vue的数据来源，属性 方法 数据 计算属性 watch

      if (opts.props) ;

      if (opts.methods) ;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) ;

      if (opts.watch) ;
    }

    function initData(vm) {
      // 数据初始化工作
      var data = vm.$options.data; // 用户传递的数据

      /**
       * vm._data:为了用户可以方便拿到数据
       * 如果data是一个函数，就直接执行函数，并且把函数的this指向vm（vue的实例）
       * 如果不是函数，直接等于data
       */

      data = vm._data = typeof data === 'function' ? data.call(vm) : data;
      /**
       * 对象劫持 用户改变了数据，我们希望可以得到通知 ==》并且刷新页面数据
       * MVVM模式 数据变化了可以驱动视图变化
       * Object.defineProperty() 给属性增加get方法和set方法
       */

      observe(data); // 响应式原理
    }

    // 在原型上添加init方法
    function initMixin(Vue) {
      // vue初始化流程
      Vue.prototype._init = function (options) {
        // 1、数据的劫持
        var vm = this;
        vm.$options = options;
        initState(vm);
      };
    }

    // 这里就是vue的核心代码

    function Vue(options) {
      // options接收vue实例中的所有方法和配置
      // 在这里进行vue的初始化操作
      // console.log(options);
      this._init(options);
    } // 通过引入的方式，给原型上添加方法


    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=vue.js.map
