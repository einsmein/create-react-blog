import React from 'react'
import { Link } from 'react-navi'
import siteMetadata from '../siteMetadata'
import ArticleSummary from './ArticleSummary'
import Pagination from './Pagination'
import styles from './BlogIndexPage.module.css'

function ArchiveIndexPage({ blogRoot, pageCount, pageNumber, postRoutes }) {
  return (
    <div>
      <ul className={styles.articlesList}>
        {postRoutes.map(route => (
          <li key={route.url.href}>
            <ArticleSummary blogRoot={blogRoot} route={route} />
          </li>
        ))}
      </ul>
      <footer className={styles.footer}>
      {pageCount > 1 && (
        <Pagination
          blogRoot={blogRoot}
          pageCount={pageCount}
          pageNumber={pageNumber}
        />
      )}
        <div>
          <a href="/rss.xml" target="_blank" style={{ float: 'right' }}>
            RSS
          </a>
          <Link href="/about">About</Link> &bull; <Link href="/tags">Tags</Link>{' '}
          &bull;{' '}
          <a href="https://github.com/frontarm/create-react-blog">Source</a>
        </div>
      </footer>
    </div>
  )
}

export default ArchiveIndexPage
