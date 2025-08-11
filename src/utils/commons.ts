//chuyển từ enum trả về dạng mảng giá trị number
export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}
