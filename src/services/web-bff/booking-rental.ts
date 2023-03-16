// import { AdminBffAPI } from 'api/admin-bff'
import {} from 'services/web-bff/booking-rental'

// export const getList = async ({
//   filter,
//   sort,
//   size = 10,
//   page = 0,
// }: CarListFilterRequestProps): Promise<CarListBffResponse> => {
//   const pageIndex = page + 1
//   const response: CarListBffResponse = await AdminBffAPI.get('/v2/bookings/rental/search', {
//     params: {
//       ...filter,
//       ...sort,
//       pageIndex,
//       size,
//     },
//   }).then((response) => response.data)

//   return response
// }

export const getList = (): boolean => {
  return true
}

export default {
  getList,
}
