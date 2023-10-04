import {defer} from '@shopify/remix-oxygen';
import {Link, IconSearch} from '~/components';
import {flattenConnection} from '@shopify/hydrogen';
import {Await, Form, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';
import {
  Heading,
  Input,
  PageHeader,
  ProductGrid,
  ProductSwimlane,
  FeaturedCollections,
  Section,
  Text,
} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {PAGINATION_SIZE} from '~/lib/const';

export default function () {
  const {searchTerm, products, noResultRecommendations} = useLoaderData();
  const noResults = products?.nodes?.length === 0;

  return (
    <div className="search-page">
      <div>
        <div className="breadcrumbs-container collection-breadcrumbs">
          <div className="breadcrumbs">
            <Link to="/" className="breadcrumbs__item">
              Home
            </Link>
            <span className="breadcrumbs__separator"></span>
            <span className="breadcrumbs__item ">Search</span>
          </div>
        </div>
        <div className="page-width !mt-4">
          <Form method="get" className="relative flex w-full text-heading">
            <input
              defaultValue={searchTerm}
              placeholder="Search…"
              type="search"
              variant="search"
              name="q"
              className="w-full rounded-full pl-11 "
            />
            <span className="search-icon-2 absolute left-2  flex items-center justify-center w-8 h-8 ">
              <IconSearch />
            </span>
            <button className="search-button" type="submit">
              Search
            </button>
          </Form>
        </div>
      </div>
      {!searchTerm || noResults ? (
        <div>
          {noResults && (
            <div className=" page-width no-search-results">
              <p> No results, try something else.</p>
            </div>
          )}

          {!searchTerm && (
            <div className=" page-width no-search-results">
              <p> No results, try to search something .</p>
            </div>
          )}

          <Suspense>
            <Await
              errorElement={
                <p className="page-width !mt-10 !mb-10 text-lg tracking-wide text-center">
                  There was a problem loading related products
                </p>
              }
              resolve={noResultRecommendations}
            >
              {(data) => (
                <div className="mt-20">
                  <ProductSwimlane
                    title="Trending Products"
                    products={data.featuredProducts}
                  />
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      ) : (
        <Section>
          <ProductGrid
            type="search"
            key="search"
            url={`/search?q=${searchTerm}`}
            collection={{products}}
          />
        </Section>
      )}
    </div>
  );
}

export async function loader({request, context: {storefront}}) {
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');
  const searchTerm = searchParams.get('q');

  const data = await storefront.query(SEARCH_QUERY, {
    variables: {
      pageBy: PAGINATION_SIZE,
      searchTerm,
      cursor,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');
  const {products} = data;

  const getRecommendations = !searchTerm || products?.nodes?.length === 0;

  return defer({
    searchTerm,
    products,
    noResultRecommendations: getRecommendations
      ? getNoResultRecommendations(storefront)
      : Promise.resolve(null),
  });
}

const SEARCH_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query search(
    $searchTerm: String
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $after: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $pageBy
      sortKey: RELEVANCE
      query: $searchTerm
      after: $after
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export async function getNoResultRecommendations(storefront) {
  const data = await storefront.query(SEARCH_NO_RESULTS_QUERY, {
    variables: {
      pageBy: PAGINATION_SIZE,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  return {
    featuredCollections: flattenConnection(data.featuredCollections),
    featuredProducts: flattenConnection(data.featuredProducts),
  };
}

const SEARCH_NO_RESULTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query searchNoResult(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
  ) @inContext(country: $country, language: $language) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: $pageBy) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
