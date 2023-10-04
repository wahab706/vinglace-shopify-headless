import {json} from '@shopify/remix-oxygen';
import {useLoaderData, useLocation} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {PageHeader, Link} from '~/components';
import {useState} from 'react';
import {
  ContactUs,
  AboutUs,
  CorporateGifting,
  OurCause,
  Wedding,
  ThankYouPage,
} from './index';

const seo = ({data}) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
});

export const handle = {
  seo,
};

export async function loader({request, params, context}) {
  invariant(params.pageHandle, 'Missing page handle');

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.pageHandle,
      language: context.storefront.i18n.language,
    },
  });

  if (!page && params.pageHandle != 'thank-you-page') {
    throw new Response(null, {status: 404});
  }

  return json(
    {page},
    {
      headers: {
        // TODO cacheLong()
      },
    },
  );
}

export default function Page() {
  const {page} = useLoaderData();
  const location = useLocation();
  // console.log('page:', page);

  return (
    <>
      <div className="breadcrumbs-container collection-breadcrumbs">
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumbs__item">
            Home
          </Link>
          <span className="breadcrumbs__separator"></span>
          <span className="breadcrumbs__item ">
            {location.pathname == '/pages/thank-you-page'
              ? 'Thank You Page'
              : page?.title}
          </span>
        </div>
      </div>

      {(() => {
        switch (location.pathname) {
          case '/pages/for-him':
            return <ForHim />;

          case '/pages/for-her':
            return <ForHer />;

          case '/pages/new-contact-us':
            return <ContactUs />;

          case '/pages/new-about-us':
            return <AboutUs />;

          case '/pages/new-our-cause':
            return <OurCause />;

          case '/pages/corporate-gifting':
            return <CorporateGifting />;

          case '/pages/new-wedding-giveaway':
            return <Wedding />;

          case '/pages/thank-you-page':
            return <ThankYouPage />;

          default:
            return (
              <div className="block w-full mt-6 mb-10 ">
                <div className="page-width">
                  <h2
                    className="pb-1 m-0 mb-6 text-center text-3xl font-medium leading-8 uppercase text-color sm:text-3xl "
                    style={{letterSpacing: '3px'}}
                  >
                    {page?.title}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{__html: page.body}}
                    className="page-content w-full"
                  />
                </div>
              </div>
            );
        }
      })()}
    </>
  );
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
