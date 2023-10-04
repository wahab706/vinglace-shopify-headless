import {useState, useEffect, useRef, useContext, Fragment} from 'react';
import {useFetcher} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen';
import {getImageLoadingPriority} from '~/lib/const';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {
  Link,
  Button,
  IconCaret,
  AddToCartButton,
  WishListProvider,
} from '~/components';
import Slider from 'react-slick';
import {Disclosure} from '@headlessui/react';
import heart from '../../../images/heart.png';
import fillHeart from '../../../images/fillHeart.png';

export function ForHimHer(props) {
  const {url, collection} = props;
  const handle = collection.handle;

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

  function GetProductVariantInfo(product, type, variant) {
    let cardLabel;

    const cardProduct = product?.variants ? product : getProductPlaceholder();
    if (!cardProduct?.variants?.nodes?.length) return null;

    const firstVariant = flattenConnection(cardProduct.variants)[0];

    if (!firstVariant) return null;
    const {price, compareAtPrice} = firstVariant;

    if (isDiscounted(variant?.price, variant?.compareAtPrice)) {
      cardLabel = 'Sale';
    } else if (isNewArrival(product.publishedAt)) {
      cardLabel = 'New';
    }

    if (type == 'price') {
      return price;
    } else if (type == 'compareAtPrice') {
      return compareAtPrice;
    } else if (type == 'label') {
      return cardLabel;
    }
  }

  const haveProducts = initialProducts?.length > 0;

  // ================Metafields===================
  // console.log('products', products);

  function metafieldContent(metafield, section) {
    if (section == 1 && metafield[0]) {
      let data = {
        title: metafield[0].value,
        content: metafield[1] ? metafield[1].value : null,
      };
      return data;
    } else if (section == 2 && metafield[2]) {
      let data = {
        title: metafield[2].value,
        content: metafield[3] ? metafield[3].value : null,
      };
      return data;
    } else {
      return null;
    }
  }

  // ================Slider===================
  const thumbnailSliders = useRef([]);
  const previewSliders = useRef([]);

  const handleThumbnailClick = (productIndex, thumbnailIndex) => {
    previewSliders.current[productIndex].slickGoTo(thumbnailIndex);
  };

  const previewSettings = {
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
  };

  const thumbnailSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 3,
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

  const reviewSliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 989,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // arrows: false,
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

  // ============Add/Remove Product from wishlist===========
  const {wishlist, addProductToWishList, removeProductFromWishList} =
    useContext(WishListProvider);

  function isProductInWishlist(product) {
    let productId = product.id.replace('gid://shopify/Product/', '');
    if (wishlist.product_count == 0) {
      return false;
    }
    return wishlist.product_ids.includes(productId);
  }

  const Testimonals = ({image, name, content, rating}) => {
    return (
      <div className="bg-white py-8 px-6 relative testimonal-card">
        <div className="absolute -top-10 left-8">
          <img className=" rounded-full bg-gray-50" src={image} alt="" />
        </div>

        <div className="mx-auto max-w-2xl mt-8">
          <div className="flex gap-x-1 text-indigo-600">
            {[...Array(rating)].map((item, index) => {
              return (
                <svg
                  style={{fill: 'orange'}}
                  className="h-5 w-5 flex-none"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              );
            })}
            {/* <svg
              style={{fill: 'orange'}}
              className="h-5 w-5 flex-none"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              style={{fill: 'orange'}}
              className="h-5 w-5 flex-none"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              style={{fill: 'orange'}}
              className="h-5 w-5 flex-none"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              style={{fill: 'orange'}}
              className="h-5 w-5 flex-none"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              style={{fill: 'orange'}}
              className="h-5 w-5 flex-none"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg> */}
          </div>
          <p className="mt-3 mb-5 text-sm text-color text-left font-regular leading-6">
            {content}
          </p>
          <p className="!font-medium !tracking-widest text-left ml-1 text-sm">
            {name}
          </p>
        </div>
      </div>
    );
  };

  const [quantity, setQuantity] = useState({});

  useEffect(() => {
    const initialQuantity = products?.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {});
    setQuantity(initialQuantity);
  }, [products]);

  const handleQuantityInput = (value, productId) => {
    const updatedQuantity = {...quantity};
    updatedQuantity[productId] = parseInt(value);
    setQuantity(updatedQuantity);
  };

  const handleQuantity = (type, id) => {
    if (type == 'increment') {
      handleQuantityInput(quantity[id] + 1, id);
    } else if (type == 'decrement') {
      if (quantity[id] > 1) {
        handleQuantityInput(quantity[id] - 1, id);
      }
    }
  };

  return (
    <div className="forHim-forHer-page">
      <div className="breadcrumbs-container collection-breadcrumbs">
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumbs__item">
            Home
          </Link>
          <span className="breadcrumbs__separator"></span>
          <span className="breadcrumbs__item ">
            {handle == 'for-him' ? 'For Him' : 'For Her'}
          </span>
        </div>
      </div>

      {/* <div className="block w-full -mt-10 home_img_with_txt "> */}
      <div className="block w-full home_img_with_txt ">
        <div className="page-width ">
          <div className="grid items-center grid-cols-1 gap-10 md:grid-cols-2 img_txt_inner forHimHer-main my-2">
            <div className="image_dv ">
              {collection?.image && (
                <Image
                  className="relative block w-full collection-image"
                  widths={[550]}
                  height={440}
                  loaderOptions={{
                    crop: 'center',
                    scale: 2,
                    width: 550,
                    height: 440,
                  }}
                  data={collection?.image}
                  alt={
                    collection?.image.altText ||
                    `Picture of ${collection.title}`
                  }
                  loading={getImageLoadingPriority(0)}
                />
              )}
            </div>
            <div className="max-w-sm px-6 contant_dv md:p-0">
              {handle == 'for-him' ? (
                <h4 className="pb-4 text-xl font-normal sm:text-2xl text-color">
                  Vinglacé keeps the chill <br />
                  <span className="font-extrabold">Gifts For Him</span>
                  <br />
                  For the guy that has it all
                </h4>
              ) : (
                <h4 className="pb-4 text-xl font-normal sm:text-2xl text-color">
                  Vinglacé keeps the chill <br />
                  <span className="font-extrabold">Gifts For Her</span>
                  <br />
                  Make her feel special
                </h4>
              )}
              <p
                className="m-0 text-sm text-color leading-5"
                style={{letterSpacing: '1px'}}
              >
                {collection?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="feature_produt_slider for-him-page">
        <div className="page-width">
          {haveProducts ? (
            <>
              <div className="grid grid-cols-1 gap-7 inner_ftr_sld md:grid-cols-2">
                {products?.map((product, index) => (
                  <div className="image_slider_with_content" key={product?.id}>
                    <section className="banner-section">
                      <div className="banner-slider">
                        <Slider
                          {...previewSettings}
                          ref={(slider) =>
                            (previewSliders.current[index] = slider)
                          }
                          className="max-w-full slider slider-for"
                        >
                          {product?.variants?.nodes?.map(
                            (variant, previewIndex) => (
                              <div
                                className="relative slider-banner-image "
                                key={variant?.id}
                              >
                                <div className="relative">
                                  <Image
                                    className="relative w-full slider1-image"
                                    widths={[550]}
                                    height={450}
                                    loaderOptions={{
                                      crop: 'center',
                                      scale: 2,
                                      width: 550,
                                      height: 450,
                                    }}
                                    data={variant?.image}
                                    alt={
                                      variant?.image.altText ||
                                      `Picture of ${product.title}`
                                    }
                                    loading={getImageLoadingPriority(
                                      previewIndex,
                                    )}
                                  />
                                </div>
                                {GetProductVariantInfo(product, 'label') && (
                                  <span className="absolute top-0 left-0 px-2 py-1 text-xs font-bold uppercase badge_text">
                                    {GetProductVariantInfo(product, 'label')}
                                  </span>
                                )}
                                <div>
                                  {isProductInWishlist(product) ? (
                                    <div
                                      className="absolute cursor-pointer heart_svg_wishlist top-3 right-3"
                                      onClick={() =>
                                        removeProductFromWishList(
                                          product.id.replace(
                                            'gid://shopify/Product/',
                                            '',
                                          ),
                                        )
                                      }
                                    >
                                      <img src={fillHeart} alt=" image " />
                                    </div>
                                  ) : (
                                    <div
                                      className="absolute cursor-pointer heart_svg_wishlist top-3 right-3"
                                      onClick={() =>
                                        addProductToWishList(
                                          product.id.replace(
                                            'gid://shopify/Product/',
                                            '',
                                          ),
                                        )
                                      }
                                    >
                                      <img src={heart} alt=" image " />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </Slider>

                        {product?.variants?.nodes?.length > 1 ? (
                          <Slider
                            {...thumbnailSettings}
                            ref={(slider) =>
                              (thumbnailSliders.current[index] = slider)
                            }
                            className="relative max-w-full pt-2 overflow-hidden slider slider-nav thumb-image"
                          >
                            {product?.variants?.nodes?.map(
                              (variant, thumbnailIndex) => (
                                <div
                                  className="thumbnail-image"
                                  key={variant?.id}
                                  onClick={() =>
                                    handleThumbnailClick(index, thumbnailIndex)
                                  }
                                >
                                  <div className="thumbImg">
                                    <Image
                                      className="relative w-full slider2-image"
                                      loaderOptions={{
                                        crop: 'center',
                                        scale: 2,
                                        width: 150,
                                      }}
                                      data={variant?.image}
                                      alt={
                                        variant?.image.altText ||
                                        `Picture of ${product.title}`
                                      }
                                      loading={getImageLoadingPriority(
                                        thumbnailIndex,
                                      )}
                                    />
                                  </div>
                                </div>
                              ),
                            )}
                          </Slider>
                        ) : (
                          <div className="thumbnail-image pt-2  ">
                            <div className="thumbImg single-image">
                              <Image
                                className="relative w-full slider2-image"
                                loaderOptions={{
                                  crop: 'center',
                                  scale: 2,
                                  width: 150,
                                }}
                                data={product?.variants?.nodes[0]?.image}
                                alt={
                                  product?.variants?.nodes[0]?.image.altText ||
                                  `Picture of ${product.title}`
                                }
                                loading={getImageLoadingPriority(0)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                    <div className="mt-3 slsider_content">
                      <h1 className="m-0 text-lg sm:text-xl font-medium pdp_title">
                        {product.title}
                      </h1>
                      <h3 className="mt-1 text-sm font-medium tera-color">
                        <Money
                          withoutTrailingZeros
                          data={GetProductVariantInfo(product, 'price')}
                        />

                        {isDiscounted(
                          GetProductVariantInfo(product, 'price'),
                          GetProductVariantInfo(product, 'compareAtPrice'),
                        ) && (
                          <span
                            className="ml-1 text-sm font-normal line-through "
                            style={{color: '#939393'}}
                          >
                            <CompareAtPrice
                              className={'opacity-50'}
                              data={GetProductVariantInfo(
                                product,
                                'compareAtPrice',
                              )}
                            />
                          </span>
                        )}
                      </h3>
                      <p className="mb-5 mt-2 text-sm text-color description">
                        {product?.description}
                      </p>

                      {metafieldContent(product.metafields, 1) && (
                        <Disclosure
                          as="div"
                          key={`section1_${product?.id}`}
                          className="block w-full"
                        >
                          {({open}) => (
                            <>
                              <Disclosure.Button className="flex w-full justify-between items-center py-3 px-5 m-0 h-10 border border-gray-300 rounded-3xl cursor-pointer insort1-js ">
                                <h2 className="max-w-prose text-xs whitespace-pre-wrap inherit text-left font-extrabold uppercase">
                                  {
                                    metafieldContent(product.metafields, 1)
                                      .title
                                  }
                                </h2>
                                <IconCaret direction={open ? 'up' : 'down'} />
                              </Disclosure.Button>

                              <Disclosure.Panel
                                key={`section1_${product?.id}`}
                                className="block w-full pb-5 pt-3 px-4"
                              >
                                <div
                                  className="m-0 pdp-metafield-description"
                                  dangerouslySetInnerHTML={{
                                    __html: metafieldToHtml(
                                      metafieldContent(product.metafields, 1)
                                        .content,
                                    ),
                                  }}
                                ></div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}

                      {metafieldContent(product.metafields, 2) && (
                        <Disclosure
                          as="div"
                          key={`section2_${product?.id}`}
                          className="block w-full mt-4"
                        >
                          {({open}) => (
                            <>
                              <Disclosure.Button className="flex w-full justify-between items-center py-3 px-5 m-0 h-10 border border-gray-300 rounded-3xl cursor-pointer insort1-js ">
                                <h2 className="max-w-prose text-xs whitespace-pre-wrap inherit text-left font-extrabold uppercase">
                                  {
                                    metafieldContent(product.metafields, 2)
                                      .title
                                  }
                                </h2>
                                <IconCaret direction={open ? 'up' : 'down'} />
                              </Disclosure.Button>

                              <Disclosure.Panel
                                key={`section2_${product?.id}`}
                                className="block w-full pb-5 pt-3 px-4"
                              >
                                <div
                                  className="m-0 pdp-metafield-description"
                                  dangerouslySetInnerHTML={{
                                    __html: metafieldToHtml(
                                      metafieldContent(product.metafields, 2)
                                        .content,
                                    ),
                                  }}
                                ></div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}

                      <div className="flex items-center w-full gap-3 mb-8 quntity_w_cart mt-4 ">
                        <div className="quantity_input ">
                          <div className=" w-28 custom-number-input">
                            <div className="relative flex w-full ">
                              <button
                                onClick={() =>
                                  handleQuantity('decrement', product.id)
                                }
                              >
                                <span className="block w-8 h-8 text-sm font-normal leading-8 text-center border rounded-full outline-none cursor-pointer text-color ">
                                  −
                                </span>
                              </button>
                              <input
                                id={product.id}
                                type="number"
                                className="flex items-center w-full text-sm text-center custom-number-input outline-none text-color focus:outline-none"
                                min="1"
                                value={quantity[product.id] || 1}
                                onChange={(e) =>
                                  handleQuantityInput(
                                    e.target.value,
                                    product.id,
                                  )
                                }
                              ></input>
                              <button
                                onClick={() =>
                                  handleQuantity('increment', product.id)
                                }
                              >
                                <span className="block w-8 h-8 text-sm font-normal leading-8 text-center border rounded-full outline-none cursor-pointer text-color ">
                                  +
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full cart_btn ">
                          <AddToCartButton
                            lines={[
                              {
                                merchandiseId: product.variants?.nodes[0]?.id,
                                quantity: quantity[product.id],
                              },
                            ]}
                            variant={
                              !product.variants?.nodes[0]?.availableForSale
                                ? 'secondary'
                                : 'primary'
                            }
                            data-test="add-to-cart"
                            disabled={
                              !product.variants?.nodes[0]?.availableForSale
                            }
                            className={`${
                              !product.variants?.nodes[0]?.availableForSale &&
                              '!opacity-50'
                            } w-full px-10 py-3 font-normal uppercase product-form__submit btn`}
                          >
                            {!product.variants?.nodes[0]?.availableForSale
                              ? 'Out of Stock'
                              : 'Buy Now'}
                          </AddToCartButton>
                        </div>
                      </div>
                    </div>
                  </div>
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
              No products in this collection
            </h4>
          )}
        </div>
      </div>

      <div className="block w-full py-12 review_slider_main testimonal_slider mt-2 mb-0.5 testimonals-section">
        <div className="md:px-8 ">
          <div className="page-width ">
            <h1 className="block w-full pb-12 text-2xl font-semibold text-center capitalize custmr_reviw_hdng ">
              Testimonals
            </h1>

            <Slider
              {...reviewSliderSettings}
              className="w-full md:px-12 text-center slider"
            >
              <Testimonals
                image="https://cdn.shopify.com/s/files/1/2170/1117/t/10/assets/pf-4874cab9-38b5-479a-8643-145d8c1915d7--Essence-05.png?v=1579593197"
                name="PAULA W."
                content="I've been eyeing this for quite a long time but just couldn't pull the trigger on it because of the price. My husband recently asked me what I wanted for my birthday and I told him about the wine chiller so he ended up getting it for me. I am in love with it and wish I had gotten it sooner for days at the pool this past summer. It is perfect and would be a great gift for all my friends!"
                rating={4}
              />
              <Testimonals
                image="https://cdn.shopify.com/s/files/1/2170/1117/t/10/assets/pf-93ba399e-2a92-430b-9dbe-832ec937815d--Essence-10.png?v=1579598586"
                name="Nava T."
                content="I've seen other products, but this one really is very nice. First of all, the packaging is gorgeous. Secondly, the quality of the product is apparent when you hold it in your hand. Finally, the presentation makes it easy to give as a gift. Certainly worth the price in my view."
                rating={5}
              />
              <Testimonals
                image="https://cdn.shopify.com/s/files/1/2170/1117/t/10/assets/pf-b419d9a4-b573-49a5-b2ad-b2f5ca0946a4--Essence-11.png?v=1579598600"
                name="ANNA W."
                content="We use ours ALL of the time, can't say enough good things about how well it works. Looking for new colors!"
                rating={4}
              />
              <Testimonals
                image="https://cdn.shopify.com/s/files/1/2170/1117/t/10/assets/pf-93ba399e-2a92-430b-9dbe-832ec937815d--Essence-10.png?v=1579598586"
                name="Nava T."
                content="I've seen other products, but this one really is very nice. First of all, the packaging is gorgeous. Secondly, the quality of the product is apparent when you hold it in your hand. Finally, the presentation makes it easy to give as a gift. Certainly worth the price in my view."
                rating={5}
              />
              <Testimonals
                image="https://cdn.shopify.com/s/files/1/2170/1117/t/10/assets/pf-4874cab9-38b5-479a-8643-145d8c1915d7--Essence-05.png?v=1579593197"
                name="PAULA W."
                content="I've been eyeing this for quite a long time but just couldn't pull the trigger on it because of the price. My husband recently asked me what I wanted for my birthday and I told him about the wine chiller so he ended up getting it for me. I am in love with it and wish I had gotten it sooner for days at the pool this past summer. It is perfect and would be a great gift for all my friends!"
                rating={5}
              />
              <Testimonals
                image="https://cdn.shopify.com/s/files/1/2170/1117/t/10/assets/pf-b419d9a4-b573-49a5-b2ad-b2f5ca0946a4--Essence-11.png?v=1579598600"
                name="ANNA W."
                content="We use ours ALL of the time, can't say enough good things about how well it works. Looking for new colors!"
                rating={5}
              />
            </Slider>
          </div>
        </div>
      </div>
    </div>
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
