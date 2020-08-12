import { observe } from './observe/index.js'
export function initState(vm) {
    const opts = vm.$options;
    // vue的数据来源，属性 方法 数据 计算属性 watch
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}
function initProps() {}
function initMethods() {}
function initData(vm) {
    // 数据初始化工作
    let data = vm.$options.data; // 用户传递的数据
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
function initComputed() {}
function initWatch() {}
