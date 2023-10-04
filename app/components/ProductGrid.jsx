import {Button, Grid, CollectionCard, SortFilter, Link} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';
import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';

export function ProductGrid({
  type,
  url,
  breadCrumb,
  collection,
  appliedFilters,
  collections,
  collectionPriceDetails,
  ...props
}) {
  const [initialProducts, setInitialProducts] = useState(
    collection?.products?.nodes || [],
  );

  const [nextPage, setNextPage] = useState(
    collection?.products?.pageInfo?.hasNextPage,
  );
  const [endCursor, setEndCursor] = useState(
    collection?.products?.pageInfo?.endCursor,
  );
  const [products, setProducts] = useState(initialProducts);

  // props have changes, reset component state
  const productProps = collection?.products?.nodes || [];
  if (initialProducts !== productProps) {
    setInitialProducts(productProps);
    setProducts(productProps);
  }

  const fetcher = useFetcher();

  function fetchMoreProducts() {
    fetcher.load(`${url}?index&cursor=${endCursor}`);
  }

  useEffect(() => {
    if (!fetcher.data) return;
    const {collection} = fetcher.data;

    setProducts((prev) => [...prev, ...collection?.products?.nodes]);
    setNextPage(collection?.products?.pageInfo?.hasNextPage);
    setEndCursor(collection?.products?.pageInfo?.endCursor);
  }, [fetcher.data]);

  const haveProducts = initialProducts?.length > 0;

  return (
    <>
      <div className="block w-full collection_page">
        {breadCrumb && (
          <div className="breadcrumbs-container collection-breadcrumbs">
            <div className="breadcrumbs">
              <Link to="/" className="breadcrumbs__item">
                Home
              </Link>
              <span className="breadcrumbs__separator"></span>
              <span className="breadcrumbs__item ">{collection?.title}</span>
            </div>
          </div>
        )}
        <div className={type == 'collection' ? 'page-width' : ''}>
          <div className="pt-5 pb-5 main_collection md:pt-9">
            {type == 'collection' && (
              <div className="mt-5 mb-5 sort_dv">
                <div className="flex items-center justify-between gap-4 md:justify-end md:gap-8 main_filter">
                  <SortFilter
                    type="sort"
                    filters={collection?.products?.filters}
                    appliedFilters={appliedFilters}
                    collections={collections}
                    collectionPriceDetails={collectionPriceDetails}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center inner_plp_content">
              {type == 'collection' && (
                <div className="plp_left_sidebar desktop_filter ">
                  <h2 className="m-0 mb-5 font-bold uppercase text-xl sm:text-2xl text-color">
                    {collection?.title}
                  </h2>
                  <div className="block w-full plp_filters">
                    <SortFilter
                      type="filter"
                      filters={collection?.products?.filters}
                      appliedFilters={appliedFilters}
                      collections={collections}
                      collectionPriceDetails={collectionPriceDetails}
                    />
                  </div>
                </div>
              )}

              <div className="plp_right_side">
                {haveProducts ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 md:gap-7 plp_grid_blk">
                      {products?.map((product, i) => (
                        <CollectionCard
                          key={product.id}
                          product={product}
                          loading={getImageLoadingPriority(i)}
                        />
                      ))}
                    </div>

                    {nextPage && (
                      <div className="flex items-center justify-center mt-6 mb-8 ">
                        <Button
                          disabled={fetcher.state !== 'idle'}
                          variant="secondary"
                          onClick={fetchMoreProducts}
                          width="full"
                          prefetch="intent"
                          className="w-52 rounded-full text-base font-semibold font-regular "
                        >
                          {fetcher.state !== 'idle'
                            ? 'Loading...'
                            : 'Load more products'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <h4 className="text-lead font-black font-heavy flex justify-center mt-20">
                    No products found
                  </h4>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
