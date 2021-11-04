import { Typography } from '@material-ui/core'
import { Editor } from '@tinymce/tinymce-react'
import styled from 'styled-components'
import './HTMLEditor.css'

const MarginButtom = styled.div`
  margin-bottom: 10px;
`

interface HTMLEditorProp {
  id: string
  label: string
  disabled?: boolean
  initialValue?: string
  handleOnEditChange: (value: string) => void
}

export default function HTMLEditor({
  id,
  label,
  disabled,
  initialValue,
  handleOnEditChange,
}: HTMLEditorProp): JSX.Element {
  const plugins = 'lists'
  const init = {
    menubar: false,
    statusbar: false,
    plugins: [],
    toolbar: 'bold italic underline forecolor bullist numlist',
  }

  return (
    <MarginButtom>
      <Typography variant="caption">{label}</Typography>
      <Editor
        id={id}
        init={init}
        initialValue={initialValue}
        plugins={plugins}
        onEditorChange={handleOnEditChange}
        disabled={disabled}
      />
    </MarginButtom>
  )
}
