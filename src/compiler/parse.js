// ?: 匹配不捕获
// arguments[0] = 匹配到的标签   arguments[1] = 匹配到的标签名字
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // 匹配 abc-aaa (标签)
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:bb>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的 <div id=""></div>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(html) {
  // 创建ast节点
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName, // 标签名
      type: 1, // 元素类型
      children: [], // 孩子列表
      attrs, // 属性集合
      parent: null // 父级
    }
  }
  // 处理开始标签
  let root;
  let currentParent;
  let stack = [];
  /**
   * 验证标签是否合法
   * 思路：使用栈 每截取一个标签，放入栈中，如果结束了，拿出栈中最后一个进行比较，
   * 如果相同，则表示标签合法，否则不合法，也就是出现这样的标签嵌套<div><p><span></p></div>
   * [div, p, span]
   */
  function start(tagName, attrs) {
    // console.log(tagName, attrs, '======开始标签======')
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element; // 当前解析的标签 保存起来
    // 拿到的是开始的标签
    stack.push(element); // 将生产的ast元素放入栈中，因为标签名是没有parent属性的
  }
  function chars(text) {
    // console.log(text, '======文本标签======')
    text = text.replace(/\s/g, ''); // 正则匹配 将空格全部去掉
    if (text) { // 如果去掉空格，text不为空
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }
  function end(tagName) { // 在结尾标签处 创建父子关系
    // console.log(tagName, '======结束标签======')
    // 结束的时候，将栈中最后一个拿出来，进行比较
    let element = stack.pop(); // 取出栈中最后一个
    currentParent = stack[stack.length - 1];
    if (currentParent){ // 在闭合时可以知道这个标签的父亲是谁
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

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
    if (textEnd >= 0) { // 是文本
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

  return root;
}