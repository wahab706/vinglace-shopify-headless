import {useIsHomePath} from '~/lib/utils';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconAccount,
  IconBag,
  IconSearch,
  IconCart,
  Heading,
  IconMenu,
  IconClose,
  IconCaret,
  IconWishList,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
  IconFacebook,
  IconInstagram,
  WishListProvider,
} from '~/components';
import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {useLocation} from 'react-router-dom';
import {
  Suspense,
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  Fragment,
} from 'react';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import logo from '../images/logo.png';
import heartIcon from '../images/heartIcon.png';
import searchIcon from '../images/searchIcon.png';
import userIcon from '../images/userIcon.png';
import footerImage from '../images/footer-logo.png';
import info1 from '../images/info1.png';
import info2 from '../images/info2.png';
import info3 from '../images/info3.png';
import info4 from '../images/info4.png';

import Slider from 'react-slick';

export function Layout({children, layout}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <AnnouncementBar />
        <Header
          title={layout?.shop.name ?? 'Hydrogen'}
          menu={layout?.headerMenu}
          newMenu={layout?.headerNewMenu}
        />
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      <Footer menu={layout?.footerMenu} bottomMenu={layout?.footerBottomMenu} />
    </>
  );
}

function Header({title, menu, newMenu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {newMenu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={newMenu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={newMenu}
        openCart={openCart}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({menu, onClose}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({title, isHome, openCart, openMenu}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.lang ? `/${params.lang}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading className="font-bold text-center" as={isHome ? 'h1' : 'h2'}>
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <Link
          to="/account"
          className="relative flex items-center justify-center w-8 h-8"
        >
          {/* <IconAccount /> */}
          <img src={userIcon} alt="Account" className="w-5 h-5" />
        </Link>
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({isHome, menu, openCart, title}) {
  const params = useParams();
  // const {y} = useWindowScroll();

  const {wishlist} = useContext(WishListProvider);

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();

  const handleNavChildOpen = (e) => {
    e.preventDefault();
    const siblings = e.target.children;
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] !== e.target) {
        siblings[i].classList.add('is-active');
      }
    }
  };

  const handleNavChildClose = (e) => {
    e.preventDefault();
    const parent = e.target.parentNode.parentNode;
    parent.classList.remove('is-active');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleMobileMenuClose = () => {
    setTimeout(() => {
      setMobileMenuIsOpen(false);
      setMobileSearch(false);
    }, 1000);
  };

  useEffect(() => {
    if (!mobileMenuIsOpen) {
      const parentElement = document.querySelector('.mobile_menu_navigations');
      const childElements = parentElement.querySelectorAll('.is-active');

      childElements.forEach((element) => {
        element.classList.remove('is-active');
      });
    }
  }, [mobileMenuIsOpen]);

  useEffect(() => {
    setSearchActive(false);
    handleMobileMenuClose();
  }, [location]);

  return (
    <>
      <div className="main_header">
        <span
          className={`search-overlay ${searchActive ? 'fixed' : 'relative'} `}
        ></span>

        <div
          className={` header-search py-7 px-2 md:px-6 ${
            searchActive ? 'flex' : 'hidden'
          } `}
          ref={searchRef}
        >
          <Form
            method="get"
            action={params.lang ? `/${params.lang}/search` : '/search'}
            className="flex items-center gap-2 w-full justify-center"
          >
            <span className="relative w-full page-width search-page text-xs">
              <Input
                className=" bg-transparent placeholder:opacity-80 pl-10 rounded-full h-10"
                type="search"
                variant="minisearch"
                placeholder="Search here"
                name="q"
              />
              <span className="search-icon absolute left-5 md:left-9  flex items-center justify-center w-8 h-8 ">
                <IconSearch />
              </span>
              <button className="search-button" type="submit">
                Search
              </button>
            </span>
          </Form>
          <button
            className="close_search cursor-pointer"
            onClick={() => setSearchActive(false)}
          >
            <IconClose />
          </button>
        </div>

        <header className="max-w-full px-2 md:px-5 header-wrapper ">
          <div className="relative flex items-center justify-between py-1 header header--has-menu">
            <h1 className="header_left inline-block lg:mr-1">
              <Link
                to="/"
                prefetch="intent"
                className="header_logo hidden lg:block "
              >
                <div className="header_logo_img">
                  <img className="w-full" src={logo} alt="vinglace" />
                </div>
              </Link>
              <div className="flex lg:hidden">
                <button
                  onClick={() => setMobileMenuIsOpen(true)}
                  className=" inline-flex items-center justify-center rounded-md  text-black"
                >
                  <span className="sr-only">Menu</span>
                  <IconMenu />
                </button>
                {/* <!-- mobile menu drawer --> */}
                <div
                  className={`mobile_menu_drawer fixed top-0 left-0 w-full h-full bg-white overflow-y-scroll invisible
                ${mobileMenuIsOpen ? 'active' : ''} `}
                  id="mobile_menu"
                >
                  {/* <!-- drawer menu header --> */}
                  <header
                    className="max-w-full px-2  header-wrapper "
                    style={{borderBottom: '1px solid #E8E8E8'}}
                  >
                    <div className="flex items-center justify-between py-1 header header--has-menu">
                      <h1 className="header_left">
                        <div className="flex">
                          <button
                            onClick={() => setMobileMenuIsOpen(false)}
                            className="close_drawer cursor-pointer"
                          >
                            <IconClose />
                          </button>
                        </div>
                      </h1>
                      <div
                        className="header_center"
                        onClick={() => setMobileMenuIsOpen(false)}
                      >
                        <Link
                          to="/"
                          prefetch="intent"
                          className="header_logo inline-flex flex-wrap justify-center w-full "
                        >
                          <div className="header_logo_img">
                            <img className="w-full" src={logo} alt="vinglace" />
                          </div>
                        </Link>
                      </div>
                      <div className="flex items-center header_icons relative">
                        <span
                          className="search_icon mobile_srch relative"
                          onClick={() => setMobileSearch(true)}
                        >
                          <IconSearch />
                        </span>

                        <Link
                          to="/account"
                          className="account_icon inline-block lg:hidden"
                        >
                          <img
                            src={userIcon}
                            alt="Account"
                            className="w-4 h-4"
                          />
                          <span className="sr-only ">Log in</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          className="wishicon inline-block lg:hidden pr-2"
                        >
                          <span className="relative flex ">
                            <img
                              src={heartIcon}
                              alt="Search"
                              className="mt-0.5 w-4 h-4"
                            />
                            {wishlist?.product_count > 0 ? (
                              <div className="wishlist-count">
                                <span>{wishlist?.product_count}</span>
                              </div>
                            ) : null}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </header>
                  {/* <!-- drawer menu search --> */}
                  <div
                    className={`drawer_search ${
                      mobileSearch ? 'block' : 'hidden'
                    } `}
                    style={{borderBottom: '1px solid #E8E8E8'}}
                  >
                    <Form
                      method="get"
                      action={
                        params.lang ? `/${params.lang}/search` : '/search'
                      }
                      onSubmit={handleMobileMenuClose}
                    >
                      <div className="search_bar px-3 py-4  relative ">
                        <input
                          className="w-full py-2 pl-8 pr-5 relative rounded-full bg-white/5 text-sm font-normal !border-gray-300 text-black focus:outline-none placeholder:text-gray-600"
                          type="search"
                          name="q"
                          variant="minisearch"
                          placeholder="Search here"
                        />
                        <button
                          className="toggle_svg absolute w-5 h-5 !left-5"
                          type="submit"
                        >
                          <IconSearch />
                        </button>
                      </div>
                    </Form>
                  </div>
                  {/* <!-- ==end drawer search menu=== --> */}
                  {/* <!-- drawer navigation menu --> */}
                  <div className="mobile_menu_navigations">
                    <ul className="nav relative w-auto overflow-hidden">
                      {(menu?.items || []).map((item) => (
                        <li className="nav__item block">
                          {item?.items?.length ? (
                            <Link
                              key={item.id}
                              to={item.to}
                              target={item.target}
                              className="nav__link flex items-center justify-between px-2 py-2 text-xs font-black uppercase text-color"
                              onClick={handleNavChildOpen}
                            >
                              {item.title}{' '}
                              <i className="fa fa-long-arrow-right "></i>
                              <ul className="nav__sub absolute top-0 right-0 w-full h-full bg-white opacity-0 invisible">
                                <li
                                  className="nav__item block"
                                  onClick={handleNavChildClose}
                                >
                                  <span className="nav__link sub__close block px-2 py-2 text-xs font-black uppercase text-color">
                                    <i className="fa fa-long-arrow-left"></i>{' '}
                                    Back
                                  </span>
                                </li>
                                {(item?.items || []).map((item1) => (
                                  <li className="nav__item block">
                                    <Link
                                      key={item1.id}
                                      to={item1.to}
                                      target={item1.target}
                                      prefetch="intent"
                                      className="nav__link block px-2 py-2 text-xs font-black uppercase text-color"
                                      onClick={() => setMobileMenuIsOpen(false)}
                                    >
                                      {item1.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </Link>
                          ) : (
                            <Link
                              key={item.id}
                              to={item.to}
                              target={item.target}
                              prefetch="intent"
                              className="nav__link block px-2 py-2 text-xs font-black uppercase text-color"
                              onClick={() => setMobileMenuIsOpen(false)}
                            >
                              {item.title}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* <!----===end drawer navigation menu===  --> */}

                  {/* <!-- drawer bottom navigation menu --> */}
                  <div className="bottom_navigation absolute bottom-4">
                    <ul className="list-none p-0 m-0">
                      <li>
                        <Link
                          to="/"
                          className="px-2 py-2 text-xs font-black capitalize text-color "
                        >
                          Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/"
                          className="px-2 py-2 text-xs font-black capitalize text-color "
                        >
                          Help
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wishlist"
                          className="px-2 py-2 text-xs font-black capitalize text-color "
                        >
                          Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/"
                          className="px-2 py-2 text-xs font-black capitalize text-color "
                        >
                          Store Locator
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- drawer bottom navigation menu --> */}
                </div>
                {/* <!-- end mobile menu drawer --> */}
              </div>
            </h1>
            <div className="header_center ">
              <nav className="header__inline-menu hidden lg:inline-block ">
                <ul
                  className="relative inline-flex flex-wrap justify-center w-full list-menu "
                  role="list "
                >
                  {(menu?.items || []).map((item) => (
                    <li>
                      {item?.items?.length ? (
                        <div className="relative dropdown">
                          <Link
                            key={item.id}
                            to={item.to}
                            target={item.target}
                            className="px-2 py-2 text-sm font-black uppercase text-color "
                          >
                            <span className="relative px-2 py-2 text-sm font-bold uppercase cursor-pointer drop_down_menu text-color hover:underline ">
                              {item.title}
                            </span>
                            <div className="absolute hidden p-3 bg-white dropdown-content">
                              {(item?.items || []).map((item1) => (
                                <Link
                                  key={item1.id}
                                  to={item1.to}
                                  target={item1.target}
                                  prefetch="intent"
                                  className="block float-none pb-1 text-xs font-medium capitalize text-color hover:underline"
                                >
                                  {item1.title}
                                </Link>
                              ))}
                            </div>
                          </Link>
                        </div>
                      ) : (
                        <Link
                          key={item.id}
                          to={item.to}
                          target={item.target}
                          prefetch="intent"
                          className={({isActive}) =>
                            isActive
                              ? 'pb-1 border-b -mb-px px-2 py-2 text-sm font-bold uppercase text-color'
                              : 'pb-1 px-2 py-2 text-sm font-bold uppercase text-color'
                          }
                          // className="px-2 py-2 text-sm font-black uppercase text-color "
                        >
                          {item.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <Link
                to="/"
                prefetch="intent"
                className="header_logo inline-flex flex-wrap justify-center w-full lg:hidden "
              >
                <div className="header_logo_img ">
                  <img className="w-full " src={logo} alt="vinglace " />
                </div>
              </Link>
            </div>
            <div className="flex items-center header_icons ">
              <span
                className="search_icon hit_toggle relative hover:cursor-pointer pr-1 lg:p-0"
                onClick={() => setSearchActive(true)}
              >
                <img src={searchIcon} alt="Search" className="w-5 h-5" />
              </span>

              <Link
                to="/account"
                className="account_icon hidden lg:inline-block"
              >
                <img src={userIcon} alt="Account" className="w-5 h-5" />
                <span className="sr-only ">Log in</span>
              </Link>

              <Link
                to="/wishlist"
                className="wishicon hidden lg:inline-block pr-3.5"
              >
                <span className="relative flex ">
                  <img src={heartIcon} alt="Search" className="w-5 h-5" />
                  {wishlist?.product_count > 0 ? (
                    <div className="wishlist-count">
                      <span>{wishlist?.product_count}</span>
                    </div>
                  ) : null}
                </span>
              </Link>

              <CartCount isHome={isHome} openCart={openCart} />
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

function CartCount({isHome, openCart}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        {/* <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div> */}

        <span className="relative flex items-start gap-1 lg:pl-4 header__icon--cart ">
          <IconCart />
          <span className="sr-only ">Cart</span>
          <div className="text-xs sm:text-sm text-center lg:underline bubble cart-count-bubble ">
            <span aria-hidden="true ">({count || 0})</span>
          </div>
        </span>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu, bottomMenu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  const footerMenu = [
    {
      title: 'Shop',
    },
  ];
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };
  return (
    <>
      {/* <!-- ====footer uppper content==== --> */}
      <div className="inline-block w-full information_section center py-7 ">
        <div className="page-width ">
          <ul className="grid justify-center grid-cols-2 gap-4 md:grid-cols-4 md:gap-2 p-0 m-0 list-none information_ul ">
            <li>
              <div className="flex items-center gap-3 md:gap-5 info_inner ">
                <div className="info_img_dv ">
                  <img src={info1} alt="images " />
                </div>
                <span className="text-smm md:text-sm font-medium leading-5 uppercase info_ul_txt ">
                  innovative design
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-3 md:gap-5 info_inner ">
                <div className="info_img_dv ">
                  <img src={info2} alt="images " />
                </div>
                <span className="text-smm md:text-sm font-medium leading-5 uppercase info_ul_txt ">
                  lifetime Warranty
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-3 md:gap-5 info_inner ">
                <div className="info_img_dv ">
                  <img src={info3} alt="images " />
                </div>
                <span className="text-smm md:text-sm font-medium leading-5 uppercase info_ul_txt ">
                  flawless custom service
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-3 md:gap-5 info_inner ">
                <div className="info_img_dv ">
                  <img src={info4} alt="images " />
                </div>
                <span className="text-smm md:text-sm font-medium leading-5 uppercase info_ul_txt ">
                  free shipping on u.s order overs $50
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <footer
        className="footer_section background1"
        aria-labelledby="footer-heading "
      >
        <div className="page-width ">
          <div className="max-w-full  pb-6 pt-2 md:!py-16">
            <div className="grid grid-cols-5 md:flex gap-5 inner_footer ">
              <div className="space-y-7 footer-block footer-block-25">
                <img
                  className="h-14 hidden md:block"
                  src={footerImage}
                  alt="Company name"
                />
                <p
                  className="text-xs font-medium leading-6 uppercase footer_color "
                  style={{letterSpacing: '1px'}}
                >
                  Stay Connected
                </p>

                <div className="flex !mt-4 gap-3 social_icons ">
                  <a
                    href="https://www.facebook.com/THEVINGLACE"
                    target="_blank"
                    className="text-white "
                  >
                    <span className="sr-only ">Facebook</span>
                    <IconFacebook />
                  </a>

                  <a
                    href="https://www.instagram.com/thevinglace/"
                    target="_blank"
                    className="text-white "
                  >
                    <span className="sr-only ">Instagram</span>
                    <IconInstagram />
                  </a>
                </div>

                {/* <div className="relative location_price_select mb-12">
                  <select
                    id="location "
                    name="location "
                    className="relative block w-full pt-4 pb-1.5 pl-4 pr-8 mt-2 text-black border-0 rounded-full focus:outline-none sm:text-sm sm:leading-6 "
                  >
                    <option defaultChecked>USD</option>
                    <option>Aub</option>
                    <option>Rud</option>
                  </select>
                  <label
                    htmlFor="location "
                    className="absolute top-0 left-0 block px-5 text-xs font-medium leading-7 text-black uppercase "
                  >
                    Location
                  </label>
                </div> */}
                <CountrySelector />
              </div>

              <div
                className="block md:hidden border-0 border-t border-light-gray-color opacity-20 mt-11"
                style={{marginLeft: '-15px', marginRight: '-15px'}}
              ></div>

              <div className="footer-block block md:hidden">
                <FooterEmailSection />
              </div>

              <div className="hidden md:block  footer-block-auto">
                {(menu?.items || []).map((item, index) => (
                  <div key={item.id} className="footer-block">
                    <Disclosure>
                      {({open}) => (
                        <>
                          <Disclosure.Button className="text-left md:cursor-default w-full">
                            {index == 0 && (
                              <div
                                className=" block md:hidden border-0 border-t border-light-gray-color opacity-20 mb-4 mt-6"
                                style={{
                                  marginLeft: '-15px',
                                  marginRight: '-15px',
                                }}
                              ></div>
                            )}
                            <h3
                              className={` text-xs font-normal leading-6 text-white uppercase flex items-center justify-between`}
                            >
                              {item.title}

                              {item?.items?.length > 0 && (
                                <span className="md:hidden">
                                  <IconCaret direction={open ? 'up' : 'down'} />
                                </span>
                              )}
                            </h3>
                          </Disclosure.Button>
                          {item?.items?.length > 0 ? (
                            <ul
                              className={`${
                                open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                              } overflow-hidden transition-all duration-300 md:mt-6 space-y-4`}
                              role="list "
                            >
                              <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                                <Disclosure.Panel static>
                                  <nav className="grid gap-2 mt-2">
                                    {item?.items.map((subItem) => (
                                      <FooterLink
                                        key={subItem.id}
                                        item={subItem}
                                        className="text-xs font-medium capitalize footer_color"
                                      />
                                    ))}
                                  </nav>
                                </Disclosure.Panel>
                              </Suspense>
                            </ul>
                          ) : null}
                          <div
                            className="block md:hidden border-0 border-t border-light-gray-color opacity-20 mt-2"
                            style={{marginLeft: '-15px', marginRight: '-15px'}}
                          ></div>
                        </>
                      )}
                    </Disclosure>
                  </div>
                ))}
              </div>

              {(menu?.items || []).map((item, index) => (
                <div key={item.id} className="footer-block block md:hidden">
                  <Disclosure>
                    {({open}) => (
                      <>
                        <Disclosure.Button className="text-left md:cursor-default w-full">
                          {index == 0 && (
                            <div
                              className=" block md:hidden border-0 border-t border-light-gray-color opacity-20 mb-4 mt-6"
                              style={{
                                marginLeft: '-15px',
                                marginRight: '-15px',
                              }}
                            ></div>
                          )}
                          <h3
                            className={` text-xs font-normal leading-6 text-white uppercase flex items-center justify-between`}
                          >
                            {item.title}

                            {item?.items?.length > 0 && (
                              <span className="md:hidden">
                                <IconCaret direction={open ? 'up' : 'down'} />
                              </span>
                            )}
                          </h3>
                        </Disclosure.Button>
                        {item?.items?.length > 0 ? (
                          <ul
                            className={`${
                              open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                            } overflow-hidden transition-all duration-300 md:mt-6 space-y-4`}
                            role="list "
                          >
                            <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                              <Disclosure.Panel static>
                                <nav className="grid gap-2 mt-2">
                                  {item?.items.map((subItem) => (
                                    <FooterLink
                                      key={subItem.id}
                                      item={subItem}
                                      className="text-xs font-medium capitalize footer_color"
                                    />
                                  ))}
                                </nav>
                              </Disclosure.Panel>
                            </Suspense>
                          </ul>
                        ) : null}
                        <div
                          className="block md:hidden border-0 border-t border-light-gray-color opacity-20 mt-2"
                          style={{marginLeft: '-15px', marginRight: '-15px'}}
                        ></div>
                      </>
                    )}
                  </Disclosure>
                </div>
              ))}

              <div className="footer-block hidden md:block footer-block-25">
                <FooterEmailSection />
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-center pt-8 footer__column ">
              <div className="footer__copyright caption ">
                <Link to="/">
                  <small className="pr-2 text-xs capitalize footer_color font-regular">
                    Copyright © 2023 Vinglacé.com.
                  </small>
                </Link>
              </div>
              <ul
                role="list "
                className="flex flex-wrap justify-center md:justify-start bottom-links "
              >
                {(bottomMenu?.items || []).map((item) => (
                  <FooterLink
                    key={item.id}
                    item={item}
                    className="relative px-2 text-xxs md:text-xs capitalize footer_color"
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

const FooterEmailSection = () => {
  return (
    <>
      <h3 className="text-xxs font-medium leading-6 text-white ">
        STAY IN TOUCH
      </h3>
      <p
        className="mt-2 text-xs leading-6 text-white "
        style={{letterSpacing: '1px'}}
      >
        Get the inside scoop on new products, promotions, drink recipes and
        more.
      </p>
      <form className="relative mt-6 ">
        <label
          htmlFor="email-address "
          className="absolute top-0 left-0 z-10 block px-4 text-xxs font-medium leading-7 text-black uppercase "
        >
          Email address
        </label>
        <input
          type="email "
          name="email-address "
          id="email-address "
          autoComplete="email "
          placeholder="Enter your email address "
          required
          className="w-full relative min-w-0 appearance-none rounded-full border-0 bg-white px-4 pt-5 pb-2.5 text-sm text-black focus:outline-none
                        placeholder:text-black opacity-100 sm:text-xs "
        />
        <div className="mt-4 sm:flex-shrink-0 ">
          <button
            type="submit "
            className="flex items-center justify-center w-full px-3 py-2 text-xs font-medium tracking-wider text-white uppercase border-2 border-white rounded-full focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-2 "
          >
            sign up
          </button>
        </div>
      </form>
    </>
  );
};

const FooterLink = ({item, ...props}) => {
  if (item.to.startsWith('http')) {
    return (
      <li>
        <a
          href={item.to}
          target={item.target}
          rel="noopener noreferrer"
          {...props}
        >
          {item.title}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link to={item.to} target={item.target} prefetch="intent" {...props}>
        {item.title}
      </Link>
    </li>
  );
};

function FooterMenu({menu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item?.items.map((subItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}

const AnnouncementBar = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    // autoplay: true,
    prevArrow: (
      <button type="button" className="slick-prev4 pull-left">
        <i className="fa fa-angle-left" aria-hidden="true"></i>
      </button>
    ),
    nextArrow: (
      <button type="button" className="slick-next4 pull-right">
        <i className="fa fa-angle-right" aria-hidden="true"></i>
      </button>
    ),
  };

  return (
    <div className="block w-full text-center announcement background1">
      <div className="px-2 md:px-5 py-2">
        <Slider {...settings} className="annoncmt_slider">
          <span className="block w-full text-xxs sm:text-xs text-white uppercase announcement__text font-medium tracking-wider center">
            FREE VALENTINE'S ENGRAVING.{' '}
            <Link to="/" className="text-white underline font-heavy">
              free shipping
            </Link>
          </span>
          <span className="block w-full text-xxs sm:text-xs text-white uppercase announcement__text font-medium tracking-wider center">
            FREE VALENTINE'S ENGRAVING.{' '}
            <a to="/" className="text-white underline font-heavy">
              free shipping
            </a>
          </span>
          <span className="block w-full text-xxs sm:text-xs text-white uppercase announcement__text font-medium tracking-wider center">
            FREE VALENTINE'S ENGRAVING.{' '}
            <a to="/" className="text-white underline font-heavy">
              free shipping
            </a>
          </span>
          <span className="block w-full text-xxs sm:text-xs text-white uppercase announcement__text font-medium tracking-wider center">
            FREE VALENTINE'S ENGRAVING.{' '}
            <a to="/" className="text-white underline font-heavy">
              free shipping
            </a>
          </span>
          <span className="block w-full text-xxs sm:text-xs text-white uppercase announcement__text font-medium tracking-wider center">
            FREE VALENTINE'S ENGRAVING.{' '}
            <a to="/" className="text-white underline font-heavy">
              free shipping
            </a>
          </span>
        </Slider>
      </div>
    </div>
  );
};
