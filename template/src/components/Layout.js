import React from 'react'
import {
  View,
  Link,
  NotFoundBoundary,
  useLoadingRoute,
} from 'react-navi'
import Grid from '@material-ui/core/Grid'
import siteMetadata from '../siteMetadata'
import NotFoundPage from './NotFoundPage'
import LoadingIndicator from './LoadingIndicator'
import Box from '@material-ui/core/Box'
import Header from './Header'
import styles from './Layout.module.css'

function Layout(props) {
  let loadingRoute = useLoadingRoute()

  return (
      <Grid container>

        <Grid 
          xs={12} sm={3} md={2} 
          className={`
          ${styles.Menu}
          ${props.className || ''}
        `}>
          {props.paths.map(
            path => (  
              <Box className={styles.Box}>
                <Link href={props.root + path}>{path.toUpperCase()}</Link>
              </Box>
          ))}

        </Grid>

        <Grid xs={12} sm={9} md={10} className={styles.container}>
          <LoadingIndicator active={!!loadingRoute} />
          <main>
            <NotFoundBoundary render={() => <NotFoundPage />}>
              <View />
            </NotFoundBoundary>
          </main>
        </Grid>

      </Grid>
  )
}

export default Layout
