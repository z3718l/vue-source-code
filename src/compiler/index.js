// ast语法树 是用对象来描述原生语法的 
// 虚拟Dom 用过对象来面试dom节点
// ?: 匹配不捕获
// arguments[0] = 匹配到的标签   arguments[1] = 匹配到的标签名字
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // 匹配 abc-aaa (标签)
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:bb>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的 <div id=""></div>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 处理开始标签
function start(tagName, attrs) {
  console.log('开始标签')
}
function chars(text) {
  console.log(text)
}
function end(tagName) {
  console.log(tagName)
}

function parseHTML(html) {
  // 不停的去解析html字符串
  while (html) {
    let textEnd = html.indexOf('<');
    if (textEnd === 0) {
      // 如果返回值为0，说明肯定是有一个标签：开始标签 结束标签
      let startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果  tagName attrs
      if (startTagMatch) {
        // console.log(startTagMatch) // 匹配到开始标签
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue; // 如果开始标签匹配完毕后，继续下一次匹配
      }
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue; // 继续匹配
      }
    }
    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
      // break;
    }
  }
  function advance(n) { // 截取匹配到的字符串
    html = html.substring(n)
  }
  function parseStartTag() {
    let start = html.match(startTagOpen);
    if (start) {
      // console.log(start, '=====')
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length); // 将匹配到的标签删除
      // console.log(html); // 这里的html应该就变少了
      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 匹配标签上是否有属性
        // 将属性进行解析
        advance(attr[0].length); //将属性去掉
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      if (end) { // 去掉开始标签 >
        advance(end[0].length);
        return match
      }
    }
  }
}

export function compileToFunction(template) {
  let root = parseHTML(template); // 将html结构解析成语法树
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