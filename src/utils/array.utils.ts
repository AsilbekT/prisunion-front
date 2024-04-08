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

export const cloneArrayTimes = <T = unknown>(arr: T[], times: number) => {
  const newArray: T[] = [];
  for (let index = 0; index < times; index++) {
    newArray.push(...arr);
  }
  return newArray;
};
