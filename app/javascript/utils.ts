import dayjs from 'dayjs'

export const dateToKey = (date: Date) => dayjs(date).format('YYYY-MM-DD')
