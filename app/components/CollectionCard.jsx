import clsx from 'clsx';
import {useContext} from 'react';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {Text, Link, AddToCartButton, WishListProvider} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';

import heart from '../images/heart.png';
import fillHeart from '../images/fillHeart.png';

export function CollectionCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}) {
  let cardLabel;

  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const productAnalytics = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  // ============Add/Remove Product from wishlist===========
  const {wishlist, addProductToWishList, removeProductFromWishList} =
    useContext(WishListProvider);

  function isProductInWishlist(id) {
    let productId = id.replace('gid://shopify/Product/', '');
    if (wishlist.product_count == 0) {
      return false;
    }
    // console.log('id: ', productId, wishlist.product_ids.includes(productId));
    return wishlist.product_ids.includes(productId);
  }

  return (
    <>
      <div className="w-full plp_grid_col product-item">
        <div className="relative">
          <Link
            onClick={onClick}
            to={`/products/${product.handle}`}
            prefetch="intent"
          >
            <div
              className={`mb-3 relative ${image ? 'bst_sl_img' : 'bst_sl_svg'}`}
            >
              {image ? (
                <Image
                  className="relative w-full "
                  widths={[320]}
                  sizes="320px"
                  loaderOptions={{
                    crop: 'center',
                    scale: 2,
                    width: 320,
                    height: 400,
                  }}
                  data={image}
                  alt={image.altText || `Picture of ${product.title}`}
                  loading={loading}
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
          {cardLabel && (
            <span
              className="absolute top-0 left-0 py-1 px-2 text-xs font-bold uppercase badge_text"
              // style={{fontFamily: 'MrEavesXLModOT'}}
            >
              {cardLabel}
            </span>
          )}
          <div>
            {isProductInWishlist(product.id) ? (
              <div
                className="heart_svg_wishlist absolute top-2 right-2 cursor-pointer"
                onClick={() =>
                  removeProductFromWishList(
                    product.id.replace('gid://shopify/Product/', ''),
                  )
                }
              >
                <img src={fillHeart} alt="favourite" />
              </div>
            ) : (
              <div
                className="heart_svg_wishlist absolute top-2 right-2 cursor-pointer"
                onClick={() =>
                  addProductToWishList(
                    product.id.replace('gid://shopify/Product/', ''),
                  )
                }
              >
                <img src={heart} alt="favourite" />
              </div>
            )}
          </div>
          <div className="w-full text-center absolute bottom-3 hidden view_custrmize">
            <Link
              onClick={onClick}
              to={`/products/${product.handle}`}
              prefetch="intent"
              className="!text-xs uppercase btn px-8"
            >
              view
            </Link>
          </div>
        </div>
        <div className="plp_grid_content">
          {/* <div className="block w-full pb-1.5 star_dv ">
            <span className="inline-block text-xs font-medium rvw_stars text-color grid_font ">
              ★★★★★{' '}
              <span className="inline-block text-xs font-medium rvw_txt text-color grid_font ">
                (75)
              </span>
            </span>
          </div> */}
          {/* <!-- === Yopto product start review ==== --> */}
          <div
            className="yotpo-widget-instance"
            data-yotpo-instance-id="384737"
            data-yotpo-product-id={product.id?.split('Product/')[1]}
          ></div>
          <h5 className="pb-1 m-0 text-sm !font-medium leading-4 capitalize text-color grid_font ">
            <Link
              onClick={onClick}
              to={`/products/${product.handle}`}
              prefetch="intent"
              className="text-color "
            >
              {product.title}
            </Link>
          </h5>
          <h3 className="mt-0 text-sm !font-medium text-color grid_font ">
            <Money withoutTrailingZeros data={price} />
            {isDiscounted(price, compareAtPrice) && (
              <CompareAtPrice className={'opacity-50'} data={compareAtPrice} />
            )}
          </h3>
        </div>
      </div>
    </>
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
