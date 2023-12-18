import storage from 'good-storage'

function insertArray(val, arr, compare, maxLen) {
  const idx = arr.findIndex(compare)
  // 该元素存在，则不添加
  if (idx > -1) { return }
  // 添加到数组头部
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

/**
 * 保存 val 到 storage
 * @param key
 * @param val
 * @param compare
 * @returns {*}
 */
export function save(key, val, compare, maxLen) {
  const list = storage.get(key, [])
  insertArray(val, list, compare, maxLen)
  storage.set(key, list)
  return list
}

function deleteFromArray(arr, compare) {
  const idx = arr.findIndex(compare)
  if (idx > -1) {
    // 该元素存在则移除，该方法会影响原先 arr 数组
    arr.splice(idx, 1)
  }
}

/**
 * 根据指定的规则，移除元素
 * @param key
 * @param compare
 */
export function remove(key, compare) {
  const list = storage.get(key, [])
  deleteFromArray(list, compare)
  storage.set(key, list)
  return list
}

export function load(key) {
  return storage.get(key, [])
}
