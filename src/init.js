// 在原型上添加init方法
import { initState} from './state.js'
import { compileToFunction } from './compiler/index.js'
export function initMixin(Vue) {
	// vue初始化流程
  Vue.prototype._init = function(options) {
		// 1、数据的劫持
		const vm = this;
		vm.$options = options;
		// 初始化状态
		initState(vm);

		// 如果用户传入了el属性，需要将页面渲染出来 并且要实现挂载流程
		if (vm.$options.el) {
			vm.$mount(vm.$options.el);
		}
	}
	Vue.prototype.$mount = function(el) {
		// console.log(el)
		const vm = this;
		const options = vm.$options;
		el = document.querySelector(el);
		// 默认先会查找有没有render方法，没有render会采用template、如果template也没有，就要el中的内容
		if (!options.render) {
			// 如果不是render才会进行编译，如果是render函数 就不需要编译了；所以写render函数会提升vue的性能
			let template = options.template;
			if (!template && el) {
				template = el.outerHTML;
			}
			// console.log(template, '===template')
			const render = compileToFunction(template);
			options.render = render; // 方便后续使用render方法
			// 需要将template转化成render方法 也就是将标签解析成ast语法树 
		}
	}
}