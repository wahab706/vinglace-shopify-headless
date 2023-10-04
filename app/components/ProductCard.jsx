import clsx from 'clsx';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {Text, Link, AddToCartButton} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';

import heart from '../images/heart.png';
import sd1 from '../images/sd1.png';

export function ProductCard({
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

  return (
    <>
      <div className="flex flex-col gap-2">
        <Link
          onClick={onClick}
          to={`/products/${product.handle}`}
          prefetch="intent"
        >
          <div className={clsx('grid gap-4', className)}>
            <div className="relative card-image aspect-[4/5] bg-primary/5">
              {image && (
                <Image
                  className="aspect-[4/5] w-full object-cover fadeIn"
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
              )}
              {cardLabel && (
                <Text
                  as="label"
                  size="fine"
                  className="absolute top-0 right-0 m-4 text-right text-notice"
                >
                  {cardLabel}
                </Text>
              )}
            </div>
            <div className="grid gap-1">
              <Text
                className="w-full overflow-hidden whitespace-nowrap text-ellipsis !text-sm"
                as="h3"
              >
                {product.title}
              </Text>
              <div className="flex gap-4">
                <Text className="flex gap-4 !text-sm">
                  <Money withoutTrailingZeros data={price} />
                  {isDiscounted(price, compareAtPrice) && (
                    <CompareAtPrice
                      className={'opacity-50'}
                      data={compareAtPrice}
                    />
                  )}
                </Text>
              </div>
            </div>
          </div>
        </Link>
        {quickAdd && (
          <AddToCartButton
            lines={[
              {
                quantity: 1,
                merchandiseId: firstVariant.id,
              },
            ]}
            variant="secondary"
            className="mt-2"
            analytics={{
              products: [productAnalytics],
              totalValue: parseFloat(productAnalytics.price),
            }}
          >
            <Text
              as="span"
              className="flex items-center justify-center gap-2 !text-xs"
            >
              Add to Bag
            </Text>
          </AddToCartButton>
        )}
      </div>

      {/* <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className="w-full plp_grid_col product-item">
          <div className="relative">
            <div className="mb-3 bst_sl_img relative">
              <img className="relative w-full " src={sd1} alt="product-image" />
            </div>
            <span className="absolute top-0 left-0 py-1 px-2 text-xs font-bold uppercase badge_text ">
              On Sale
            </span>
            <div className="heart_svg_wishlist absolute top-1 right-1 cursor-pointer">
              <img src={heart} alt="favourite" />
            </div>
            <div className="w-full text-center absolute bottom-3 hidden view_custrmize">
              <a href="# " className="text-sm uppercase btn px-8">
                view
              </a>
            </div>
          </div>
          <div className="plp_grid_content">
            // <div className="block w-full pb-1.5 star_dv ">
            //   <span className="inline-block text-base rvw_stars text-color grid_font ">
            //     ★★★★★{' '}
            //     <span className="inline-block text-base rvw_txt text-color grid_font ">
            //       (75)
            //     </span>
            //   </span>
            // </div>
            // <!-- === Yopto product customer reviews ==== --> 
        { <div
          className="yotpo-widget-instance"
          data-yotpo-instance-id="384736"
          data-yotpo-product-id={product.id?.split('Product/')[1]}
          data-yotpo-name={product.title}
          // data-yotpo-url={location.href}
          data-yotpo-image-url={product.variants?.nodes[0]?.image?.url}
          data-yotpo-price={product.variants?.nodes[0]?.price?.amount}
          data-yotpo-currency={product.variants?.nodes[0]?.price?.currencyCode}
          data-yotpo-description={product.seo?.description}
        ></div> 
            <h5 className="pb-1 m-0 text-base leading-4 capitalize text-color grid_font ">
              <span className="text-color">Wine Chillers</span>
            </h5>
            <h3 className="mt-0 text-base text-color grid_font ">$85.95</h3>
          </div>
        </div>
      </Link> */}
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
