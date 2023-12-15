// Knuth洗牌算法，用于打乱数组顺序，常用于生成随机排列。
export function shuffle(source) {
  // 对原数组进行浅拷贝
  const arr = source.slice()

  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }

  return arr
}

function getRandomInt(max) {
  // random 是左闭右开，需要 max+1 来取到最右边的数，生成的随机数向下取整，得到整数。
  return Math.floor(Math.random() * (max + 1))
}

function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
