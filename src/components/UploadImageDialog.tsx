// import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'

const useStyles = makeStyles({
  button: {
    '&:hover': {
      backgroundColor: '#FFFFFF',
      color: '#0077FF',
    },
    '&:active': {
      backgroundColor: '#FFFFFF',
      color: '#0077FF',
    },
  },
  alignLeft: {
    justifyContent: 'space-between',
  },
  input: {
    display: 'none',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
})

interface Props {
  visible: boolean
  onClose: (refetch?: boolean) => void
}

const SpaceButtons = styled.div`
  padding: 15px;

  & button {
    margin-right: 15px;
  }
`

export default function ActivityScheduleDialog({ visible, onClose }: Props): JSX.Element {
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const classes = useStyles()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  //   const [state, setState] = useState<DataState>(defaultState)

  //   useEffect(() => {}, [visible])
  const handleOnClose = () => {
    onClose()
  }
  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0]
    const fileTypes = 'image/png'
    const maxSize = 1 * 1024 * 1024 // 1MB
    if (selectedImage && fileTypes.includes(selectedImage.type)) {
      if (selectedImage.size > maxSize) {
        setError('File size cannot exceed 1MB.')
      } else {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 10
          setUploadProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            setUploadProgress(0)
          }
        }, 100)
        setImage(selectedImage)
        setIsLoading(true)
        setError('')
      }
    } else {
      setError('valid PNG image.')
    }
  }
  const handleImageUpload = () => {
    // handleImageChange(event)
    console.log(image)
    console.log(error)
  }
  return (
    <div>
      <Dialog
        open={visible}
        onClose={handleOnClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">
          {t('newSubcription.dialog.imageUpload.title')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Grid container justifyContent="center">
                <Card variant="outlined">
                  <CardContent
                    sx={{
                      width: 320,
                      height: 320,
                      display: 'flex',
                      position: 'relative',
                      justifyContent: 'center',
                    }}
                  >
                    {isLoading && (
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CircularProgress variant="determinate" value={uploadProgress} />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            component="div"
                            color="text.secondary"
                          >{`${Math.round(uploadProgress)}%`}</Typography>
                        </Box>
                      </Box>
                    )}
                    {!isLoading && (
                      <Button component="label" className={classes.button}>
                        <UploadFileOutlinedIcon
                          sx={{
                            fontSize: 20,
                            color: '#BDBDBD',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                        <input
                          hidden
                          accept="image/*"
                          multiple
                          type="file"
                          onChange={handleImageChange}
                        />
                      </Button>
                    )}
                    {/* <Button variant="contained" onClick={handleImageUpload}>
                      Submit
                    </Button> */}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="caption" color="#BDBDBD">
            *The file type must be .png / dimension 750pixels x 750pixels (1:1) / Maximum upload
            size 1MB
          </Typography>
        </DialogContent>
        <DialogActions className={classes.alignLeft}>
          <SpaceButtons>
            <Button
              onClick={handleImageUpload}
              variant="contained"
              color="primary"
              //   disabled={image}
            >
              {t('button.confirm')}
            </Button>
            <Button onClick={handleOnClose} variant="outlined" color="primary">
              {t('button.cancel')}
            </Button>
          </SpaceButtons>
        </DialogActions>
      </Dialog>
    </div>
  )
}
