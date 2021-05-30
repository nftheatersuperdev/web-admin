import { Button, CardContent, Grid, Card, Typography } from '@material-ui/core'
import { useCars } from 'services/evme'
import PageToolbar from 'layout/PageToolbar'

export default function Car(): JSX.Element {
  const { isSuccess, data } = useCars()

  return (
    <div>
      <PageToolbar>
        <Button color="primary" variant="contained">
          New Car
        </Button>
      </PageToolbar>
      <Grid container spacing={3}>
        {isSuccess
          ? data?.edges.map(({ node }) => (
              <Grid item xs={4} key={node?.cars?.id}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      Brand: {node?.brand}
                    </Typography>
                    <Typography variant="h6">Mode: {node?.model}</Typography>
                    <Typography>Plate number: {node?.cars?.plateNumber}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : 'No Cars'}
      </Grid>
    </div>
  )
}
