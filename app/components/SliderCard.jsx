import clsx from 'clsx';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {Text, Link, AddToCartButton} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';

export function SliderCard({
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

  return (
    <>
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className="relative">
          <div
            className={`mb-3 product-slider-img ${
              image ? 'slider-img-div' : 'slider-svg-div'
            }`}
          >
            {image ? (
              <Image
                className="relative w-full"
                widths={[320]}
                height={[445]}
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
          {cardLabel && (
            <span className="absolute top-0 left-0 py-1 px-2 text-xs font-bold uppercase badge_text ">
              {cardLabel}
            </span>
          )}
        </div>

        {/* <div className="block w-full pb-1.5 star_dv ">
          <span className="inline-block text-smm md:text-sm rvw_stars text-color grid_font ">
            ★★★★★{' '}
            <span className="inline-block text-smm md:text-sm rvw_txt text-color grid_font ">
              (5)
            </span>
          </span>
        </div> */}
        {/* <!-- === Yopto product start review ==== --> */}
        <div
          className="yotpo-widget-instance"
          data-yotpo-instance-id="384737"
          data-yotpo-product-id={product.id?.split('Product/')[1]}
        ></div>

        <h5 className="pb-1 m-0 text-smm md:text-sm font-medium leading-4 capitalize text-color grid_font ">
          <span className="text-color ">{product.title}</span>
        </h5>
        <h3 className="mt-0 text-smm md:text-sm font-medium text-color grid_font ">
          <Money withoutTrailingZeros data={price} />
        </h3>
      </Link>

      <div className="block w-full pt-3 text-center slider_buton md:hidden ">
        <AddToCartButton
          lines={[
            {
              merchandiseId: product.variants?.nodes[0]?.id,
              quantity: 1,
            },
          ]}
          variant={
            !product.variants?.nodes[0]?.availableForSale
              ? 'secondary'
              : 'primary'
          }
          data-test="add-to-cart"
          disabled={!product.variants?.nodes[0]?.availableForSale}
          className={`${
            !product.variants?.nodes[0]?.availableForSale && '!opacity-50'
          } w-full px-10 py-3 font-normal uppercase product-form__submit btn`}
        >
          {!product.variants?.nodes[0]?.availableForSale
            ? 'Out of Stock'
            : 'Add To Bag'}
        </AddToCartButton>
      </div>
    </>
  );
}
