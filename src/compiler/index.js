// ast语法树 是用对象来描述原生语法的 
// 虚拟Dom 用过对象来面试dom节点
import { parseHTML } from './parse.js'
import { generate } from './generate.js'




export function compileToFunction(template) {
  // 将html模板 =》render函数
  /**
   * 1、需要将会html代码转化成'AST'语法树 可以用ast树来描述语言本身
   * 
   * 2、静态优化（不是重点 可自行查看）
   * 
   * 3、通过这个树结构 重新生成代码
   * 
   * 4、将字符串变成函数
   */
  // 1）
  let root = parseHTML(template); // 将html结构解析成语法树

  // 2）vue中的优化静态节点
  // console.log(root)

  // 3）
  let code = generate(root);
  console.log(code)

  // 4）限制取值范围 通过with来进行取值 稍后调用render函数 就可以通过改变this 让这个函数内部取到结果了
  let render = new Function(`with(this){return ${code}}`);
  console.log(render)
  // return render; // 返回生成好的render方法
  // return function render() {
    
  // }
}


// 生成的render函数
/**
 * <div id="app" style="color: red"> hello {{ name}} <span>hello</span> </div>
 * 
 * ==>
 * _c：创建元素（等价react中的createElement）
 * _v：创建文本节点
 * _s：JSON.stringfy的字符串
 * 通过generate函数，将传入的ast变成render函数
 * render() {
 *  return _c('div', { id: 'app', style: { color: 'red' }}, _v('Hello' + _s(name)), _c('span', null, _v('Hello')))
 * }
 */


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