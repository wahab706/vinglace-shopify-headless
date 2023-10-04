import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {defer} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useMatches,
} from '@remix-run/react';
import {ShopifySalesChannel, Seo} from '@shopify/hydrogen';
import {Layout, WishListProvider} from '~/components';
import {GenericError} from './components/GenericError';
import {NotFound} from './components/NotFound';

import style1 from './styles/app.css';
import style2 from './styles/index.css';
import style3 from './styles/customizer.css';
import favicon from '../public/favicon.png';

import {DEFAULT_LOCALE, parseMenu} from './lib/utils';
import invariant from 'tiny-invariant';
import {useAnalytics} from './hooks/useAnalytics';
import Cookies from 'js-cookie';

const seo = ({data, pathname}) => ({
  title: data?.layout?.shop?.name,
  titleTemplate: '%s | Hydrogen Demo Store',
  description:
    data?.layout?.shop?.description?.length > 150
      ? data?.layout?.shop?.description.slice(0, 150) + '...'
      : data?.layout?.shop?.description,
  handle: '@shopify',
  url: `https://hydrogen.shop${pathname}`,
});

export const handle = {
  seo,
};

export const links = () => {
  return [
    {rel: 'stylesheet', href: style1},
    {rel: 'stylesheet', href: style2},
    {rel: 'stylesheet', href: style3},
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    },
    {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
  ];
};

export const meta = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context}) {
  const [cartId, layout] = await Promise.all([
    context.session.get('cartId'),
    getLayoutData(context),
  ]);

  // ============Get Customer  data for Wishlist ===========
  const customerAccessToken = await context.session.get('customerAccessToken');
  const {storefront} = context;

  const customer_query =
    customerAccessToken &&
    (await storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }));
  const customer = customerAccessToken && customer_query?.customer;
  // =======================

  return defer({
    layout,
    customer, // ========passing customer info for wishlist======
    selectedLocale: context.storefront.i18n,
    cart: cartId ? getCart(context, cartId) : undefined,
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: layout.shop.id,
    },
  });
}

function getWishlistToken(cookieName) {
  if (document.cookie.length > 0) {
    let cookieStart = document.cookie.indexOf(cookieName + '=');
    if (cookieStart !== -1) {
      cookieStart = cookieStart + cookieName.length + 1;
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      return window.unescape(document.cookie.substring(cookieStart, cookieEnd));
    }
  }
  return '';
}

export default function App() {
  const data = useLoaderData();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;

  const hasUserConsent = true;
  useAnalytics(hasUserConsent, locale);

  // ============Wishlist code starts here===========
  const customer = data.customer;

  const API_URL = 'https://phpstack-606044-3506545.cloudwaysapps.com/api';
  const token = Cookies.get('_shopify_y');

  const [userEmail, setUserEmail] = useState(customer?.email || null);

  const [wishlist, setWishlist] = useState({
    product_count: 0,
    product_ids: [],
    products: [],
  });

  const checkCustomerWishlist = async () => {
    const url1 = `${API_URL}/customer/wishlists?email=${userEmail}`;
    const url2 = `${API_URL}/customer/wishlists?local_id=${token}`;
    const url = userEmail ? url1 : url2;

    fetch(url, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log('result', result);
        if (result.status == 'success') {
          setWishlist({
            product_count: result.product_count,
            product_ids: result.product_ids,
            products: result.products,
          });
        }
      })
      .catch((error) => {
        console.log('Something Went Wrong with wishlist Api, Try Again!');
      });
  };

  const addProductToWishList = async (productId) => {
    const url1 = `${API_URL}/add/to/wishlist?email=${userEmail}&product_id[]=${productId}`;
    const url2 = `${API_URL}/add/to/wishlist?local_id=${token}&product_id[]=${productId}`;
    const url = userEmail ? url1 : url2;

    fetch(url, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 'success') {
          checkCustomerWishlist();
        } else {
          alert(
            result.message
              ? result.message
              : 'Product not added in wishlist, Try Again!',
          );
        }
      })
      .catch((error) => console.log('Something Went Wrong, Try Again!'));
  };

  const removeProductFromWishList = async (productId) => {
    const url1 = `${API_URL}/remove/wishlist?email=${userEmail}&product_id[]=${productId}`;
    const url2 = `${API_URL}/remove/wishlist?local_id=${token}&product_id[]=${productId}`;
    const url = userEmail ? url1 : url2;

    fetch(url, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 'success') {
          checkCustomerWishlist();
        } else {
          alert(
            result.message
              ? result.message
              : 'Product not removed from wishlist, Try Again!',
          );
        }
      })
      .catch((error) => alert('Something Went Wrong, Try Again!'));
  };

  const assignLocalToEmail = async (email) => {
    const url = `${API_URL}/assign/wishlist/to/email?local_id=${token}&email=${email}`;

    fetch(url, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((result) => {
        setUserEmail(email);
      })
      .catch((error) => console.log('Something Went Wrong, Try Again!'));
  };

  useEffect(() => {
    checkCustomerWishlist();
  }, [userEmail]);

  // console.log('userEmail', userEmail);
  // useEffect(() => {
  //   console.log('wishlist', wishlist);
  // }, [wishlist]);

  // ============Wishlist code ends here===========

  return (
    <html lang={locale.language}>
      <head>
        <Seo />
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        ></link>
        <Links />

        {/* ======Contact us jotForm script========== */}
        <script
          type="text/javascript"
          src="https://form.jotform.com/jsform/231153833566457"
        ></script>
        {/* ======Corporate Gifting jotForm script========== */}
        <script
          type="text/javascript"
          src="https://form.jotform.com/jsform/231163271261446"
        ></script>
        {/* ======Wedding Gift jotForm script========== */}
        <script
          type="text/javascript"
          src="https://form.jotform.com/jsform/231162910039448"
        ></script>

        {/* ======Yopto Reviews script========== */}
        {/* <script
          type="text/javascript"
          async
          src="https://staticw2.yotpo.com/bb0Br6PdUeKAi4D8TdgZj6JM1cwZKiVItbxPTXMf/widget.js"
        ></script> */}
        <script
          type="text/javascript"
          async
          src="https://cdn-widgetsrepository.yotpo.com/v1/loader/bb0Br6PdUeKAi4D8TdgZj6JM1cwZKiVItbxPTXMf"
        ></script>

        {/* <script type="text/javascript">
          window.addEventListener("load", function() {
             var api = new Yotpo.API(yotpo);
              api.refreshWidgets();
          });
        </script> */}
      </head>
      <body>
        <WishListProvider.Provider
          value={{
            wishlist,
            userEmail,
            setUserEmail,
            assignLocalToEmail,
            addProductToWishList,
            removeProductFromWishList,
          }}
        >
          <Layout
            layout={data.layout}
            key={`${locale.language}-${locale.country}`}
          >
            <Outlet />
          </Layout>
        </WishListProvider.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const [root] = useMatches();
  const caught = useCatch();
  const isNotFound = caught.status === 404;
  const locale = root.data?.selectedLocale ?? DEFAULT_LOCALE;

  return (
    <html lang={locale.language}>
      <head>
        <title>{isNotFound ? 'Not found' : 'Error'}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* we must have to wrap these error boundaries into WishListProvider because if
        this is not available then WishListProvider will throw error */}
        <WishListProvider.Provider value={{}}>
          <Layout
            layout={root?.data?.layout}
            key={`${locale.language}-${locale.country}`}
          >
            {isNotFound ? (
              <NotFound type={caught.data?.pageType} />
            ) : (
              <GenericError
                error={{message: `${caught.status} ${caught.data}`}}
              />
            )}
          </Layout>
        </WishListProvider.Provider>
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({error}) {
  const [root] = useMatches();
  const locale = root?.data?.selectedLocale ?? DEFAULT_LOCALE;

  return (
    <html lang={locale.language}>
      <head>
        <title>Error</title>

        <Meta />
        <Links />
      </head>
      <body>
        {/* we must have to wrap these error boundaries into WishListProvider because if
        this is not available then WishListProvider will throw error */}
        <WishListProvider.Provider value={{}}>
          <Layout layout={root?.data?.layout}>
            <GenericError error={error} />
          </Layout>
        </WishListProvider.Provider>
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layoutMenus(
    $language: LanguageCode
    $headerMenuHandle: String!
    $headerNewMenuHandle: String!
    $footerMenuHandle: String!
    $footerBottomMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      id
      name
      description
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    headerNewMenu: menu(handle: $headerNewMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    footerBottomMenu: menu(handle: $footerBottomMenuHandle) {
      id
      items {
        ...MenuItem
      }
    }
  }
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
`;

async function getLayoutData({storefront}) {
  const HEADER_MENU_HANDLE = 'main-menu';
  const HEADER_NEW_MENU_HANDLE = 'new-header-menu';
  const FOOTER_MENU_HANDLE = 'new-footer-menu';
  const NEW_FOOTER_BOTTOM_MENU_HANDLE = 'new-footer-bottom-menu';

  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: HEADER_MENU_HANDLE,
      headerNewMenuHandle: HEADER_NEW_MENU_HANDLE,
      footerMenuHandle: FOOTER_MENU_HANDLE,
      footerBottomMenuHandle: NEW_FOOTER_BOTTOM_MENU_HANDLE,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, customPrefixes)
    : undefined;

  const headerNewMenu = data?.headerNewMenu
    ? parseMenu(data.headerNewMenu, customPrefixes)
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : undefined;

  const footerBottomMenu = data?.footerBottomMenu
    ? parseMenu(data.footerBottomMenu, customPrefixes)
    : undefined;

  return {
    shop: data.shop,
    headerMenu,
    headerNewMenu,
    footerMenu,
    footerBottomMenu,
  };
}

const CART_QUERY = `#graphql
  query CartQuery($cartId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }

  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              availableForSale
              compareAtPrice {
                ...MoneyFragment
              }
              price {
                ...MoneyFragment
              }
              requiresShipping
              title
              image {
                ...ImageFragment
              }
              product {
                handle
                title
                id
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
    }
  }

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }

  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;

export async function getCart({storefront}, cartId) {
  invariant(storefront, 'missing storefront client in cart query');

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
    }
  }
`;
