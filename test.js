let arr1 = [1, 5],
  arr2 = [2, 6],
  arr3 = [3, 7],
  arr4 = [4, 8];
let arr = [arr1, arr2, arr3, arr4];
let other = [];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
  if (i === 0) {
    other = arr[i];
  } else {
    other = [...other, ...arr[i]];
  }
  /*for (let j = 0; j < arr[i].length; j++) {
    console.log("i=", i, "j=", j);
    console.log(arr[]);
  }*/
}
console.log(other);