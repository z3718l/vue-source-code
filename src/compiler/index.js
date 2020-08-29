// ast语法树 是用对象来描述原生语法的 
// 虚拟Dom 用过对象来面试dom节点
import { parseHTML } from './parse.js'




export function compileToFunction(template) {
  // 将html模板 =》render函数
  /**
   * 1、需要将会html代码转化成'AST'语法树 可以用ast树来描述语言本身
   * 
   * 2、通过这个树结构 重新生成代码
   */
  let root = parseHTML(template); // 将html结构解析成语法树
  // vue中的优化静态节点
  console.log(root)
  return function render() {

  }
}


// 模板解析就是使用正则对字符串进行匹配和截取
/**
 * <div id="app">
 *  <p>hello</p>
 * </div>
 * 
 * 用ast语法树表达上面的html
 * 
 * let root = {
 *  tag: 'div',
 *  attrs: [{name: 'id, value: 'app'}]
 *  parent: null,
 *  type: 1,
 *  children[{
 *    tag: 'p',
 *    attrs: [],
 *    parent: root,
 *    type: 1,
 *    children: [{
 *      text: 'hello',
 *      type: 3
 *    }]
 *  }]
 * }
 */