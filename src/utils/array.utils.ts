export const groupArrayBy = <T = unknown[]>(
  arr: T[],
  groupByNumber: number
) => {
  let groupedArr: T[][] = [];
  const iterationsCount = Math.ceil(arr.length / groupByNumber);
  for (let index = 0; index < iterationsCount; index++) {
    groupedArr.push([...arr.slice(index * groupByNumber, groupByNumber)]);
  }
  return groupedArr;
};
