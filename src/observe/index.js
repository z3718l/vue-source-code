// 把data中的数据 都使用Object.defineProperty重新定义
// Object.defineProperty 兼容性不好，不能兼容ie8及以下
import { isObject, def } from '../util/index'
import { arrayMethods } from './array.js'
class Observer {
    constructor(value) {
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
    observerArray(value) { // [{}]
        for(let i = 0; i < value.length; i ++) {
            observe(value[i]);
        }
    }
    walk(data) {
        // 拿到用户传的对象数据 data => {name: 'zhangsan',age: 12}
        let keys = Object.keys(data); // [name, age]
        // for(let i = 0; i < keys.length; i ++) {
        //     let key = keys[i]; // key => name age(循环之后)
        //     let value = data[key]; // value => 'zhangsan' 12(循环之后)
        //     defineReactive(data, key, value); // 定义响应式数据
        // }
        // 优化for循环
        keys.forEach((key) => {
            defineReactive(data, key, data[key]);
        })
    }
}

function defineReactive(data, key, value) {
    // 使用defineProperty进行数据响应
    // 用户进行获取值、设置值得话就会在这里进行拦截
    observe(value); // 递归调用，如果value还是一个对象，就再走一遍new Observer（递归实现深度检测）
    // 添加了这个递归方法，无论是几层嵌套，都能把对象监测到
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newValue) {
            if(newValue === value) return;
            observe(value); // 如果用户设置的是一个对象，继续进行劫持
            value = newValue
        }
    })
}

export function observe(data) {
    let isObj = isObject(data)
    if(!isObj) {
        return;
    }
    new Observer(data); // 用来观测数据
}