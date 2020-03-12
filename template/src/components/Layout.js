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
import Menu from './Menu'
import Header from './Header'
import styles from './Layout.module.css'

function Layout({ blogRoot, isViewingIndex }) {
  let loadingRoute = useLoadingRoute()

  return (
        <Grid xs={12} sm={9} md={10} className={styles.container}>
          <LoadingIndicator active={!!loadingRoute} />
    
          {// Don't show the header on index pages, as it has a special header.
          // !isViewingIndex && (
          //   <header>
          //     <h3 className={styles.title}>
          //       <Link href={blogRoot}>{siteMetadata.title}</Link>
          //     </h3>
          //   </header>
          //)
          }
    
          <main>
            <NotFoundBoundary render={() => <NotFoundPage />}>
              <View />
            </NotFoundBoundary>
          </main>
        </Grid>
  )
}

export default Layout
