(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 判断当前数据是不是对象
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue如果数据的层级过多，需要递归的去解析对象中的属性，依次增加set和get方法
      // proxy不需要一上来就进行递归，也不需要添加set和get方法，所以性能会有所提高
      this.walk(value);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 拿到用户传的对象数据 data => {name: 'zhangsan',age: 12}
        var keys = Object.keys(data); // [name, age]
        // for(let i = 0; i < keys.length; i ++) {
        //     let key = keys[i]; // key => name age(循环之后)
        //     let value = data[key]; // value => 'zhangsan' 12(循环之后)
        //     defineReactive(data, key, value); // 定义响应式数据
        // }
        // 优化for循环

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 使用defineProperty进行数据响应
    // 用户进行获取值、设置值得话就会在这里进行拦截
    observe(value); // 递归调用，如果value还是一个对象，就再走一遍new Observer（递归实现深度检测）
    // 添加了这个递归方法，无论是几层嵌套，都能把对象监测到

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(value); // 如果用户设置的是一个对象，继续进行劫持

        value = newValue;
      }
    });
  }

  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    new Observer(data); // 用来观测数据
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
