import {defer} from '@shopify/remix-oxygen';
import React, {Suspense, useState, useEffect} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {
  ProductSwimlane,
  FeaturedCollections,
  Hero,
  Link,
  SliderCard,
  IconFeaturedCategoryArrow,
  IconFeaturedCategoryTick,
} from '~/components';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getHeroPlaceholder} from '~/lib/placeholders';
import {AnalyticsPageType} from '@shopify/hydrogen';
import Slider from 'react-slick';

import homeBanner from '../../images/home-banner.png';
import imgTxt from '../../images/img_txt.png';
import logo1 from '../../images/logo1.png';
import logo2 from '../../images/logo2.png';
import logo3 from '../../images/logo3.png';
import logo4 from '../../images/logo4.png';
import insta1 from '../../images/insta1.png';
import insta2 from '../../images/insta2.png';
import insta3 from '../../images/insta3.png';
import insta4 from '../../images/insta4.png';
import featured1 from '../../images/featured1.png';
import featured2 from '../../images/featured2.png';
import featured3 from '../../images/featured3.png';
import col1 from '../../images/col1.png';
import col2 from '../../images/col2.png';
import col3 from '../../images/col3.png';
import new1 from '../../images/new1.png';
import new2 from '../../images/new2.png';
import new3 from '../../images/new3.png';

export async function loader({params, context}) {
  const {language, country} = context.storefront.i18n;

  if (
    params.lang &&
    params.lang.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the lang URL param is defined, yet we still are on `EN-US`
    // the the lang param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const {shop, hero} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'freestyle'},
  });

  return defer({
    shop,
    primaryHero: hero,
    // These different queries are separated to illustrate how 3rd party content
    // fetching can be optimized for both above and below the fold.
    featuredProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
      {
        variables: {
          /**
           * Country and language properties are automatically injected
           * into all queries. Passing them is unnecessary unless you
           * want to override them from the following default:
           */
          country,
          language,
        },
      },
    ),
    secondaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'backcountry',
        country,
        language,
      },
    }),
    featuredCollections: context.storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    }),
    tertiaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'winter-2022',
        country,
        language,
      },
    }),
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Homepage() {
  const {
    primaryHero,
    secondaryHero,
    tertiaryHero,
    featuredCollections,
    featuredProducts,
  } = useLoaderData();

  // TODO: skeletons vs placeholders
  const skeletons = getHeroPlaceholder([{}, {}, {}]);

  // TODO: analytics
  // useServerAnalytics({
  //   shopify: {
  //     pageType: ShopifyAnalyticsConstants.pageType.home,
  //   },
  // });

  const [featuredTab, setFeaturedTab] = useState(0);

  function handleFeaturedTabClick(index) {
    setFeaturedTab(index);
  }

  const featuredTabData = [
    {label: 'Tab 1', content: 'Wine Chillers'},
    {label: 'Tab 2', content: 'Wine Glasses'},
    {label: 'Tab 3', content: 'Flutes'},
    {label: 'Tab 4', content: 'Tumblers'},
  ];

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
          arrows: false,
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

  const homeProductSliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerMode: true,
        },
      },
    ],
    prevArrow: (
      <button type="button" className="slick-prev3 pull-left">
        <i className="fa fa-angle-left" aria-hidden="true"></i>
      </button>
    ),
    nextArrow: (
      <button type="button" className="slick-next3 pull-right">
        <i className="fa fa-angle-right" aria-hidden="true"></i>
      </button>
    ),
  };

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

  return (
    <>
      {/* {primaryHero && (
        <Hero {...primaryHero} height="full" top loading="eager" />
      )}*/}

      {/* {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;
              return (
                <ProductSwimlane
                  products={products.nodes}
                  title="Featured Products"
                  count={4}
                />
              );
            }}
          </Await>
        </Suspense>
      )} */}

      {/* {secondaryHero && (
        <Suspense fallback={<Hero {...skeletons[1]} />}>
          <Await resolve={secondaryHero}>
            {({hero}) => {
              if (!hero) return <></>;
              return <Hero {...hero} />;
            }}
          </Await>
        </Suspense>
      )}

      {featuredCollections && (
        <Suspense>
          <Await resolve={featuredCollections}>
            {({collections}) => {
              if (!collections?.nodes) return <></>;
              return (
                <FeaturedCollections
                  collections={collections.nodes}
                  title="Collections"
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      {tertiaryHero && (
        <Suspense fallback={<Hero {...skeletons[2]} />}>
          <Await resolve={tertiaryHero}>
            {({hero}) => {
              if (!hero) return <></>;
              return <Hero {...hero} />;
            }}
          </Await>
        </Suspense>
      )} */}

      {/* <!-- ======home image banner====== --> */}
      <section
        className="w-full bg-repeat bg-cover image_banner page-banner home-banner"
        style={{
          backgroundImage: `url(${homeBanner})`,
        }}
      >
        <div className="page-width ">
          <div className="text-center banner_content ">
            <h4 className="text-2xl font-normal text-black uppercase "></h4>
            <h2 className="mt-0 mb-1 font-medium leading-none text-black uppercase "></h2>
          </div>
        </div>
      </section>

      {/* <!-- ===collection slider=== --> */}
      <div className="block w-full home_collection_slider mt-5 ">
        <div className="page-width ">
          <div className="collection_slider w-full inline-block m-0 ">
            <div className="content_col w-full block text-center mb-12 ">
              <span className="text-xs pb-1 font-semibold text-color uppercase m-0 w-full block tracking-wider ">
                this print is spot on.{' '}
              </span>
              <h2
                className="text-color m-0 pb-3 font-medium text-2xl sm:text-3xl leading-8 capitalize "
                style={{letterSpacing: '3px'}}
              >
                Free Valentine’s <br />
                Engraving
              </h2>
              <p
                className="text-color text-sm tracking-wide "
                style={{
                  letterSpacing: '1px',
                  maxWidth: '250px',
                  margin: '0 auto',
                }}
              >
                The newest addition to our Valentine’s Collection is here.
              </p>
              <Link
                to="/collections/engraved-favorites"
                prefetch="intent"
                className="text-sm uppercase btn mt-4 !px-10"
              >
                SHOP NOW
              </Link>
            </div>
            <Slider
              {...homeProductSliderSettings}
              className="review_sec homeproductt slider list-none m-0 p-0"
            >
              <div className="col_grid relative ">
                <div className="col_img relative ">
                  <img className="w-full " src={col1} />
                </div>
                <div className="block w-full absolute bottom-10 text-center ">
                  <Link
                    to="/collections/the-original"
                    prefetch="intent"
                    className="text-sm uppercase btn"
                  >
                    SHOP Wine Chillers
                  </Link>
                </div>
              </div>

              <div className="col_grid relative ">
                <div className="col_img relative ">
                  <img className="w-full " src={col2} />
                </div>
                <div className="block w-full absolute bottom-10 text-center ">
                  <Link
                    to="/collections/the-champagne-flute"
                    prefetch="intent"
                    className="text-sm uppercase btn"
                  >
                    SHOP Flutes
                  </Link>
                </div>
              </div>

              <div className="col_grid relative ">
                <div className="col_img relative ">
                  <img className="w-full " src={col3} />
                </div>
                <div className="block w-full absolute bottom-10 text-center ">
                  <Link
                    to="/collections/the-tumbler"
                    prefetch="intent"
                    className="text-sm uppercase btn"
                  >
                    SHOP Tumblers
                  </Link>
                </div>
              </div>

              <div className="col_grid relative ">
                <div className="col_img relative ">
                  <img className="w-full " src={col1} />
                </div>
                <div className="block w-full absolute bottom-10 text-center ">
                  <Link
                    to="/collections/the-wine-glass"
                    prefetch="intent"
                    className="text-sm uppercase btn"
                  >
                    SHOP Wine Glasses
                  </Link>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>

      {/* <!-- ===image with text==== --> */}
      <div className="block w-full py-10 home_img_with_txt ">
        <div className="page-width ">
          <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-10 img_txt_inner ">
            <div className="image_dv ">
              <img className="block w-full " src={imgTxt} alt="image" />
            </div>
            <div className="contant_dv px-6 md:p-0 ">
              <h4 className="pb-4 text-2xl sm:text-2xl font-medium text-color ">
                VINGLACÉ <br /> Wine & Champagne Chiller
              </h4>
              <ol className="pl-4 list-decimal">
                <li className="m-0 text-sm text-color mb-2">
                  Adjustable top screws up and down to fit most bottle sizes -
                  Doesn’t need to be refrigerated.
                </li>
                <li className="m-0 text-sm text-color mb-2">
                  Stainless steel, double walled, and vacuum insulated to keep
                  the chill for hours.
                </li>
                <li className="m-0 text-sm text-color">
                  Portable seamless body so you can take it anywhere.
                </li>
              </ol>
              {/* <p
                className="m-0 text-xs text-color mb-2"
                style={{letterSpacing: '1px'}}
              >
                1. Adjustable top screws up and down to fit most bottle sizes -
                Doesn’t need to be refrigerated.
              </p>
              <p
                className="m-0 text-xs text-color mb-2"
                style={{letterSpacing: '1px'}}
              >
                2. Stainless steel, double walled, and vacuum insulated to keep
                the chill for hours.
              </p>
              <p
                className="m-0 text-xs text-color "
                style={{letterSpacing: '1px'}}
              >
                3. Portable seamless body so you can take it anywhere.
              </p> */}
              <div className="block w-full pt-6 ">
                <Link
                  to="/collections/the-original"
                  className="text-sm uppercase btn"
                >
                  start personalizing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- =====feature categories tabs section==== --> */}
      <div className="featured_tabs w-full block information_section py-10 ">
        <div className="page-width ">
          <h2 className="md:text-3xl sm:text-2xl text-xl font-medium text-color sm:text-center capitalize mb-1 ">
            Featured Categories
          </h2>
          <div className="tabs w-full inline-block overflow-hidden ">
            <div className="tab-labels w-full block text-center whitespace-nowrap overflow-x-auto scroll-smooth">
              {featuredTabData.map((tab, index) => (
                <React.Fragment key={index}>
                  <input
                    className="hidden"
                    type="radio "
                    name="tabs"
                    id={`tab${index + 1}`}
                    checked={featuredTab == index}
                    onChange={() => handleFeaturedTabClick(index)}
                  />
                  <label
                    className={`inline-block py-2 mx-5 text-center cursor-pointer relative tab-${
                      index + 1
                    } ${featuredTab == index && 'tab-selected'}`}
                    htmlFor={`tab${index}`}
                    onClick={() => handleFeaturedTabClick(index)}
                  >
                    <span className="font-medium text-sm text-color capitalize inline-block tracking-wide">
                      {tab.content}
                    </span>
                  </label>
                </React.Fragment>
              ))}
            </div>

            <div className="tab-contents">
              <div
                id="tab-content1"
                className={`w-full pt-7 tab-content WineChillers ${
                  featuredTab == 0 ? 'block' : 'hidden'
                }`}
              >
                <div className="scroll_design ">
                  <ul className="list-none w-full grid grid-cols-3 gap-3 ">
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={featured1}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-original">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            White Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={featured2}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-original">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Rose Gold Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={featured3}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-original">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Stone Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="block w-full pt-6 text-center ">
                  <Link
                    to="/collections/the-original"
                    className="text-xs uppercase border border-solid border-black rounded-full py-2 px-7 inline-block font-medium tracking-wider"
                  >
                    shop all Wine Chillers
                  </Link>
                </div>
              </div>

              <div
                id="tab-content2 "
                className={`w-full pt-7 tab-content WineGlasses ${
                  featuredTab == 1 ? 'block' : 'hidden'
                }`}
              >
                <div className="scroll_design ">
                  <ul className="list-none w-full grid grid-cols-3 gap-3 ">
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={insta1}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/glass-lined-whiskey-glass">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            White Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={insta2}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/glass-lined-whiskey-glass">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Rose Gold Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={insta3}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/glass-lined-whiskey-glass">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Stone Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="block w-full pt-6 text-center ">
                  <Link
                    to="/collections/glass-lined-whiskey-glass"
                    className="text-sm uppercase border border-solid border-black rounded-full py-2 px-7 inline-block font-black font-heavy"
                  >
                    shop all Wine Glasses
                  </Link>
                </div>
              </div>

              <div
                id="tab-content3 "
                className={`w-full pt-7 tab-content Flutes ${
                  featuredTab == 2 ? 'block' : 'hidden'
                }`}
              >
                <div className="scroll_design ">
                  <ul className="list-none w-full grid grid-cols-3 gap-3 ">
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={insta4}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-champagne-flute">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            White Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={featured2}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-champagne-flute">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Rose Gold Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={featured1}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-champagne-flute">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Stone Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="block w-full pt-6 text-center ">
                  <Link
                    to="/collections/the-champagne-flute"
                    className="text-sm uppercase border border-solid border-black rounded-full py-2 px-7 inline-block font-black font-heavy"
                  >
                    shop all Flutes
                  </Link>
                </div>
              </div>

              <div
                id="tab-content4 "
                className={`w-full pt-7 tab-content Tumblers ${
                  featuredTab == 3 ? 'block' : 'hidden'
                }`}
              >
                <div className="scroll_design ">
                  <ul className="list-none w-full grid grid-cols-3 gap-3 ">
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={insta3}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-tumbler">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            White Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={featured1}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-tumbler">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Rose Gold Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="mb-5 ">
                        <img
                          className="w-full "
                          src={insta4}
                          alt="tab-image "
                        />
                      </div>
                      <Link to="/collections/the-tumbler">
                        <h5 className="pb-1 m-0 text-xl leading-5 capitalize text-color grid_font ">
                          <span className="text-base font-medium">
                            Stone Wine Chiller
                          </span>
                          <IconFeaturedCategoryArrow />
                        </h5>
                      </Link>
                      <div className="svg_with_txt flex gap-1 items-center">
                        <IconFeaturedCategoryTick />
                        <p className="m-0 inline-block text-sm text-color tracking-wider ">
                          with laser-engraved lettering or logo
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="block w-full pt-6 text-center ">
                  <Link
                    to="/collections/the-tumbler"
                    className="text-sm uppercase border border-solid border-black rounded-full py-2 px-7 inline-block font-black font-heavy"
                  >
                    shop all Tumblers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- ===review section=== --> */}
      <div className="block w-full py-12 review_slider_main background1 ">
        <div className="md:px-8 ">
          <div className="page-width ">
            <h1
              className="block w-full pb-8 text-2xl md:text-2xl font-medium text-center text-white capitalize custmr_reviw_hdng mx-auto"
              style={{maxWidth: '300px'}}
            >
              145,00+ 5-Star Reviews
            </h1>
          </div>
          <Slider
            {...reviewSliderSettings}
            className="w-full md:px-12 text-center review_slider slider"
          >
            <div className="px-4">
              <div className="block w-full text-smm md:text-sm text-center text-white product_rating_star ">
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
              </div>
              <h2 className="block pt-1 text-lg md:text-xl font-semibold text-white ">
                Honest opinion
              </h2>
              <p className="text-smm md:text-sm text-white mt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <span className="block pt-3 text-smm md:text-sm text-white ">
                - Chastity
              </span>
            </div>

            <div className="px-4">
              <div className="block w-full text-smm md:text-sm text-center text-white product_rating_star ">
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
              </div>
              <h2 className="block pt-1 text-lg md:text-xl font-semibold text-white ">
                Perfect!
              </h2>
              <p className="text-smm md:text-sm text-white mt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <span className="block pt-3 text-smm md:text-sm text-white ">
                - Amanda Ferguson D.
              </span>
            </div>

            <div className="px-4">
              <div className="block w-full text-smm md:text-sm text-center text-white product_rating_star ">
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
              </div>
              <h2 className="block pt-1 text-lg md:text-xl font-semibold text-white ">
                Growler cap
              </h2>
              <p className="text-smm md:text-sm text-white mt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <span className="block pt-3 text-smm md:text-sm text-white ">
                - Donna T.
              </span>
            </div>

            <div className="px-4">
              <div className="block w-full text-smm md:text-sm text-center text-white product_rating_star ">
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
                <i className="fa fa-star " aria-hidden="true "></i>
              </div>
              <h2 className="block pt-1 text-lg md:text-xl font-semibold text-white ">
                Perfect!
              </h2>
              <p className="text-smm md:text-sm text-white mt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <span className="block pt-3 text-smm md:text-sm text-white ">
                - Amanda Ferguson D.
              </span>
            </div>
          </Slider>
        </div>
      </div>

      {/* <!-- ========product slider====== --> */}
      {featuredProducts && (
        <div className="inline-block w-full py-10 product_slider_main ">
          <div className="page-width ">
            <h3 className="pb-8 text-xl md:text-2xl font-medium text-center ">
              Best Sellers
            </h3>
          </div>

          <Suspense>
            <Await resolve={featuredProducts}>
              {({collection}) => {
                if (!collection?.products?.nodes) return <></>;
                return (
                  <Slider
                    {...bestSellersSliderSettings}
                    className="w-full best_seller slider"
                  >
                    {collection?.products?.nodes?.map((product) => {
                      return <SliderCard product={product} />;
                    })}
                  </Slider>
                );
              }}
            </Await>
          </Suspense>

          <div className="page-width ">
            <div className="block w-full pt-8 text-center slider_buton ">
              <Link
                to="/collections/popular-products"
                prefetch="intent"
                className="text-sm uppercase btn px-8 font-heavy"
              >
                Start Best Sellers
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* <!-- ====multicolumn with text=== --> */}
      <div className="last_pair_short pb-14 pt-0 md:pt-14">
        <div className="page-width ">
          <div className="md:w-2/4 md:m-auto w-full text-center ">
            <h2
              className="md:text-3xl sm:text-xl text-lg font-semibold text-black "
              style={{letterSpacing: '4px'}}
            >
              “If you have a wine lover on your hands, we've found the perfect
              present.”
            </h2>
            <ul className="flex gap-6 mt-5 last_pair_ul ">
              <li>
                <img src={logo1} alt="images" />
              </li>
              <li>
                <img src={logo2} alt="images" />
              </li>
              <li>
                <img src={logo3} alt="images" />
              </li>
              <li>
                <img src={logo4} alt="images" />
              </li>
              <li>
                <img src={logo3} alt="images" />
              </li>
              <li>
                <img src={logo4} alt="images" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <!-- ====instagram section====== --> */}
      <section className="block w-full pb-1 instagram_section ">
        <ul className="grid gap-3 intsa_ul grid-cols-2 md:grid-cols-4 px-1.5">
          <li className="relative w-full insta_li ">
            <a className="relative block " href="# ">
              <img className="relative " src={insta1} alt="insta-image" />
              <div className="absolute top-0 bottom-0 left-0 right-0 block w-full h-full mx-auto my-0 bg-transparent instafeed-overlay "></div>
            </a>
          </li>
          <li className="relative w-full insta_li ">
            <a className="relative block " href="# ">
              <img className="relative " src={insta2} alt="insta-image" />
              <div className="absolute top-0 bottom-0 left-0 right-0 block w-full h-full mx-auto my-0 bg-transparent instafeed-overlay "></div>
            </a>
          </li>
          <li className="relative w-full insta_li ">
            <a className="relative block " href="# ">
              <img className="relative " src={insta3} alt="insta-image" />
              <div className="absolute top-0 bottom-0 left-0 right-0 block w-full h-full mx-auto my-0 bg-transparent instafeed-overlay "></div>
            </a>
          </li>
          <li className="relative w-full insta_li ">
            <a className="relative block " href="# ">
              <img className="relative " src={insta4} alt="insta-image" />
              <div className="absolute top-0 bottom-0 left-0 right-0 block w-full h-full mx-auto my-0 bg-transparent instafeed-overlay "></div>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  ${MEDIA_FRAGMENT}
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    heading: metafield(namespace: "hero", key: "title") {
      value
    }
    byline: metafield(namespace: "hero", key: "byline") {
      value
    }
    cta: metafield(namespace: "hero", key: "cta") {
      value
    }
    spread: metafield(namespace: "hero", key: "spread") {
      reference {
        ...Media
      }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference {
        ...Media
      }
    }
  }
`;

const HOMEPAGE_SEO_QUERY = `#graphql
  ${COLLECTION_CONTENT_FRAGMENT}
  query collectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      id
      description
    }
  }
`;

const COLLECTION_HERO_QUERY = `#graphql
  ${COLLECTION_CONTENT_FRAGMENT}
  query collectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
  }
`;

// @see: https://shopify.dev/api/storefront/latest/queries/products
export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection( id: "gid://shopify/Collection/159089360992") {
    products(first: 10) {
        nodes {
         ...ProductCard
        }
    }
  }
  }
`;

// @see: https://shopify.dev/api/storefront/latest/queries/collections
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 4,
      sortKey: UPDATED_AT
    ) {
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
  }
`;
