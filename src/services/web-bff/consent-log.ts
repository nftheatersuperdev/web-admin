import { ConsentLogListProps, ConsentLogListResponse } from './consent-log.type'

/*export const getList = async ({
 email,
 isAccepted,
 codeName,
 size = 10,
 pageIndex = 1,
}: ConsentLogListProps): Promise<ConsentLogListResponse> => {
 const response: ConsentLogListResponse = await BaseApi.get(
   '/0d093f35-d8b0-43d7-a8dc-d11bc6e14541',
   {
     params: {
       email,
       isAccepted,
       codeName,
       pageIndex,
       size,
     },
   }
 ).then((response) => response.data)
 return response
}*/
export const getList = async ({}: ConsentLogListProps): Promise<ConsentLogListResponse> => {
  const response: ConsentLogListResponse = await {
    status: 'success',
    data: {
      agreements: [],
      pagination: {
        totalRecords: 0,
        size: 10,
        totalPage: 1,
        page: 1,
      },
    },
  }
  return response
}
