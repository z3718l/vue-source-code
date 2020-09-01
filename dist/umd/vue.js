(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 判断当前数据是不是对象
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  // 我们要重写数组的方法，一般是7个方法

  /**
   * push shift unshift pop reverse sort splice
   * 这些方法会导致数组本身发生变化，不会改变原数组的不需要重写
   */
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log('调用了push');

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // 再调用原生的方法
      // push unshift添加的元素可能还是一个对象，所以还要对这些对象进行监控

      var inserted; // 当前用户插入的元素

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      if (inserted) {
        // 将新增属性继续观测
        ob.observerArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue如果数据的层级过多，需要递归的去解析对象中的属性，依次增加set和get方法
      // proxy不需要一上来就进行递归，也不需要添加set和get方法，所以性能会有所提高
      // console.log(value, '=====')

      /**
       * 如果在这里不对数组进行处理，这里会对数组的索引监控，这样如果数组比较大的话，就会造成性能问题，所以我们会对数组方法进行重写
       */
      // value.__ob__ = this; // 给每一个监控过的对象都增加一个__ob__属性（作用：表示这个对象已经被监控）
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 如果是数组的话，不会对数组的索引进行监控
        // 对数组进行监控
        // 前端开发中，一般很少直接去操作索引，一般都是使用push unshift shift
        // 如果数组里面放的是对象，在进行监控
        value.__proto__ = arrayMethods;
        this.observerArray(value);
      } else {
        // 对对象进行监控
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        // [{}]
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        // 拿到用户传的对象数据 data => {name: 'zhangsan',age: 12}
        var keys = Object.keys(data); // [name, age]
        // for(let i = 0; i < keys.length; i ++) {
        //     let key = keys[i]; // key => name age(循环之后)
        //     let value = data[key]; // value => 'zhangsan' 12(循环之后)
        //     defineReactive(data, key, value); // 定义响应式数据
        // }
        // 优化for循环

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 使用defineProperty进行数据响应
    // 用户进行获取值、设置值得话就会在这里进行拦截
    observe(value); // 递归调用，如果value还是一个对象，就再走一遍new Observer（递归实现深度检测）
    // 添加了这个递归方法，无论是几层嵌套，都能把对象监测到

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(value); // 如果用户设置的是一个对象，继续进行劫持

        value = newValue;
      }
    });
  }

  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    new Observer(data); // 用来观测数据
  }

  function initState(vm) {
    var opts = vm.$options; // vue的数据来源，属性 方法 数据 计算属性 watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // 数据初始化工作
    var data = vm.$options.data; // 用户传递的数据

    /**
     * vm._data:为了用户可以方便拿到数据
     * 如果data是一个函数，就直接执行函数，并且把函数的this指向vm（vue的实例）
     * 如果不是函数，直接等于data
     */

    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    /**
     * 对象劫持 用户改变了数据，我们希望可以得到通知 ==》并且刷新页面数据
     * MVVM模式 数据变化了可以驱动视图变化
     * Object.defineProperty() 给属性增加get方法和set方法
     */

    observe(data); // 响应式原理
  }

  // ?: 匹配不捕获
  // arguments[0] = 匹配到的标签   arguments[1] = 匹配到的标签名字
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 匹配 abc-aaa (标签)

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:bb>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的 <div id=""></div>

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  function parseHTML(html) {
    // 创建ast节点
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        // 标签名
        type: 1,
        // 元素类型
        children: [],
        // 孩子列表
        attrs: attrs,
        // 属性集合
        parent: null // 父级

      };
    } // 处理开始标签


    var root;
    var currentParent;
    var stack = [];
    /**
     * 验证标签是否合法
     * 思路：使用栈 每截取一个标签，放入栈中，如果结束了，拿出栈中最后一个进行比较，
     * 如果相同，则表示标签合法，否则不合法，也就是出现这样的标签嵌套<div><p><span></p></div>
     * [div, p, span]
     */

    function start(tagName, attrs) {
      // console.log(tagName, attrs, '======开始标签======')
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 当前解析的标签 保存起来
      // 拿到的是开始的标签

      stack.push(element); // 将生产的ast元素放入栈中，因为标签名是没有parent属性的
    }

    function chars(text) {
      // console.log(text, '======文本标签======')
      text = text.replace(/\s/g, ''); // 正则匹配 将空格全部去掉

      if (text) {
        // 如果去掉空格，text不为空
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    function end(tagName) {
      // 在结尾标签处 创建父子关系
      // console.log(tagName, '======结束标签======')
      // 结束的时候，将栈中最后一个拿出来，进行比较
      var element = stack.pop(); // 取出栈中最后一个

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        // 在闭合时可以知道这个标签的父亲是谁
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    } // 不停的去解析html字符串


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 如果返回值为0，说明肯定是有一个标签：开始标签 结束标签
        var startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果  tagName attrs

        if (startTagMatch) {
          // console.log(startTagMatch) // 匹配到开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 如果开始标签匹配完毕后，继续下一次匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue; // 继续匹配
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        // 是文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text); // break;
      }
    }

    function advance(n) {
      // 截取匹配到的字符串
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        // console.log(start, '=====')
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 将匹配到的标签删除
        // console.log(html); // 这里的html应该就变少了

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 匹配标签上是否有属性
          // 将属性进行解析
          advance(attr[0].length); //将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // 去掉开始标签 >
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

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
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 语法层面的转义

  function genProps(attrs) {
    // 处理属性  
    // console.log(attrs)
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // 对样式进行特殊处理
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value));
    }

    return "{".concat(str.slice(0, -1), "}"); // 处理掉最后一个,
  }

  function gen(node) {
    // 判断node的nodetype
    if (node.type === 1) {
      // 元素类型
      return generate(node); // 生成元素节点的字符串
    } else {
      // 如果是文本
      var text = node.text; // 获取文本
      // 如果是普通文本 不带{{}}

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var tokens = []; // 存放每一段的代码

      var lastIndex = defaultTagRE.lastIndex = 0; // 如果正则是全局模式 需要每次使用前置为0

      var match, index; // 每次匹配到的结果

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // 保存匹配到的索引

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(el) {
    // 处理孩子元素
    var children = el.children;

    if (children) {
      // 如果有孩子元素
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function generate(el) {
    // console.log(el)
    var children = genChildren(el); // 获取孩子元素

    var code = "_c('".concat(el.tag, "', ").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  // ast语法树 是用对象来描述原生语法的 
  function compileToFunction(template) {
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
    var root = parseHTML(template); // 将html结构解析成语法树
    // 2）vue中的优化静态节点
    // console.log(root)
    // 3）

    var code = generate(root);
    console.log(code); // 4）限制取值范围 通过with来进行取值 稍后调用render函数 就可以通过改变this 让这个函数内部取到结果了

    var render = new Function("with(this){return ".concat(code, "}"));
    console.log(render); // return render; // 返回生成好的render方法
    // return function render() {
    // }
  } // 生成的render函数

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

  // 在原型上添加init方法
  function initMixin(Vue) {
    // vue初始化流程
    Vue.prototype._init = function (options) {
      // 1、数据的劫持
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm); // 如果用户传入了el属性，需要将页面渲染出来 并且要实现挂载流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      // console.log(el)
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 默认先会查找有没有render方法，没有render会采用template、如果template也没有，就要el中的内容

      if (!options.render) {
        // 如果不是render才会进行编译，如果是render函数 就不需要编译了；所以写render函数会提升vue的性能
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } // console.log(template, '===template')


        var render = compileToFunction(template);
        options.render = render; // 方便后续使用render方法
        // 需要将template转化成render方法 也就是将标签解析成ast语法树 
      }
    };
  }

  // 这里就是vue的核心代码

  function Vue(options) {
    // options接收vue实例中的所有方法和配置
    // 在这里进行vue的初始化操作
    // console.log(options);
    this._init(options);
  } // 通过引入的方式，给原型上添加方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
