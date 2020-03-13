import {
  compose,
  lazy,
  map,
  mount,
  redirect,
  resolve,
  route,
  withContext,
  withView,
} from 'navi'
import React from 'react'
import { join } from 'path'
import { chunk, fromPairs } from 'lodash'
import Grid from '@material-ui/core/Grid'
import BlogIndexPage from '../components/BlogIndexPage'
import Layout from '../components/Layout'
import Header from '../components/Header'
import BlogPostLayout from '../components/BlogPostLayout'
import siteMetadata from '../siteMetadata'
import { chunkPagePairs as postPairs, posts } from './posts'


const paths = [ 'about', 'archive', 'tech', 'blog' ]

const routes = compose(
  withContext((req, context) => ({
    ...context,
    archiveRoot: req.mountpath + 'archive' || '/archive',
  })),
  withView((req, context) => {
    // Check if the current page is an index page by comparing the remaining
    // portion of the URL's pathname with the index page paths.
    let isViewingIndex = req.path === '/' || /^\/page\/\d+$/.test(req.path)

    // Render the application-wide layout
    return (
      <div>
        <Header root='/' />
        <Layout root='/' paths={paths}/>
      </div>
    )
  }),
  mount({
    // The blog's index pages go here. The first index page is mapped to the
    // root URL, with a redirect from "/page/1". Subsequent index pages are
    // mapped to "/page/n".

    '/': lazy(() => import('./tech')),
    '/archive': postPairs.shift()[1],
    '/archive/page': mount({
      '/1': redirect((req, context) => context.archiveRoot),
      ...fromPairs(postPairs),
    }),

    // Put posts under "/posts", so that they can be wrapped with a
    // "<BlogPostLayout />" that configures MDX and adds a post-specific layout.
    '/archive/posts': compose(
      withView((req, context) => (
        <BlogPostLayout blogRoot={context.archiveRoot} />
      )),
      mount(fromPairs(posts.map(post => ['/' + post.slug, post.getPage]))),
    ),

    // Miscellaneous pages can be added directly to the root switch.
    '/tags': lazy(() => import('./tags')),
    '/about': lazy(() => import('./about')),
    '/tech': lazy(() => import('./tech')),

    // Only the statically built copy of the RSS feed is intended to be opened,
    // but the route is defined here so that the static renderer will pick it
    // up.
    '/rss': route(),
  }),
)

export default routes
