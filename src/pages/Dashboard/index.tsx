import { useTranslation } from 'react-i18next'
import {
  Backdrop,
  Radio,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  RadioGroup,
  Typography,
  FormLabel,
  Card,
  CardContent,
} from '@mui/material'
import {
  CalendarMonth,
  SentimentDissatisfiedRounded,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  Smartphone,
  Tv,
  AddToQueue as AdditionalScreenIcon,
  Person,
  Group,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { ROUTE_PATHS } from 'routes'
import qs from 'qs'
import { useQuery } from 'react-query'
import { STORAGE_KEYS } from 'auth/AuthContext'
import ls from 'localstorage-slim'
import { DEFAULT_CHANGE_DATE_FORMAT, formatDateStringWithPattern } from 'utils'
import PageTitle from 'components/PageTitle'
import { ContentSection, Wrapper } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import { CardStatus, DetailLink } from 'components/CardStatus'
import { getNetflixDashboard, getYoutubeDashboard } from 'services/web-bff/dashboard'
import TabPane from 'components/TabPane'
import Tabs from 'components/Tabs'
import DatePicker from 'components/DatePicker'

export default function Dashboard(): JSX.Element {
  const useStyles = makeStyles({
    alignRight: {
      textAlign: 'right',
    },
    marginTop: {
      marginTop: '15px',
    },
    datePickerFromTo: {
      '&& .MuiOutlinedInput-input': {
        padding: '16.5px 14px',
      },
    },
    center: {
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    icon: {
      color: 'white',
      fontSize: '50px',
    },
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)
  const moduleAccount = ls.get<string | null | undefined>(STORAGE_KEYS.ACCOUNT) || 'ALL'
  const [netflixFilterDate, setNetflixFilterDate] = useState<string>('all')
  const [youtubeFilterDate, setYoutubeFilterDate] = useState<string>('all')
  const [showNetflixFilterDate, setShowNetflixFilterDate] = useState(false)
  const [showYoutubeFilterDate, setShowYoutubeFilterDate] = useState(false)
  const [selectedChangeDate, setSelectedChangeDate] = useState<Date>()
  const {
    data: netflixDashboardResponse,
    refetch: netflixRefetch,
    isFetching: isNetflixFetching,
  } = useQuery('dashboard-netflix', () => getNetflixDashboard(netflixFilterDate), {
    refetchOnWindowFocus: false,
    enabled: moduleAccount !== 'YOUTUBE',
  })
  const {
    data: youtubeDashboardResponse,
    refetch: youtubeRefetch,
    isFetching: isYoutubeFetching,
  } = useQuery('dashboard-youtube', () => getYoutubeDashboard(youtubeFilterDate), {
    refetchOnWindowFocus: false,
    enabled: moduleAccount !== 'NETFLIX',
  })
  const handleClose = () => {
    setOpen(false)
  }
  const netflixDashboard = netflixDashboardResponse?.data
  const youtubeDashboard = youtubeDashboardResponse?.data
  useEffect(() => {
    netflixRefetch()
    youtubeRefetch()
  }, [netflixFilterDate, netflixRefetch, youtubeFilterDate, youtubeRefetch])
  return (
    <Page>
      {isNetflixFetching || isYoutubeFetching ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ''
      )}
      <PageTitle title="ภาพรวม" />
      <Tabs preSelectedTabIndex={moduleAccount === 'ALL' || moduleAccount === 'NETFLIX' ? 0 : 1}>
        <TabPane title="Netflix" hideTab={moduleAccount === 'YOUTUBE'}>
          <Wrapper>
            <ContentSection>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Typography variant="h1" component="h1">
                    {t('netflix.mainInfo.changeDate')}
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12} className={classes.alignRight}>
                  <Typography variant="h4" component="h4" className={classes.marginTop}>
                    {'จำนวนบัญชีที่กำลังใช้งานทั้งหมด ' +
                      netflixDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'}
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันนี้ ' + netflixDashboard?.changeDateInfo.changeDateToday}
                    value={
                      netflixDashboard?.changeDateInfo.countToday +
                      '/' +
                      netflixDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="red"
                    bgColor="red"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({
                          changeDate: `${netflixDashboard?.changeDateInfo.changeDateToday}`,
                          isActive: true,
                        })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันพรุ่งนี้ ' + netflixDashboard?.changeDateInfo.changeDateTomorrow}
                    value={
                      netflixDashboard?.changeDateInfo.countTomorrow +
                      '/' +
                      netflixDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="#FFC100"
                    bgColor="yellow"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({
                          changeDate: `${netflixDashboard?.changeDateInfo.changeDateTomorrow}`,
                          isActive: true,
                        })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันที่ ' + netflixDashboard?.changeDateInfo.changeDateDayPlusTwo}
                    value={
                      netflixDashboard?.changeDateInfo.countDayPlusTwo +
                      '/' +
                      netflixDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="#008000"
                    bgColor="green"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({
                          changeDate: `${netflixDashboard?.changeDateInfo.changeDateDayPlusTwo}`,
                          isActive: true,
                        })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันที่ ' + netflixDashboard?.changeDateInfo.changeDateDayPlusThree}
                    value={
                      netflixDashboard?.changeDateInfo.countDayPlusThree +
                      '/' +
                      netflixDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="#000D80"
                    bgColor="blue"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({
                          changeDate: `${netflixDashboard?.changeDateInfo.changeDateDayPlusThree}`,
                          isActive: true,
                        })}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </ContentSection>
          </Wrapper>
          <Wrapper>
            <ContentSection>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Typography variant="h1" component="h1">
                    {t('netflix.user')}
                  </Typography>
                </Grid>
                <Grid item sm={3} xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel id="demo-row-radio-buttons-group-label">แสดงข้อมูล</FormLabel>
                    <FormGroup aria-label="position">
                      <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={showNetflixFilterDate}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          onClick={() => {
                            setShowNetflixFilterDate(false)
                            setNetflixFilterDate('all')
                          }}
                          label="ทั้งหมด"
                        />
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          onClick={() => {
                            setShowNetflixFilterDate(true)
                          }}
                          label="ระบุวัน"
                        />
                      </RadioGroup>
                    </FormGroup>
                  </FormControl>
                </Grid>
                {showNetflixFilterDate ? (
                  <Grid item sm={3} xs={12} className={classes.datePickerFromTo}>
                    <DatePicker
                      label="วันสลับ"
                      name="selectedChangeDate"
                      format={DEFAULT_CHANGE_DATE_FORMAT}
                      value={selectedChangeDate}
                      inputVariant="outlined"
                      onChange={(date) => {
                        date && setSelectedChangeDate(date.toDate())
                        setNetflixFilterDate(
                          formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                        )
                      }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={3} />
                )}
              </Grid>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Card>
                    <CardContent className={classes.center}>
                      <Grid container spacing={3} direction="column">
                        <Grid item>
                          <Person className={classes.icon} />
                        </Grid>
                        <Grid item>
                          <Typography color="white" gutterBottom variant="h6">
                            จำนวนลูกค้าที่ดึงวันนี้
                          </Typography>
                          <Typography color="white" variant="h5">
                            {netflixDashboard?.todayTransaction + ' คน'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Card>
                    <CardContent className={classes.center}>
                      <Grid container spacing={3} direction="column">
                        <Grid item>
                          <Group className={classes.icon} />
                        </Grid>
                        <Grid item>
                          <Typography color="white" gutterBottom variant="h6">
                            จำนวนลูกค้าที่กำลังใช้งานทั้งหมด
                          </Typography>
                          <Typography color="white" variant="h5">
                            {netflixDashboard?.customerInfo.totalActiveCustomer + ' คน'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-หมดอายุ"
                    value={
                      netflixDashboard?.customerInfo.countWaitingExpired +
                      '/' +
                      netflixDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentVeryDissatisfied />}
                    iconColor="red"
                    bgColor="red"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({ customerStatus: 'รอ-หมดอายุ', isActive: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-ทวงซ้ำ 2"
                    value={
                      netflixDashboard?.customerInfo.countWaitingAsk2Status +
                      '/' +
                      netflixDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentNeutral />}
                    iconColor="#FFC100"
                    bgColor="yellow"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({ customerStatus: 'รอ-ทวงซ้ำ 2', isActive: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-ทวงซ้ำ 1"
                    value={
                      netflixDashboard?.customerInfo.countWaitingAsk1Status +
                      '/' +
                      netflixDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentDissatisfiedRounded />}
                    iconColor="#008000"
                    bgColor="green"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({ customerStatus: 'รอ-ทวงซ้ำ 1', isActive: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-เรียกเก็บ"
                    value={
                      netflixDashboard?.customerInfo.countWaitingAskStatus +
                      '/' +
                      netflixDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentSatisfied />}
                    iconColor="#000d80"
                    bgColor="blue"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({ customerStatus: 'รอ-เรียกเก็บ', isActive: true })}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </ContentSection>
          </Wrapper>
          <Wrapper>
            <ContentSection>
              <Typography variant="h1" component="h1">
                จำนวนอุปกรณ์ที่ว่าง
              </Typography>
              <br />
              <Grid container spacing={3}>
                <Grid item sm={4} xs={12}>
                  <CardStatus
                    title="ทีวี"
                    value={
                      netflixDashboard?.deviceInfo.availableTV +
                      '/' +
                      netflixDashboard?.deviceInfo.totalTV
                    }
                    subTitle=""
                    icon={<Tv />}
                    iconColor="#008000"
                    bgColor="white"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({ isActive: true, filterTV: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <CardStatus
                    title="จอเสริม"
                    value={
                      netflixDashboard?.deviceInfo.availableAdditional +
                      '/' +
                      netflixDashboard?.deviceInfo.totalAdditional
                    }
                    subTitle=""
                    icon={<AdditionalScreenIcon />}
                    iconColor="#008000"
                    bgColor="white"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({ isActive: true, filterAdditional: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <CardStatus
                    title="อุปกรณ์อื่นๆ"
                    value={
                      netflixDashboard?.deviceInfo.availableOther +
                      '/' +
                      netflixDashboard?.deviceInfo.totalOther
                    }
                    subTitle=""
                    icon={<Smartphone />}
                    iconColor="#008000"
                    bgColor="white"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.NETFLIX}
                        search={qs.stringify({ isActive: true, filterOther: true })}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </ContentSection>
          </Wrapper>
        </TabPane>
        <TabPane title="Youtube" hideTab={moduleAccount === 'NETFLIX'}>
          <Wrapper>
            <ContentSection>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Typography variant="h1" component="h1">
                    {t('netflix.mainInfo.changeDate')}
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12} className={classes.alignRight}>
                  <Typography variant="h4" component="h4" className={classes.marginTop}>
                    {'จำนวนบัญชีที่กำลังใช้งานทั้งหมด ' +
                      youtubeDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'}
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันนี้ ' + youtubeDashboard?.changeDateInfo.changeDateToday}
                    value={
                      youtubeDashboard?.changeDateInfo.countToday +
                      '/' +
                      youtubeDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="red"
                    bgColor="red"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({
                          changeDate: `${youtubeDashboard?.changeDateInfo.changeDateToday}`,
                        })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันพรุ่งนี้ ' + youtubeDashboard?.changeDateInfo.changeDateTomorrow}
                    value={
                      youtubeDashboard?.changeDateInfo.countTomorrow +
                      '/' +
                      youtubeDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="#FFC100"
                    bgColor="yellow"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({
                          changeDate: `${youtubeDashboard?.changeDateInfo.changeDateTomorrow}`,
                        })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันที่ ' + youtubeDashboard?.changeDateInfo.changeDateDayPlusTwo}
                    value={
                      youtubeDashboard?.changeDateInfo.countDayPlusTwo +
                      '/' +
                      youtubeDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="#008000"
                    bgColor="green"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({
                          changeDate: `${youtubeDashboard?.changeDateInfo.changeDateDayPlusTwo}`,
                        })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title={'วันที่ ' + youtubeDashboard?.changeDateInfo.changeDateDayPlusThree}
                    value={
                      youtubeDashboard?.changeDateInfo.countDayPlusThree +
                      '/' +
                      youtubeDashboard?.changeDateInfo.totalAccount +
                      ' บัญชี'
                    }
                    subTitle=""
                    icon={<CalendarMonth />}
                    iconColor="#000D80"
                    bgColor="blue"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({
                          changeDate: `${youtubeDashboard?.changeDateInfo.changeDateDayPlusThree}`,
                        })}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </ContentSection>
          </Wrapper>
          <Wrapper>
            <ContentSection>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Typography variant="h1" component="h1">
                    {t('youtube.user')}
                  </Typography>
                </Grid>
                <Grid item sm={3} xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel id="youtube-row-radio-buttons-group-label">แสดงข้อมูล</FormLabel>
                    <FormGroup aria-label="position">
                      <RadioGroup
                        row
                        aria-labelledby="youtube-radio-buttons-group-label"
                        defaultValue={showYoutubeFilterDate}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          onClick={() => {
                            setShowYoutubeFilterDate(false)
                            setYoutubeFilterDate('all')
                          }}
                          label="ทั้งหมด"
                        />
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          onClick={() => {
                            setShowYoutubeFilterDate(true)
                          }}
                          label="ระบุวัน"
                        />
                      </RadioGroup>
                    </FormGroup>
                  </FormControl>
                </Grid>
                {showYoutubeFilterDate ? (
                  <Grid item xs={12} sm={3} className={classes.datePickerFromTo}>
                    <DatePicker
                      label="วันสลับ"
                      name="selectedChangeDate"
                      format={DEFAULT_CHANGE_DATE_FORMAT}
                      value={selectedChangeDate}
                      inputVariant="outlined"
                      onChange={(date) => {
                        date && setSelectedChangeDate(date.toDate())
                        setYoutubeFilterDate(
                          formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                        )
                      }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={3} />
                )}
              </Grid>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Card>
                    <CardContent className={classes.center}>
                      <Grid container spacing={3} direction="column">
                        <Grid item>
                          <Person className={classes.icon} />
                        </Grid>
                        <Grid item>
                          <Typography color="white" gutterBottom variant="h6">
                            จำนวนลูกค้าที่ดึงวันนี้
                          </Typography>
                          <Typography color="white" variant="h5">
                            {youtubeDashboard?.todayTransaction + ' คน'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Card>
                    <CardContent className={classes.center}>
                      <Grid container spacing={3} direction="column">
                        <Grid item>
                          <Group className={classes.icon} />
                        </Grid>
                        <Grid item>
                          <Typography color="white" gutterBottom variant="h6">
                            จำนวนลูกค้าที่กำลังใช้งานทั้งหมด
                          </Typography>
                          <Typography color="white" variant="h5">
                            {youtubeDashboard?.customerInfo.totalActiveCustomer + ' คน'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-หมดอายุ"
                    value={
                      youtubeDashboard?.customerInfo.countWaitingExpired +
                      '/' +
                      youtubeDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentVeryDissatisfied />}
                    iconColor="red"
                    bgColor="red"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({ customerStatus: 'รอ-หมดอายุ', isActive: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-ทวงซ้ำ 2"
                    value={
                      youtubeDashboard?.customerInfo.countWaitingAsk2Status +
                      '/' +
                      youtubeDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentNeutral />}
                    iconColor="#FFC100"
                    bgColor="yellow"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({ customerStatus: 'รอ-ทวงซ้ำ 2', isActive: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-ทวงซ้ำ 1"
                    value={
                      youtubeDashboard?.customerInfo.countWaitingAsk1Status +
                      '/' +
                      youtubeDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentDissatisfiedRounded />}
                    iconColor="#008000"
                    bgColor="green"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({ customerStatus: 'รอ-ทวงซ้ำ 1', isActive: true })}
                      />
                    }
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <CardStatus
                    title="รอ-เรียกเก็บ"
                    value={
                      youtubeDashboard?.customerInfo.countWaitingAskStatus +
                      '/' +
                      youtubeDashboard?.customerInfo.totalCustomer +
                      ' คน'
                    }
                    subTitle=""
                    icon={<SentimentSatisfied />}
                    iconColor="#000d80"
                    bgColor="blue"
                    detailLink={
                      <DetailLink
                        pathname={ROUTE_PATHS.YOUTUBE}
                        search={qs.stringify({ customerStatus: 'รอ-เรียกเก็บ', isActive: true })}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </ContentSection>
          </Wrapper>
        </TabPane>
      </Tabs>
    </Page>
  )
}
