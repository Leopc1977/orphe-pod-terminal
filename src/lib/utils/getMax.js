export default function getMax(arr, cmpCb=(el)=>el) {
    let len = arr.length;
    let max = -Infinity;

    while (len--) {
        const val = cmpCb(arr[len])
        max = val > max ? val : max;
    }
    return max;
}
