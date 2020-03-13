import importAll from 'import-all.macro'
import * as Navi from 'navi'
import { join } from 'path'
import { sortBy } from 'lodash'
import slugify from 'slugify'

import React from 'react'
import { chunk, fromPairs } from 'lodash'
import siteMetadata from '../../siteMetadata'
import routes from '..'
import ArchiveIndexPage from '../../components/ArchiveIndexPage'


// Get a list of all posts, that will not be loaded until the user
// requests them.
const postModules = importAll.deferred('./**/post.js')
const importPost = pathname => postModules[pathname]()
const postPathnames = Object.keys(postModules)
const datePattern = /^((\d{1,4})-(\d{1,4})-(\d{1,4}))[/-]/

let postDetails = postPathnames.map(pathname => {
  let slug = slugify(
    pathname.replace(/post.jsx?$/, '').replace(/(\d)\/(\d)/, '$1-$2'),
  )
    .replace(/^[-.]+|[.-]+$/g, '')
    .replace(datePattern, '$1/')

  let date
  let dateMatch = slug.match(datePattern)
  if (dateMatch) {
    date = new Date(dateMatch[2], parseInt(dateMatch[3]) - 1, dateMatch[4])
  }

  return {
    slug,
    pathname,
    date,
  }
})

// Sort the pages by slug (which contain the dates)
postDetails = sortBy(postDetails, ['slug']).reverse()

// Create url-friendly slugs from post pathnames, and a `getPage()` function
// that can be used to load and return the post's Page object.
export let posts = postDetails.map(({ slug, pathname, date }, i) => ({
  getPage: Navi.map(async () => {
    let { default: post } = await importPost(pathname)
    let { title, getContent, ...meta } = post
    let previousSlug, previousPost, nextSlug, nextPost

    if (i !== 0) {
      let previousPostDetails = postDetails[i - 1]
      previousPost = (await importPost(previousPostDetails.pathname)).default
      previousSlug = previousPostDetails.slug
    }

    if (i + 1 < postDetails.length) {
      let nextPostDetails = postDetails[i + 1]
      nextPost = (await importPost(nextPostDetails.pathname)).default
      nextSlug = nextPostDetails.slug
    }

    return Navi.route({
      title,
      getData: (req, context) => ({
        date,
        pathname,
        slug,
        previousDetails: previousPost && {
          title: previousPost.title,
          href: join(context.archiveRoot, 'posts', previousSlug),
        },
        nextDetails: nextPost && {
          title: nextPost.title,
          href: join(context.archiveRoot, 'posts', nextSlug),
        },
        ...meta,
      }),
      getView: async () => {
        let { default: MDXComponent, ...other } = await getContent()
        return { MDXComponent, ...other }
      },
    })
  }),
  slug,
}))

// Split the posts into a list of chunks of the given size, and
// then build index pages for each chunk.
// [['/1', <route with view for index page 1>], 
//  ['/2', <route with view for index page 2>], ...]
let chunks = chunk(posts, siteMetadata.indexPageSize)
export let chunkPagePairs = chunks.map((chunk, i) => [
  '/' + (i + 1),
  Navi.map(async (req, context) => {
    // Don't load anything when just crawling
    if (req.method === 'HEAD') {
      return Navi.route()
    }

    // Get metadata for all pages on this page
    let postRoutes = await Promise.all(
      chunk.map(async post => {
        let href = join(context.archiveRoot, 'posts', post.slug)
        return await Navi.resolve({
          // If you want to show the page content on the index page, set
          // this to 'GET' to be able to access it.
          method: 'HEAD',
          routes,
          url: href,
        })
      }),
    )

    // Only add a page number to the page title after the first index page.
    let pageTitle = siteMetadata.title
    if (i > 0) {
      pageTitle += ` – page ${i + 1}`
    }

    return Navi.route({
      title: pageTitle,
      view: (
        <ArchiveIndexPage
          blogRoot={context.archiveRoot}
          pageNumber={i + 1}
          pageCount={chunks.length}
          postRoutes={postRoutes}
        />
      ),
    })
  }),
])
