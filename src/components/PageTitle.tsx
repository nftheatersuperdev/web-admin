import { Breadcrumbs, Divider, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Fragment } from 'react'

interface PageTitleProps {
  title: string
  breadcrumbs?: PageBreadcrumbs[]
}
export interface PageBreadcrumbs {
  text: string
  link: string
}

const BreadcrumbsCustom = styled(Breadcrumbs)`
  margin: 10px 0;
`
const DividerCustom = styled(Divider)`
  margin: 10px 0;
`

export default function PageTitle({ title, breadcrumbs }: PageTitleProps): JSX.Element {
  const breadcrumbLength = breadcrumbs?.length || null

  return (
    <Fragment>
      <Typography variant="h5" component="h1">
        {title}
      </Typography>
      {breadcrumbs && breadcrumbs.length >= 1 ? (
        <BreadcrumbsCustom aria-label="breadcrumb">
          {breadcrumbs.map(({ text, link }, index) => {
            if (breadcrumbLength && breadcrumbLength - 1 === index) {
              return <Typography color="textPrimary">{text}</Typography>
            }
            return (
              <Link key={`breadcrumb-key-${link}`} to={link}>
                {text}
              </Link>
            )
          })}
        </BreadcrumbsCustom>
      ) : (
        ''
      )}
      <DividerCustom />
    </Fragment>
  )
}
