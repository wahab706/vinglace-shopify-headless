import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {PageHeader, Section, Link} from '~/components';
import {ATTR_LOADING_EAGER} from '~/lib/const';
import styles from '../../../styles/custom-font.css';

const BLOG_HANDLE = 'vinglace';

const seo = ({data}) => ({
  title: data?.article?.seo?.title,
  description: data?.article?.seo?.description,
  titleTemplate: '%s | vinglace',
});

export const handle = {
  seo,
};

export async function loader({params, context}) {
  const {language, country} = context.storefront.i18n;

  invariant(params.journalHandle, 'Missing journal handle');

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      articleHandle: params.journalHandle,
      language,
    },
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog?.articleByHandle;

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article?.publishedAt));

  return json(
    {article, formattedDate},
    {
      headers: {
        // TODO cacheLong()
      },
    },
  );
}

export const meta = ({data}) => {
  return {
    title: data?.article?.seo?.title ?? 'Article',
    description: data?.article?.seo?.description,
  };
};

export const links = () => {
  return [{rel: 'stylesheet', href: styles}];
};

export default function Article() {
  const {article, formattedDate} = useLoaderData();

  const {title, image, contentHtml, author} = article;

  return (
    <>
      <div className="breadcrumbs-container collection-breadcrumbs">
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumbs__item">
            Home
          </Link>
          <span className="breadcrumbs__separator"></span>
          <Link to="/blogs" className="breadcrumbs__item">
            Blogs
          </Link>
          <span className="breadcrumbs__separator"></span>
          <span className="breadcrumbs__item ">{title}</span>
        </div>
      </div>

      <div className="block w-full mt-6 mb-10 ">
        <div className="page-width">
          <div className="w-full max-w-3xl mx-auto text-center ">
            <h2
              className="pb-1 m-0 mb-1 text-center text-2xl font-medium leading-8 capitalize text-color sm:text-3xl "
              style={{letterSpacing: '3px'}}
            >
              {title}
            </h2>
            <p className="text-smm md:text-sm tracking-wide max-w-md mx-auto text-color ">
              by {author.name} {formattedDate}
            </p>

            {image && (
              <Image
                data={image}
                className="w-full mx-auto mt-8 md:mt-10 max-w-3xl"
                sizes="90vw"
                widths={[400, 800, 1200]}
                width="100px"
                loading={ATTR_LOADING_EAGER}
                loaderOptions={{
                  scale: 2,
                  crop: 'center',
                }}
              />
            )}
          </div>
          <div
            dangerouslySetInnerHTML={{__html: contentHtml}}
            className="article-content mt-8 w-full"
          />
        </div>
      </div>
    </>
  );
}

const ARTICLE_QUERY = `#graphql
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;
