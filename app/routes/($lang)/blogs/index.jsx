import {json} from '@shopify/remix-oxygen';
import {useLoaderData, useFetcher} from '@remix-run/react';
import {flattenConnection, Image} from '@shopify/hydrogen';
import {Grid, PageHeader, Section, Link, Button} from '~/components';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import blog1 from '../../../images/blog1.png';
import {useState, useEffect} from 'react';

const BLOG_HANDLE = 'vinglace';

export const handle = {
  seo: {
    title: 'vinglace',
  },
};

export const loader = async ({request, context: {storefront}}) => {
  const {language, country} = storefront.i18n;
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');
  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      cursor,
      pageBy: cursor ? 9 : 10,
      language,
    },
  });

  if (!blog?.articles) {
    // throw new Response('Not found', {status: 404});
    console.log('searchParams', searchParams);
    console.log('cursor', cursor);
  }

  const article = flattenConnection(blog?.articles).map((article) => {
    const {publishedAt} = article;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt)),
    };
  });

  return json(
    {blog, article, country, language},
    {
      headers: {
        // TODO cacheLong()
      },
    },
  );
};

export const meta = () => {
  return {
    title: 'All Blogs',
  };
};

export default function Blogs() {
  const {article, blog, language, country} = useLoaderData();
  const [articles, setArticles] = useState(article);
  const [firstItem, ...remainingItems] = articles;
  const [nextPage, setNextPage] = useState(
    blog?.articles?.pageInfo?.hasNextPage,
  );
  const [endCursor, setEndCursor] = useState(
    blog?.articles?.pageInfo?.endCursor,
  );
  console.log('articles', articles);

  const fetcher = useFetcher();

  function fetchMoreBlogs() {
    fetcher.load(`/blogs?index&cursor=${endCursor}`);
  }

  useEffect(() => {
    if (!fetcher.data) return;
    const {blog} = fetcher.data;

    const article = flattenConnection(blog?.articles).map((article) => {
      const {publishedAt} = article;
      return {
        ...article,
        publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(publishedAt)),
      };
    });

    setArticles((prev) => [...prev, ...article]);
    setNextPage(blog?.articles?.pageInfo?.hasNextPage);
    setEndCursor(blog?.articles?.pageInfo?.endCursor);
  }, [fetcher.data]);

  return (
    <>
      <div className="breadcrumbs-container collection-breadcrumbs">
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumbs__item">
            Home
          </Link>
          <span className="breadcrumbs__separator"></span>
          <span className="breadcrumbs__item ">Blogs</span>
          {/* <span className="breadcrumbs__separator"></span>
          <span className="breadcrumbs__item ">{BLOG_HANDLE}</span> */}
        </div>
      </div>
      <div className='"block w-full my-10"'>
        <div className="page-width">
          <div className="w-full mx-auto">
            <h1
              className="px-4 py-2 m-0 mb-10 uppercase text-center text-2xl sm:text-3xl tracking-wider font-heavy text-color"
              style={{letterSpacing: '3px'}}
            >
              {BLOG_HANDLE}
            </h1>

            <FirstArticleCard
              blogHandle={BLOG_HANDLE.toLowerCase()}
              article={firstItem}
              key={firstItem.id}
              loading={getImageLoadingPriority(0, 2)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {remainingItems?.map((article, i) => (
                <ArticleCard
                  blogHandle={BLOG_HANDLE.toLowerCase()}
                  article={article}
                  key={article.id}
                  loading={getImageLoadingPriority(i, 2)}
                />
              ))}
            </div>

            {nextPage && (
              <div className="flex items-center justify-center mt-8 mb-8 ">
                <Button
                  disabled={fetcher.state !== 'idle'}
                  variant="secondary"
                  onClick={fetchMoreBlogs}
                  width="full"
                  prefetch="intent"
                  className="w-52 rounded-full text-base font-semibold font-regular "
                >
                  {fetcher.state !== 'idle' ? 'Loading...' : 'Load more blogs'}
                </Button>
              </div>
            )}
          </div>
        </div>
        <br />
        <br />
      </div>
    </>
  );
}
function FirstArticleCard({blogHandle, article, loading}) {
  return (
    <div
      key={article.id}
      className="mb-4 flex flex-col md:flex-row w-full gap-3 md:gap-4 blog-card1"
    >
      <div className="article-card1-img">
        <Link to={`/blogs/${article.handle}`}>
          {article.image && (
            <div>
              <Image
                alt={article.image.altText || article.title}
                className="object-cover w-full h-96"
                data={article.image}
                height={380}
                loading={loading}
                sizes="(min-width: 768px) 50vw, 100vw"
                width={600}
                loaderOptions={{
                  scale: 2,
                  crop: 'center',
                }}
              />
            </div>
          )}
        </Link>
      </div>

      <div className="article-card1-content">
        <p className="my-3 font-regular text-smm md:text-sm blog-date">
          by {article.author?.name} | {article.publishedAt}
        </p>

        <Link to={`/blogs/${article.handle}`}>
          <h2 className="font-heavy text-left text-xl md:text-2xl mb-1 truncate blog-title">
            {article.title}
          </h2>
        </Link>

        <p className="blog-description text-left font-regular text-smm md:text-sm blog-date mb-2 leading-6  tracking-wide">
          {article.content}
        </p>

        <Link to={`/blogs/${article.handle}`}>
          <button className="text-smm md:text-sm text-regular uppercase blog-read-btn ">
            read more
          </button>
        </Link>
      </div>
    </div>
  );
}

function ArticleCard({blogHandle, article, loading}) {
  return (
    <div key={article.id}>
      <Link to={`/blogs/${article.handle}`}>
        {article.image && (
          <div>
            <Image
              alt={article.image.altText || article.title}
              className="object-cover w-full h-60"
              data={article.image}
              height={240}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
              width={600}
              loaderOptions={{
                scale: 2,
                crop: 'center',
              }}
            />
          </div>
        )}
      </Link>

      <p className="my-3 font-regular text-smm md:text-sm blog-date">
        by {article.author?.name} | {article.publishedAt}
      </p>

      <Link to={`/blogs/${article.handle}`}>
        <h2 className="font-heavy text-left text-xl md:text-2xl mb-1 truncate blog-title">
          {article.title}
        </h2>
      </Link>

      <p className="blog-description text-left font-regular text-smm md:text-sm blog-date mb-2 leading-6  tracking-wide">
        {article.content}
      </p>

      <Link to={`/blogs/${article.handle}`}>
        <button className="text-smm md:text-sm text-regular uppercase blog-read-btn ">
          read more
        </button>
      </Link>
    </div>
  );
}

const BLOGS_QUERY = `#graphql
query Blog(
  $language: LanguageCode
  $blogHandle: String!
  $pageBy: Int!
  $cursor: String
) @inContext(language: $language) {
  blog(handle: $blogHandle) {
    articles(first: $pageBy, after: $cursor) {
      edges {
        node {
          author: authorV2 {
            name
          }
          content
          contentHtml
          handle
          id
          image {
            id
            altText
            url
            width
            height
          }
          publishedAt
          title
        }
      }
      pageInfo {
          hasNextPage
          endCursor
        }
    }
  }
}
`;
