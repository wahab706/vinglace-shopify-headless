import {
  useRef,
  useState,
  useEffect,
  Suspense,
  useMemo,
  Fragment,
  useContext,
} from 'react';
import {Disclosure, Transition, Listbox} from '@headlessui/react';
import {defer} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Await,
  useSearchParams,
  useLocation,
  useTransition,
} from '@remix-run/react';
import {
  AnalyticsPageType,
  Money,
  // ShopPayButton,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  IconCaret,
  IconCheck,
  ProductGallery,
  SliderCard,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  CustomizerModal,
  WishListProvider,
} from '~/components';
import {getExcerpt, isDiscounted, isNewArrival} from '~/lib/utils';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import Slider from 'react-slick';

import bottleGroupPdp from '../../../images/bottle_group_pdp.png';
import heart from '../../../images/heart.png';
import fillHeart from '../../../images/fillHeart.png';

const seo = ({data}) => {
  const media = flattenConnection(data.product.media).find(
    (media) => media.mediaContentType === 'IMAGE',
  );

  return {
    title: data?.product?.seo?.title ?? data?.product?.title,
    media: media?.image,
    description: data?.product?.seo?.description ?? data?.product?.description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: data?.product?.vendor,
      name: data?.product?.title,
    },
  };
};

export const handle = {
  seo,
};

export async function loader({params, request, context}) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const searchParams = new URL(request.url).searchParams;

  const selectedOptions = [];
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  return defer({
    product,
    shop,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
  });
}

export default function Product() {
  const {product, shop, recommended} = useLoaderData();
  const {media, title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;

  const bestSellersSliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '15%',
    arrows: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: '10%',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    prevArrow: (
      <button type="button" className="slick-prev pull-left">
        <svg
          className="arrow_left_svg"
          width="21"
          height="17"
          viewBox="0 0 21 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6964 7.42053L4.88149 7.42054L10.6205 1.68157L9.08731 0.148436L0.730958 8.50479L9.08732 16.8611L10.6205 15.328L4.88149 9.58905L20.6964 9.58904L20.6964 7.42053Z"
            fill="black"
          />
        </svg>
      </button>
    ),
    nextArrow: (
      <button type="button" className="slick-next pull-right">
        <svg
          className="arrow_right_svg"
          width="21"
          height="17"
          viewBox="0 0 21 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.808934 9.58923L16.6239 9.58923L10.8849 15.3282L12.4181 16.8613L20.7744 8.50497L12.4181 0.148614L10.8849 1.68175L16.6239 7.42072L0.808934 7.42072L0.808934 9.58923Z"
            fill="black"
          />
        </svg>
      </button>
    ),
  };

  const firstVariant = product.variants.nodes[0];
  const isOnSale =
    firstVariant?.price?.amount &&
    firstVariant?.compareAtPrice?.amount &&
    firstVariant?.price?.amount < firstVariant?.compareAtPrice?.amount;

  let cardLabel;
  if (isOnSale) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }
  console.log('product', product);
  const metafields = product.metafields;
  const section1 = metafields[0]
    ? {
        title: metafields[0].value,
        description: metafields[1] ? metafields[1].value : null,
        isImage: metafields[2].reference?.image ? true : false,
        image:
          metafields[2] && metafields[2].reference?.image
            ? metafields[2].reference?.image?.src
            : null,
        video:
          metafields[2] && metafields[2].reference?.sources
            ? metafields[2].reference?.sources[0]?.url
            : null,
        preview:
          metafields[2] && metafields[2].reference?.previewImage
            ? metafields[2].reference?.previewImage?.url
            : null,
      }
    : null;
  console.log('section1', section1);

  const section2 = metafields[5]
    ? {
        title: metafields[3].value,
        subTitle: metafields[4] ? metafields[4].value : null,
        image: metafields[5] ? metafields[5].reference?.image?.src : null,
      }
    : null;

  const section3 =
    metafields[6] && metafields[6].value == 'true' ? true : false;

  const [pdpDetailsTab, setPdpDetailsTab] = useState(1);
  //setting tabs value to other if first or second not available for a specific product
  useEffect(() => {
    if (descriptionHtml) {
      setPdpDetailsTab(1);
    }
    if (!descriptionHtml && shippingPolicy?.body) {
      setPdpDetailsTab(2);
    } else if (
      !descriptionHtml &&
      !shippingPolicy?.body &&
      refundPolicy?.body
    ) {
      setPdpDetailsTab(3);
    }
  }, [product, descriptionHtml, shippingPolicy?.body, refundPolicy?.body]);

  // ============Add/Remove Product from wishlist===========
  const {wishlist, addProductToWishList, removeProductFromWishList} =
    useContext(WishListProvider);

  function isProductInWishlist() {
    let productId = product.id.replace('gid://shopify/Product/', '');
    if (wishlist.product_count == 0) {
      return false;
    }
    return wishlist.product_ids.includes(productId);
  }

  return (
    <>
      <div className="breadcrumbs-container collection-breadcrumbs">
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumbs__item">
            Home
          </Link>
          <span className="breadcrumbs__separator"></span>
          <span className="breadcrumbs__item ">{title}</span>
        </div>
      </div>

      <div className="pb-12 product_section pt-9 ">
        <div className="page-width ">
          <div className="flex flex-col md:flex-row product_dtl gap-9 ">
            <div className="w-full md:w-3/6 left_img_sldr ">
              <div className="product-desktop-gallery">
                <ProductGallery
                  media={media.nodes}
                  label={cardLabel}
                  product={product}
                  wishlist={wishlist}
                  addProductToWishList={addProductToWishList}
                  removeProductFromWishList={removeProductFromWishList}
                />
              </div>
            </div>

            <div className="w-full md:w-3/6 right_content_pdp">
              <div className="block w-full inner_ryt_pdp ">
                <div className="left_single_meta ">
                  <div className="flex justify-between items-center w-full">
                    <h1 className="m-0 text-xl font-semibold md:text-2xl pdp_title ">
                      {title}
                    </h1>

                    <div className="block md:hidden">
                      {isProductInWishlist() ? (
                        <div
                          className="cursor-pointer"
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
                          className="cursor-pointer"
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
                  </div>

                  {vendor && (
                    <div className="text-sm vendor_pdp ">{vendor}</div>
                  )}
                  {/* <!-- === Yopto product start review ==== --> */}
                  <div
                    className="yotpo-widget-instance"
                    data-yotpo-instance-id="384737"
                    data-yotpo-product-id={product.id?.split('Product/')[1]}
                  ></div>
                  <ProductForm />

                  {/* <div className="grid gap-4 py-4">
                    {descriptionHtml && (
                      <ProductDetail
                        title="Product Details"
                        content={descriptionHtml}
                      />
                    )}
                    {shippingPolicy?.body && (
                      <ProductDetail
                        title="Shipping"
                        content={getExcerpt(shippingPolicy.body)}
                        learnMore={`/policies/${shippingPolicy.handle}`}
                      />
                    )}
                    {refundPolicy?.body && (
                      <ProductDetail
                        title="Returns"
                        content={getExcerpt(refundPolicy.body)}
                        learnMore={`/policies/${refundPolicy.handle}`}
                      />
                    )}
                  </div>  */}

                  <div>
                    {(descriptionHtml ||
                      shippingPolicy?.body ||
                      refundPolicy?.body) && (
                      <div className="tabs w-full inline-block overflow-hidden pdp-tabs">
                        <div className="tab-labels flex w-full text-center whitespace-nowrap overflow-x-auto scroll-smooth">
                          {descriptionHtml && (
                            <div>
                              <input
                                className="hidden"
                                type="radio "
                                name="tabs"
                                id="tab1"
                                checked={pdpDetailsTab == 1}
                                onChange={() => setPdpDetailsTab(1)}
                              />
                              <label
                                className={`inline-block py-2 px-3 mx-1 text-center cursor-pointer relative tab-1 ${
                                  pdpDetailsTab == 1 && 'tab-selected'
                                }`}
                                htmlFor="tab1"
                                onClick={() => setPdpDetailsTab(1)}
                              >
                                <span className="font-bold text-xs text-color uppercase inline-block">
                                  Details
                                </span>
                              </label>
                            </div>
                          )}

                          {shippingPolicy?.body && (
                            <div>
                              <input
                                className="hidden"
                                type="radio "
                                name="tabs"
                                id="tab2"
                                checked={pdpDetailsTab == 2}
                                onChange={() => setPdpDetailsTab(2)}
                              />
                              <label
                                className={`inline-block py-2 px-3 mx-1 text-center cursor-pointer relative tab-2 ${
                                  pdpDetailsTab == 2 && 'tab-selected'
                                }`}
                                htmlFor="tab2"
                                onClick={() => setPdpDetailsTab(2)}
                              >
                                <span className="font-bold text-xs text-color uppercase inline-block">
                                  Shipping
                                </span>
                              </label>
                            </div>
                          )}

                          {refundPolicy?.body && (
                            <div>
                              <input
                                className="hidden"
                                type="radio "
                                name="tabs"
                                id="tab3"
                                checked={pdpDetailsTab == 3}
                                onChange={() => setPdpDetailsTab(3)}
                              />
                              <label
                                className={`inline-block py-2 px-3 mx-1 text-center cursor-pointer relative tab-3 ${
                                  pdpDetailsTab == 3 && 'tab-selected'
                                }`}
                                htmlFor="tab3"
                                onClick={() => setPdpDetailsTab(3)}
                              >
                                <span className="font-bold text-xs text-color uppercase inline-block">
                                  Returns
                                </span>
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="tab-contents">
                          {descriptionHtml && (
                            <div
                              id="tab-content1"
                              className={`w-full pt-4 tab-content WineChillers ${
                                pdpDetailsTab == 1 ? 'block' : 'hidden'
                              }`}
                            >
                              <div className="block w-full">
                                <div
                                  className="text-sm leading-6"
                                  dangerouslySetInnerHTML={{
                                    __html: descriptionHtml,
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {shippingPolicy?.body && (
                            <div
                              id="tab-content2"
                              className={`w-full pt-4 tab-content WineChillers ${
                                pdpDetailsTab == 2 ? 'block' : 'hidden'
                              }`}
                            >
                              <div className="block w-full">
                                <div
                                  className="text-sm leading-6"
                                  dangerouslySetInnerHTML={{
                                    __html: getExcerpt(shippingPolicy.body),
                                  }}
                                />
                                <div>
                                  <Link
                                    className="pb-px border-b border-primary/30 text-primary/50"
                                    to={`/policies/${shippingPolicy.handle}`}
                                  >
                                    Learn more
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}

                          {refundPolicy?.body && (
                            <div
                              id="tab-content3"
                              className={`w-full pt-4 tab-content WineChillers ${
                                pdpDetailsTab == 3 ? 'block' : 'hidden'
                              }`}
                            >
                              <div className="block w-full">
                                <div
                                  className="text-sm leading-6"
                                  dangerouslySetInnerHTML={{
                                    __html: getExcerpt(refundPolicy.body),
                                  }}
                                />

                                <div>
                                  <Link
                                    className="pb-px border-b border-primary/30 text-primary/50"
                                    to={`/policies/${refundPolicy.handle}`}
                                  >
                                    Learn more
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================PDP Section 1====================== */}
        <div>
          {section1 && (
            <div className="block w-full pt-12 md:pt-28 home_img_with_txt ">
              <div className="page-width ">
                <div className="flex items-center flex-col md:flex-row w-full gap-14 img_txt_inner">
                  <div className="image_dv w-full md:w-2/5 md:basis-2/5">
                    {section1.isImage && section1.image && (
                      <img
                        className="block w-full "
                        src={section1.image}
                        alt="image"
                      />
                    )}

                    {!section1.isImage && section1.video && (
                      <video controls poster={section1.preview}>
                        <source src={section1.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <div className="contant_dv px-6 md:p-0 w-full md:w-3/5 md:basis-3/5">
                    <h4 className="pb-10 text-xl md:text-2xl font-bold text-color ">
                      {section1.title}
                    </h4>
                    <div
                      className="m-0 text-base pdp-metafield-description"
                      dangerouslySetInnerHTML={{
                        __html: metafieldToHtml(section1.description),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =================PDP Section 2====================== */}
        <div>
          {section2 && (
            <Fragment>
              <div className="pt-10 md:pt-20"></div>
              <div className="header-image-wrapper">
                <img src={section2.image} alt="banner" className="w-full" />
                <div className="wrapper">
                  <div className="custom-container">
                    <div className="content">
                      <div className="grid__item medium-up--one-half small--one-whole text-center">
                        <h2>{section2.title}</h2>
                        <h5>{section2.subTitle}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </div>

        {/* =================PDP Section 3====================== */}
        <div>
          {section3 && (
            <Fragment>
              <div className="pt-10 md:pt-20"></div>
              <div
                className="text-over-image"
                id="shopify-section-tumbler-amazing-feature"
              >
                <div className="custom-container !text-center">
                  <h2 className="sec-title">STAINLESS OUTSIDE GLASS INSIDE</h2>

                  <div className="product-container ">
                    <img
                      src="https://cdn.shopify.com/s/files/1/1527/4909/files/vinglase_tumler_arrow_340x.jpg?v=1613694106"
                      alt=""
                      className="product--image small--hide"
                    />
                    <img
                      src="https://cdn.shopify.com/s/files/1/1527/4909/files/plain-tumbler_240x.png?v=1613183120"
                      alt=""
                      className="product--image medium-up--hide"
                    />
                    <div className="overlay !bg-transparent">
                      <p className="center-text"></p>
                      <div className="width">
                        <span className="value">3.5"</span>
                        <span className="label">Width</span>
                      </div>
                      <div className="dimension">
                        <span className="value">7"</span>
                        <span className="label">Dimension</span>
                      </div>

                      <div className="feature-text feature-text1 small--text-center medium-up--text-right">
                        <p>Holds 14 oz.&nbsp;</p>
                      </div>
                      <div className="feature-text feature-text2 small--text-center medium-up--text-right">
                        <p>Exterior is made of kitchen grade stainless steel</p>
                      </div>
                      <div className="feature-text feature-text3 small--text-center medium-up--text-left">
                        <p>
                          Glass insert so your beverage never touches
                          metal.&nbsp; No more metallic taste or smell
                        </p>
                      </div>
                      <div className="feature-text feature-text4 small--text-center medium-up--text-left">
                        <p>
                          Double walled and vacuum insulated to keep your
                          beverages hot or cold for hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="bottom-text">
                    To remove the glass insert, simply twist and pull with one
                    hand while pulling the stainless steel base, in the opposite
                    direction, with the other hand.
                  </p>
                </div>
                <img
                  src="https://cdn.shopify.com/s/files/1/1527/4909/files/bottle2_250x350.png?v=12010556460158872737"
                  alt=""
                  className="bottle bottle2"
                />
                <img
                  src="https://cdn.shopify.com/s/files/1/1527/4909/files/bottle1_250x350.png?v=10850294883144884424"
                  alt=""
                  className="bottle bottle1"
                />
              </div>
            </Fragment>
          )}
        </div>

        <Suspense fallback={<Skeleton />}>
          <Await
            errorElement={
              <p className="page-width !mt-10 !mb-10 text-lg tracking-wide text-center">
                There was a problem loading related products
              </p>
            }
            resolve={recommended}
          >
            {(products) => (
              <div className="product_slider_main pt-10 md:pt-28">
                <h3 className="md:pb-8 text-xl md:text-2xl font-medium text-center ">
                  You May Also Like
                </h3>
                <Slider
                  {...bestSellersSliderSettings}
                  className="w-full best_seller slider"
                >
                  {products?.map((product) => {
                    return <SliderCard product={product} />;
                  })}
                </Slider>
              </div>
            )}
          </Await>
        </Suspense>

        {/* <div className="block w-full py-10 md:py-28 home_img_with_txt ">
          <div className="page-width ">
            <div className="flex items-center flex-col md:flex-row w-full gap-14 img_txt_inner">
              <div className="image_dv w-full md:w-3/5 md:basis-3/5">
                <img
                  className="block w-full "
                  src={bottleGroupPdp}
                  alt="image"
                />
              </div>
              <div className="contant_dv px-6 md:p-0 w-full md:w-2/5 md:basis-2/5">
                <h4 className="pb-3 text-xl sm:text-2xl font-bold text-color !leading-5">
                  Lorem ipsum text
                </h4>
                <p
                  className="m-0 text-sm text-color "
                  style={{letterSpacing: '1px'}}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                  minus consequuntur adipisci laborum cumque exercitationem
                  corporis eligendi reiciendis officiis nam, repellat magni,
                  facere porro obcaecati nesciunt autem error natus deleniti.
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* <!-- === Yopto product customer reviews ==== --> */}
        <div
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
      </div>
    </>
  );
}

export function ProductForm() {
  const {product, analytics} = useLoaderData();

  const [currentSearchParams] = useSearchParams();
  const transition = useTransition();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityInput = (e) => {
    if (e.target.value >= 1) {
      setQuantity(parseInt(e.target.value));
    } else {
      setQuantity(1);
    }

    // if (e.target.value >= 1) {
    //   if (e.target.value <= availableQuantity) {
    //     setQuantity(Number(e.target.value));
    //   } else {
    //     setQuantity(availableQuantity);
    //   }
    // } else {
    //   setQuantity(1);
    // }
  };

  const handleQuantity = (type) => {
    if (type == 'decrement') {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
    if (type == 'increment') {
      // if (quantity < availableQuantity) {
      //   setQuantity(quantity + 1);
      // }

      setQuantity(quantity + 1);
    }
  };

  /**
   * We update `searchParams` with in-flight request data from `transition` (if available)
   * to create an optimistic UI, e.g. check the product option before the
   * request has completed.
   */
  const searchParams = useMemo(() => {
    return transition.location
      ? new URLSearchParams(transition.location.search)
      : currentSearchParams;
  }, [currentSearchParams, transition]);

  const firstVariant = product.variants.nodes[0];

  /**
   * We're making an explicit choice here to display the product options
   * UI with a default variant, rather than wait for the user to select
   * options first. Developers are welcome to opt-out of this behavior.
   * By default, the first variant's options are used.
   */
  const searchParamsWithDefaults = useMemo(() => {
    const clonedParams = new URLSearchParams(searchParams);

    for (const {name, value} of firstVariant.selectedOptions) {
      if (!searchParams.has(name)) {
        clonedParams.set(name, value);
      }
    }

    return clonedParams;
  }, [searchParams, firstVariant.selectedOptions]);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */

  const selectedVariant = product.selectedVariant ?? firstVariant;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const availableQuantity =
    selectedVariant?.quantityAvailable < 1
      ? 0
      : selectedVariant?.quantityAvailable;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics = {
    ...analytics.products[0],
    quantity: quantity,
  };

  const metafields = selectedVariant?.metafields;

  const isCustomizerEnable =
    metafields[0] && metafields[0].value == 'true' ? true : false;

  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    if (isCustomizerEnable) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
    window.scrollTo(0, 0);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const [lineItems, setLineItems] = useState([]);
  const [productAnalytic, setProductAnalytic] = useState([]);
  useEffect(() => {
    setLineItems([
      {
        merchandiseId: selectedVariant.id,
        quantity: quantity,
      },
    ]);
    setProductAnalytic({
      products: [productAnalytics],
      totalValue: parseFloat(productAnalytics.price),
    });
  }, [quantity, selectedVariant]);

  // useEffect(() => {
  //   console.log('lineItems', lineItems);
  // }, [lineItems]);
  console.log('product', product);

  return (
    <>
      {showModal && (
        <CustomizerModal
          showModal={showModal}
          setShowModal={setShowModal}
          product={product}
          variants={product.variants?.nodes}
          hideModalHandler={hideModalHandler}
          selectedVariant={selectedVariant}
          isOnSale={isOnSale}
          isOutOfStock={isOutOfStock}
          setLineItems={setLineItems}
          productAnalytics={productAnalytics}
          setProductAnalytic={setProductAnalytic}
        />
      )}

      <p className="shopify-installments ">
        <span className="pt-1 mt-0 text-xs font-medium md:text-sm tera-color ">
          <Money withoutTrailingZeros data={selectedVariant?.price} as="span" />
          {isOnSale && (
            <Money
              withoutTrailingZeros
              data={selectedVariant?.compareAtPrice}
              as="span"
              className="ml-1 text-sm font-normal line-through compare-price"
            />
          )}{' '}
          {/* <span className="inline-block font-normal dull_color ">
            | Interest-free installments by
          </span>
          <img
            className="inline-block ml-1 hover:cursor-pointer"
            src={afterpay}
          /> */}
        </span>
      </p>

      <p className="text-sm tracking-wider shiping_calc">
        <Link
          className="underline underline-offset-4 hover:cursor-pointer"
          to="/pages/return-policy"
        >
          Shipping
        </Link>{' '}
        calculated at checkout.
      </p>

      <div className="my-4 border-b"></div>
      <ProductOptions
        variants={product.variants?.nodes}
        options={product.options}
        searchParamsWithDefaults={searchParamsWithDefaults}
      />

      {isCustomizerEnable && !isOutOfStock && (
        <div className="pdp_custrmize_btn pb-9 hover:cursor-pointer">
          <span
            className="px-10 py-3 text-sm !font-extrabold uppercase rounded-full font-heavy text-color "
            onClick={showModalHandler}
          >
            Customize now
          </span>
        </div>
      )}
      {selectedVariant && (
        <div className="flex items-center w-full gap-3 mb-8 quntity_w_cart ">
          <div className="quantity_input ">
            <div className=" w-28 custom-number-input">
              <div className="relative flex w-full ">
                <button onClick={() => handleQuantity('decrement')}>
                  <span className="block w-8 h-8 text-sm font-normal leading-8 text-center border rounded-full outline-none cursor-pointer text-color ">
                    −
                  </span>
                </button>
                <input
                  type="number"
                  className="flex items-center w-full text-sm text-center custom-number-input outline-none text-color focus:outline-none"
                  min="1"
                  // max={availableQuantity}
                  onChange={handleQuantityInput}
                  value={quantity}
                ></input>
                <button
                  data-action="increment"
                  onClick={() => handleQuantity('increment')}
                >
                  <span className="block w-8 h-8 text-sm font-normal leading-8 text-center border rounded-full outline-none cursor-pointer text-color ">
                    +
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="w-full cart_btn">
            <AddToCartButton
              id="checkout_btn"
              // lines={[
              //   {
              //     merchandiseId: selectedVariant.id,
              //     quantity: quantity,
              //   },
              // ]}
              // analytics={{
              //   products: [productAnalytics],
              //   totalValue: parseFloat(productAnalytics.price),
              // }}
              lines={lineItems}
              analytics={productAnalytic}
              variant={isOutOfStock ? 'secondary' : 'primary'}
              data-test="add-to-cart"
              disabled={isOutOfStock}
              className={`${
                isOutOfStock && '!opacity-50'
              } w-full !px-10 !py-3 font-black !uppercase font-heavy product-form__submit btn`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
            </AddToCartButton>
          </div>
        </div>
      )}

      {/* {!isOutOfStock && <ShopPayButton variantIds={[selectedVariant?.id]} />} */}
    </>
  );
}

function ProductOptions({options, variants, searchParamsWithDefaults}) {
  const closeRef = useRef(null);
  // console.log('options', options);
  // console.log('variants', variants);
  const [hideImages, setHideImages] = useState(true);

  let border = false;
  {
    options?.map((item) => {
      if (item?.values?.length > 1) {
        border = true;
      }
    });
  }

  function variantsMatch(value) {
    let matchingVariant;
    variants?.map((item1) => {
      item1?.selectedOptions?.map((item2) => {
        if (item2?.name == 'Color' || item2?.name == 'color') {
          if (item2.value == value) {
            matchingVariant = item1?.image;
          }
        }
      });
    });

    return matchingVariant;
  }

  function checkActiveVariant(option, value) {
    let result = false;
    option.values?.map((item) => {
      if (searchParamsWithDefaults.get(option.name) === value) {
        result = true;
      }
    });

    return result;
  }

  function getReducedImage(src) {
    const parts = src?.split('.');
    const ext = parts.pop();
    const newUrl = `${parts.join('.')}_100x.${ext}`;
    return newUrl;
  }

  return (
    <>
      {options
        .filter((option) => option.values.length > 1)
        .map((option) => (
          <div key={option.name} className="block w-full mb-4 colr_variant">
            <label
              htmlFor={option.name}
              className="block text-sm !font-extrabold text-black uppercase font-heavy"
            >
              {option.name} &nbsp;{' '}
              <span className="text-sm font-normal capitalize dull_color ">
                {option.values.map((value) => (
                  <>
                    {searchParamsWithDefaults.get(option.name) === value && (
                      <>{value}</>
                    )}
                  </>
                ))}
              </span>
            </label>

            {option.name == 'Color' || option.name == 'color' ? (
              <>
                {option.values.length > 7 && hideImages ? (
                  <ul className="grid w-full gap-3 grid-cols-4 xxs:grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-7 mt-2 variant_colors">
                    {option.values.slice(0, 6).map((value) => {
                      let matchingVariant = variantsMatch(value);
                      checkActiveVariant(option, value);

                      return (
                        <li
                          className={`inline-block rounded-md variant_img hover:cursor-pointer ${
                            checkActiveVariant(option, value)
                              ? '!border-black'
                              : 'border-light'
                          } `}
                        >
                          <ProductOptionLink
                            optionName={option.name}
                            optionValue={value}
                            searchParams={searchParamsWithDefaults}
                          >
                            <img
                              className="object-cover h-full w-full mx-auto rounded-md"
                              src={getReducedImage(matchingVariant?.src)}
                              alt={value}
                            />
                          </ProductOptionLink>
                        </li>
                      );
                    })}
                    <li
                      className="flex flex-col items-center justify-center px-2 py-3 rounded-md variant_img hover:cursor-pointer"
                      onClick={() => setHideImages(false)}
                    >
                      <svg
                        className="w-6 "
                        clipRule="evenodd "
                        fillRule="evenodd "
                        strokeLinejoin="round "
                        strokeMiterlimit="2 "
                        viewBox="0 0 24 24 "
                        xmlns="http://www.w3.org/2000/svg "
                      >
                        <path
                          d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193
                                0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z "
                          fillRule="nonzero "
                        />
                      </svg>
                      <p className="text-sm tracking-wider capitalize text-color">
                        see all
                      </p>
                    </li>
                  </ul>
                ) : (
                  <ul className="grid w-full grid-cols-4 xxs:grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-7 gap-3 mt-2 variant_colors">
                    {option.values.map((value) => {
                      let matchingVariant = variantsMatch(value);

                      return (
                        <li
                          className={`inline-block rounded-md variant_img hover:cursor-pointer ${
                            checkActiveVariant(option, value)
                              ? '!border-black'
                              : 'border-light'
                          } `}
                        >
                          <ProductOptionLink
                            optionName={option.name}
                            optionValue={value}
                            searchParams={searchParamsWithDefaults}
                          >
                            <img
                              className="object-cover h-full w-full mx-auto rounded-md "
                              src={getReducedImage(matchingVariant?.src)}
                              alt={value}
                            />
                          </ProductOptionLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : (
              <div className="flex flex-wrap items-baseline gap-4">
                {option.values.length > 7 ? (
                  <div className="relative w-full">
                    <Listbox>
                      {({open}) => (
                        <>
                          <Listbox.Button
                            ref={closeRef}
                            className={clsx(
                              'flex items-center justify-between w-full py-3 px-4 border border-primary',
                              open
                                ? 'rounded-b md:rounded-t md:rounded-b-none'
                                : 'rounded',
                            )}
                          >
                            <span>
                              {searchParamsWithDefaults.get(option.name)}
                            </span>
                            <IconCaret direction={open ? 'up' : 'down'} />
                          </Listbox.Button>
                          <Listbox.Options
                            className={clsx(
                              'border-primary bg-contrast absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                              open ? 'max-h-48' : 'max-h-0',
                            )}
                          >
                            {option.values.map((value) => (
                              <Listbox.Option
                                key={`option-${option.name}-${value}`}
                                value={value}
                              >
                                {({active}) => (
                                  <ProductOptionLink
                                    optionName={option.name}
                                    optionValue={value}
                                    className={clsx(
                                      'text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer',
                                      active && 'bg-primary/10',
                                    )}
                                    searchParams={searchParamsWithDefaults}
                                    onClick={() => {
                                      if (!closeRef?.current) return;
                                      closeRef.current.click();
                                    }}
                                  >
                                    {value}
                                    {searchParamsWithDefaults.get(
                                      option.name,
                                    ) === value && (
                                      <span className="ml-2">
                                        <IconCheck />
                                      </span>
                                    )}
                                  </ProductOptionLink>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </>
                      )}
                    </Listbox>
                  </div>
                ) : (
                  <>
                    {option.values.map((value) => {
                      const checked =
                        searchParamsWithDefaults.get(option.name) === value;
                      const id = `option-${option.name}-${value}`;

                      return (
                        <Text key={id}>
                          <ProductOptionLink
                            optionName={option.name}
                            optionValue={value}
                            searchParams={searchParamsWithDefaults}
                            className={clsx(
                              'leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200',
                              checked
                                ? 'border-primary/50'
                                : 'border-primary/0',
                            )}
                          />
                        </Text>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        ))}

      {border && <div className="my-5 border-b "></div>}
    </>
  );
}

function ProductOptionLink({
  optionName,
  optionValue,
  searchParams,
  children,
  ...props
}) {
  const {pathname} = useLocation();
  const isLangPathname = /\/[a-zA-Z]{2}-[a-zA-Z]{2}\//g.test(pathname);
  // fixes internalized pathname
  const path = isLangPathname
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  const clonedSearchParams = new URLSearchParams(searchParams);
  clonedSearchParams.set(optionName, optionValue);

  return (
    <Link
      {...props}
      preventScrollReset
      prefetch="intent"
      replace
      to={`${path}?${clonedSearchParams.toString()}`}
    >
      {children ?? optionValue}
    </Link>
  );
}

function ProductDetail({title, content, learnMore}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {({open}) => (
        <>
          <Disclosure.Button className="text-left product-info__dropdown-summary">
            <div className="flex justify-between">
              <p className="block text-sm font-bold text-black uppercase">
                {title}
              </p>
            </div>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0 "
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className={` pb-4 pt-2 grid gap-2`}>
              <div
                className="text-sm leading-6"
                dangerouslySetInnerHTML={{__html: content}}
              />
              {learnMore && (
                <div>
                  <Link
                    className="pb-px border-b border-primary/30 text-primary/50"
                    to={learnMore}
                  >
                    Learn more
                  </Link>
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

function metafieldToHtml(content) {
  let parsed = JSON.parse(content);
  let html = '';
  parsed.children.forEach((node) => {
    switch (node.type) {
      case 'heading':
        html += `<h${node.level}>`;
        if (node.children[0].italic) {
          html += `<em>${node.children[0].value}</em>`;
        } else {
          html += `${node.children[0].value}`;
        }
        html += `</h${node.level}>`;
        break;
      case 'list':
        html += `<${node.listType === 'unordered' ? 'ul' : 'ol'}>`;
        node.children.forEach((item) => {
          if (
            item.type === 'text' &&
            item.children[0].bold &&
            item.children[0].italic
          ) {
            html +=
              `<li><strong><em>${item.children[0].value}</em></strong></li>` +
              ' ';
          } else if (item.type === 'text' && item.children[0].bold) {
            html += `<li><strong>${item.children[0].value}</strong></li>` + ' ';
          } else if (item.type === 'text' && item.children[0].italic) {
            html += `<li><em>${item.children[0].value}</em></li>` + ' ';
          } else {
            html += `<li>${item.children[0].value}</li>`;
          }
        });
        html += `<${node.listType === 'unordered' ? '/ul' : '/ol'}>`;
        break;
      case 'paragraph':
        html += `<p>`;
        node.children.forEach((item) => {
          if (item.type === 'text' && item.bold && item.italic) {
            html += `<strong><em>${item.value}</em></strong>` + ' ';
          } else if (item.type === 'text' && item.bold) {
            html += `<strong>${item.value}</strong>` + ' ';
          } else if (item.type === 'text' && item.italic) {
            html += `<em>${item.value}</em>` + ' ';
          } else if (item.type === 'text') {
            html += `${item.value}` + ' ';
          }

          if (
            item.type === 'link' &&
            item.children[0].bold &&
            item.children[0].italic
          ) {
            html +=
              `<a href="${item.url}" target="${item.target}"><strong><em>${item.children[0].value}</em></strong></a>` +
              ' ';
          } else if (item.type === 'link' && item.children[0].bold) {
            html +=
              `<a href="${item.url}" target="${item.target}"><strong>${item.children[0].value}</strong></a>` +
              ' ';
          } else if (item.type === 'link' && item.children[0].italic) {
            html +=
              `<a href="${item.url}" target="${item.target}"><em>${item.children[0].value}</em></a>` +
              ' ';
          } else if (item.type === 'link') {
            html +=
              `<a href="${item.url}" target="${item.target}">${item.children[0].value}</a>` +
              ' ';
          }
        });
        html += `</p>`;
        break;
    }
  });
  return html;
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    metafields(identifiers: 
        [
          {namespace: "custom", key: "enable_customization"},
          {namespace: "custom", key: "customization_charges"},
          {namespace: "custom", key: "customization_image_url_"},
          {namespace: "custom", key: "customizer_image"}
        ]) {
      value
      id
      key
      type
      namespace
      updatedAt
      description
      createdAt
      reference {
              ... on MediaImage {
                id
                image {
                  src
                  originalSrc
                }
              }
            }
    }
    image {
      id
      url
      altText
      width
      height
      src
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    quantityAvailable
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      metafields(identifiers: 
        [
          {namespace: "custom", key: "section_1_title"},
          {namespace: "custom", key: "section_1_content"},
          {namespace: "custom", key: "section_1_image"},
          {namespace: "custom", key: "section_2_title"}
          {namespace: "custom", key: "section_2_subtitle"},
          {namespace: "custom", key: "section_2_image"},
          {namespace: "custom", key: "section_3"}
        ]){
      value
      id
      key
      type
      namespace
      updatedAt
      description
      createdAt
      reference {
              ... on MediaImage {
                id
                image {
                  src
                  originalSrc
                }
              }
              ... on Video {
              id
              mediaContentType
              sources {
              url
              
              format
            }
              previewImage {
                 url
              }
          }
            }
    }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

async function getRecommendedProducts(storefront, productId) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return mergedProducts;
}
