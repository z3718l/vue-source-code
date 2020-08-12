// 把data中的数据 都使用Object.defineProperty重新定义
// Object.defineProperty 兼容性不好，不能兼容ie8及以下
export function observe(data) {
    console.log(data, '===observe')
}