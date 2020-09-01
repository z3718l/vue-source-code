export function lifecycleMixin(Vue) {
  Vue.prototype._update = function () { // 传入虚拟节点，将虚拟节点渲染成真实节点并展示到页面上
    
  }
}

export function mountComponent(vm, el) {
  // 调用render函数去渲染 el属性

  // 先调用render方法 创建虚拟节点 再将虚拟节点渲染到页面上
  vm._update(vm._render())
}