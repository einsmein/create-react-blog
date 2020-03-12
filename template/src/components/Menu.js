import React from 'react'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import styles from './Menu.module.css'
import { getGravatarURL } from '../utils/getGravatarURL'

function Menu(props) {
  let photoURL = getGravatarURL({
    email: "test1@example.com",
    size: 56,
  })

  return (
    <Grid 
      xs={12} sm={3} md={2} 
      className={`
      ${styles.Menu}
      ${props.className || ''}
    `}>
      <Box className={styles.Box}><Link href='/abou'>ABOUT</Link></Box>
      <Box className={styles.Box}><Link>TECH</Link></Box>
      <Box className={styles.Box}><Link>ART</Link></Box>
      <Box className={styles.Box}><Link>BLOG</Link></Box>
    </Grid>
  )
}

export default Menu
