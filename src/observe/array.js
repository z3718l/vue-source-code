
// 我们要重写数组的方法，一般是7个方法
/**
 * push shift unshift pop reverse sort splice
 * 这些方法会导致数组本身发生变化，不会改变原数组的不需要重写
 */
let oldArrayMethods = Array.prototype;
export const arrayMethods = Object.create(oldArrayMethods);
const methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice'
]
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('调用了push')
        const result = oldArrayMethods[method].apply(this, args); // 再调用原生的方法

        // push unshift添加的元素可能还是一个对象，所以还要对这些对象进行监控
        let inserted; // 当前用户插入的元素
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;
        }

        if (inserted) {
            // 将新增属性继续观测
            ob.observerArray(inserted);
        }

        return result;
    }
})
