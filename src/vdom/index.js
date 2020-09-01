export function renderMixin(Vue) {
  Vue.prototype._c = function () { // 创建元素
    return createElement(...arguments);
  }
  Vue.prototype._s = function (val) { // stringify
    return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val;
  }
  Vue.prototype._v = function (text) { // 创建文本元素
    return createTextVnode(text);
  }
  Vue.prototype._render = function () { 
    const vm = this;
    const render = vm.$options.render;
    let vnode = render.call(vm);
    return vnode;
  }
}

function createElement(tag, data={}, ...children) {
  return vnode(tag, data, ...children)
}
function createTextVnode(text) {
  return vnode(undefined,undefined,undefined,undefined,text)
}
// 用来生成虚拟dom
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}