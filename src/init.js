// 在原型上添加init方法
import { initState} from './state.js'
export function initMixin(Vue) {
	// vue初始化流程
  Vue.prototype._init = function(options) {
		// 1、数据的劫持
		const vm = this;
		vm.$options = options;
		initState(vm)
	}
}