import {useContext} from 'react';
import {Link, WishListProvider} from '~/components';
import {flattenConnection, Money, useMoney} from '@shopify/hydrogen';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import fillHeart from '../../../images/fillHeart.png';

export default function wishlist() {
  const {userEmail, wishlist, removeProductFromWishList} =
    useContext(WishListProvider);

  return (
    <div className="wishlist-page">
      <div className="breadcrumbs-container collection-breadcrumbs">
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumbs__item">
            Home
          </Link>
          <span className="breadcrumbs__separator"></span>
          <span className="breadcrumbs__item ">Wishlist</span>
        </div>
      </div>

      <div className="page-width !mt-4">
        {wishlist.product_count > 0 && (
          <div className="mb-6">
            {!userEmail && (
              <p className="text-center text-sm sm:text-base">
                Wishlist is not saved permanently yet. Please{' '}
                <Link to="/account" className="underline font-medium">
                  log in
                </Link>{' '}
                to save it.
              </p>
            )}
          </div>
        )}

        <div className="mb-11">
          {wishlist.product_count > 0 ? (
            <div className="grid grid-cols-3 gap-4 md:gap-7 plp_grid_blk">
              {wishlist.products?.map((product, i) => (
                <div className="w-full plp_grid_col product-item">
                  <div className="relative">
                    <Link to={`/products/${product.handle}`} prefetch="intent">
                      <div
                        className={`mb-3 relative ${
                          product.image ? 'bst_sl_img' : 'bst_sl_svg'
                        }`}
                      >
                        {product.image ? (
                          <img
                            className="w-full h-96 object-cover"
                            src={product.image}
                            alt={`Picture of ${product.title}`}
                          />
                        ) : (
                          <svg
                            viewBox="0 0 20 20"
                            className="Polaris-Icon__Svg_375hu"
                            focusable="false"
                            aria-hidden="true"
                          >
                            <path d="M2.5 1a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-15a1.5 1.5 0 0 0-1.5-1.5h-15zm5 3.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8.999 12.5h-13.002c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01l1.63 1.851 3.06-4.781a.5.5 0 0 1 .84.02l4.039 7.011c.18.34-.06.75-.44.75z"></path>
                          </svg>
                        )}
                      </div>
                    </Link>

                    <div
                      className="heart_svg_wishlist absolute top-1 right-1 cursor-pointer"
                      onClick={() =>
                        removeProductFromWishList(product.shopify_product_id)
                      }
                    >
                      <img src={fillHeart} alt="favourite" />
                    </div>

                    <div
                      className="cursor-pointer w-full text-center absolute bottom-3 hidden view_custrmize"
                      onClick={() =>
                        removeProductFromWishList(product.shopify_product_id)
                      }
                    >
                      <span className="!text-xs btn px-8">
                        Remove from wishlist
                      </span>
                    </div>
                  </div>
                  <div className="plp_grid_content">
                    <h5 className="pb-1 m-0 text-sm !font-medium leading-4 capitalize text-color grid_font ">
                      <Link
                        to={`/products/${product.handle}`}
                        prefetch="intent"
                        className="text-color "
                      >
                        {product.title}
                      </Link>
                    </h5>
                    {/* <h3 className="mt-0 text-sm !font-medium text-color grid_font ">
                      <Money
                        withoutTrailingZeros
                        data={product.variants[0].price}
                      />
                      {isDiscounted(
                        product.variants[0].price,
                        product.variants[0].compareAtPrice,
                      ) && (
                        <CompareAtPrice
                          className={'opacity-50'}
                          data={product.variants[0].compareAtPrice}
                        />
                      )}
                    </h3> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No Product is added in wishlist yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
