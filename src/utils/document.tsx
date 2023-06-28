export interface DocumentVersionsParams {
  documentCode: string
}

export interface DocumentVersionsEditParams {
  documentCode: string
  version: string
}

export const defaultDocumentOverview = {
  id: '',
  codeName: '',
  nameEn: '',
  nameTh: '',
  contentEn: '',
  contentTh: '',
  version: '',
}
