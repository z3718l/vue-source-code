// 这里就是vue的核心代码
// 这个文件只是vue的一个声明，不做具体的操作
// 由于vue的方法比较多，我们会把他们写在原型上，方便调用
import { initMixin } from './init.js'
import { lifecycleMixin } from './lifecycle.js'
import { renderMixin } from './vdom/index'
function Vue(options) {
    // options接收vue实例中的所有方法和配置
    // 在这里进行vue的初始化操作
    // console.log(options);
    this._init(options)
}
// 通过引入的方式，给原型上添加方法
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
export default Vue