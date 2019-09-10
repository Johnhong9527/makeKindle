let arr1 = [1, 5],
  arr2 = [2, 6],
  arr3 = [3, 7],
  arr4 = [4, 8];
let arr = [arr1, arr2, arr3, arr4];
let other = [];
for(let j = 0;j<2;j++){
  for (let i = 0; i < arr.length; i++) {
    // other[0].push(arr[0][0])
    other.push(arr[i][j])
  }
}

console.log(other);