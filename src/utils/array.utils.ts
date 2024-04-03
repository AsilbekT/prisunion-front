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

export const filterDuplicatesBy = <T extends object>(
  array: T[],
  prop: keyof T
) => {
  return Array.from(new Map(array.map((item) => [item[prop], item])).values());
};
