/**
 * 预期：<div id="app" style="color: red"> hello {{ name}} <span>hello</span> </div>
 * 
 * ==>
 * _c：创建元素（等价react中的createElement）
 * _v：创建文本节点
 * _s：JSON.stringfy的字符串
 * 通过generate函数，将传入的模板变成render函数
 * 结果：render() {
 *  return _c('div', { id: 'app', style: { color: 'red' }}, _v('Hello' + _s(name)), _c('span', null, _v('Hello')))
 * }
 */
// 语法层面的转义
function genProps(attrs) { // 处理属性  
  // console.log(attrs)
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') { // 对样式进行特殊处理
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key,value] = item.split(':');
        obj[key] = value;
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)}`;
  }
  return `{${str.slice(0, -1)}}`; // 处理掉最后一个,
}
function gen(node) { // 判断node的nodetype
  if (node.type === 1) { // 元素类型
    return generate(node); // 生成元素节点的字符串
  } else { // 如果是文本
    let text = node.text; // 获取文本
    // 如果是普通文本 不带{{}}
    return `_v(${JSON.stringify(text)})`
  }
}
function  genChildren(el) { // 处理孩子元素
  const children = el.children;
  if (children) { // 如果有孩子元素
    return children.map(child => gen(child)).join(',');
  }
}
export function generate(el) {
  // console.log(el)
  let children = genChildren(el); // 获取孩子元素
  let code = `_c('${el.tag}', ${el.attrs.length?`${genProps(el.attrs)}`: 'undefined'}${
    children?`,${children}`:''
  })`;

  return code;
}