/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import styled from 'styled-components'
import { AppBar, Box, Breadcrumbs, Button, Card, Typography, Tab, Tabs } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { Page } from 'layout/LayoutRoute'
import PageToolbar from 'layout/PageToolbar'
import { useUserGroup } from 'services/evme'
import InviteDialog from './InviteDialog'
import GroupInviteDialog from './GroupInviteDialog'
import UploadCSVDialog from './UploadCSVDialog'
import UsersTab from './UsersTab'
import WhitelistsTab from './WhitelistsTab'

interface UserGroupUsersParams {
  ugid: string
}

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

const MarginBottom = styled.div`
  margin-bottom: 20px;
`
const ButtonSpace = styled(Button)`
  margin-left: 10px;
`
const ButtonHidden = styled(Button)`
  display: none;
`

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function UserGroupUsers(): JSX.Element {
  const { ugid } = useParams<UserGroupUsersParams>()
  const { t } = useTranslation()

  const [tabIndex, setTabIndex] = useState<number>(0)
  const [openInviteDialog, setOpenInviteDialog] = useState<boolean>(false)
  const [openGroupInviteDialog, setOpenGroupInviteDialog] = useState<boolean>(false)
  const [openUploadCSVDialog, setOpenUploadCSVDialog] = useState<boolean>(false)
  const [refetchData, setRefetchData] = useState<boolean>(false)

  const { data: userGroup } = useUserGroup(ugid)

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <Page>
      <PageToolbar>
        <div>
          <ButtonSpace
            color="primary"
            variant="contained"
            onClick={() => setOpenUploadCSVDialog(true)}
          >
            {t('userGroups.dialog.csvUpload.button')}
          </ButtonSpace>
          <ButtonHidden
            color="primary"
            variant="contained"
            onClick={() => setOpenInviteDialog(true)}
          >
            {t('userGroups.dialog.invitation.button')}
          </ButtonHidden>
          <ButtonSpace
            color="primary"
            variant="contained"
            onClick={() => setOpenGroupInviteDialog(true)}
          >
            {t('userGroups.dialog.invitation.multipleUsersButton')}
          </ButtonSpace>
        </div>
      </PageToolbar>

      <MarginBottom>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <Link color="textPrimary" to="/user-groups">
            {t('userGroups.title')}
          </Link>
          <Typography>{userGroup?.name}</Typography>
        </Breadcrumbs>
      </MarginBottom>

      <Card>
        <AppBar position="static" color="default">
          <Tabs
            aria-label="users list pages"
            value={tabIndex}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={t('whitelist.tabs.registeredUsers')} {...a11yProps(0)} />
            <Tab label={t('whitelist.tabs.nonRegisteredUsers')} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index={0}>
          <UsersTab ugid={ugid} refetchData={refetchData} setRefetchData={setRefetchData} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <WhitelistsTab ugid={ugid} refetchData={refetchData} setRefetchData={setRefetchData} />
        </TabPanel>
      </Card>

      <GroupInviteDialog
        userGroupId={ugid}
        open={openGroupInviteDialog}
        onClose={() => {
          setOpenGroupInviteDialog(false)
          setRefetchData(true)
        }}
      />

      <InviteDialog
        userGroupId={ugid}
        open={openInviteDialog}
        onClose={(goTabIndex) => {
          setTabIndex(goTabIndex)
          setOpenInviteDialog(false)
          setRefetchData(true)
        }}
        currentTabIndex={tabIndex}
      />

      <UploadCSVDialog
        userGroupId={ugid}
        open={openUploadCSVDialog}
        onClose={() => {
          setTabIndex(tabIndex)
          setOpenUploadCSVDialog(false)
          setRefetchData(true)
        }}
      />
    </Page>
  )
}
