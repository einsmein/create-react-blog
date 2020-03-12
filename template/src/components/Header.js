import React from 'react'
import { Link } from 'react-navi'
import siteMetadata from '../siteMetadata'
import styles from './Header.module.css'

function Header({ root }) {
  return (
    <div>
      <header>
        <h1 className={styles.title}>
          <Link href={root}><b>einsmein</b> [ {siteMetadata.title} ]</Link>
        </h1>
      </header>
    </div>
  )
}

export default Header
