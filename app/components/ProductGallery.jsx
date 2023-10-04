import {MediaFile} from '@shopify/hydrogen';
import {ATTR_LOADING_EAGER} from '~/lib/const';
import {useState, useEffect} from 'react';
import heart from '../images/heart.png';
import fillHeart from '../images/fillHeart.png';

export function ProductGallery({
  media,
  label,
  product,
  wishlist,
  addProductToWishList,
  removeProductFromWishList,
}) {
  if (!media.length) {
    return null;
  }

  const [expandImage, setExpandImage] = useState(media[0].image.url);

  useEffect(() => {
    setExpandImage(media[0].image.url);
  }, [media]);

  useEffect(() => {
    const allClass = document.querySelectorAll(
      '.product-slideshow__thumbnails-item--image',
    );
    allClass[0].classList.add('product-slideshow__thumbnails-item-active');
  }, [media]);

  function addActiveClass(ref) {
    const allClass = document.querySelectorAll(
      '.product-slideshow__thumbnails-item--image',
    );
    allClass.forEach((box) => {
      box.classList.remove('product-slideshow__thumbnails-item-active');
    });

    let activeClass = document.getElementById(ref);
    activeClass.classList.add('product-slideshow__thumbnails-item-active');
  }

  const handleImgage = (img, ref) => {
    setExpandImage(img);
    addActiveClass(ref);
  };

  function isProductInWishlist() {
    let productId = product.id.replace('gid://shopify/Product/', '');
    if (wishlist.product_count == 0) {
      return false;
    }
    return wishlist.product_ids.includes(productId);
  }

  return (
    <div className="product-slideshow">
      <div className="product-slideshow__galleryImage flex flex-col gap-5 md:flex-row-reverse ">
        {/* <div id="product-thumbnail block w-full md:w-1/6 thumnail-images ">
          <div className="product-slideshow__thumbnails">
            {media.map((med, i) => {
              let mediaProps = {};
              const isFullWidth = i % 3 === 0;

              const data = {
                ...med,
                image: {
                  ...med.image,
                  altText: med.alt || 'Product image',
                },
              };

              switch (med.mediaContentType) {
                case 'IMAGE':
                  mediaProps = {
                    width: 800,
                    widths: [400, 800, 1200, 1600, 2000, 2400],
                  };
                  break;
                case 'VIDEO':
                  mediaProps = {
                    width: '100%',
                    autoPlay: true,
                    controls: false,
                    muted: true,
                    loop: true,
                    preload: 'auto',
                  };
                  break;
                case 'EXTERNAL_VIDEO':
                  mediaProps = {width: '100%'};
                  break;
                case 'MODEL_3D':
                  mediaProps = {
                    width: '100%',
                    interactionPromptThreshold: '0',
                    ar: true,
                    loading: ATTR_LOADING_EAGER,
                    disableZoom: true,
                  };
                  break;
              }

              if (i === 0 && med.mediaContentType === 'IMAGE') {
                mediaProps.loading = ATTR_LOADING_EAGER;
              }

              return (
                <div
                  key={med.id || med.image.id}
                  id={med.id}
                  className="product-slideshow__thumbnails-item product-slideshow__thumbnails-item--image "
                  onClick={() => handleImgage(med.image.url, med.id)}
                  // onMouseEnter={() => setExpandImage(med.image.url)}
                >
                  <MediaFile
                    tabIndex="0"
                    data={data}
                    sizes={
                      isFullWidth
                        ? '(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw'
                        : '(min-width: 64em) 30vw, (min-width: 48em) 25vw, 90vw'
                    }
                    options={{
                      crop: 'center',
                      scale: 2,
                    }}
                    {...mediaProps}
                  />
                </div>
              );
            })}
          </div>
          <div className="shadow shadow-top"></div>
          <div className="shadow shadow-bottom"></div>
        </div> */}

        <div
          className="relative product-slideshow__mainSlides product-mainSlide-desktops
          hidden md:block w-full md:w-5/6 feature_image "
        >
          <img alt="expandImage" src={expandImage} />
          {label && (
            <span
              className="absolute px-2 py-1 text-sm font-bold uppercase top-5 left-5 badge_text"
              // style={{fontFamily: 'MrEavesXLModOT'}}
            >
              {label}
            </span>
          )}
          <div>
            {isProductInWishlist() ? (
              <div
                className="absolute cursor-pointer heart_svg_wishlist top-5 right-5 pl-4 pb-4 md:p-0"
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
                className="absolute cursor-pointer heart_svg_wishlist top-5 right-5 pl-4 pb-4 md:p-0"
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

        <div className="hidden md:block w-full md:w-1/6">
          <div className="product-slideshow__thumbnails">
            {media.map((med, i) => {
              let mediaProps = {};
              const isFullWidth = i % 3 === 0;

              const data = {
                ...med,
                image: {
                  ...med.image,
                  altText: med.alt || 'Product image',
                },
              };

              switch (med.mediaContentType) {
                case 'IMAGE':
                  mediaProps = {
                    width: 800,
                    widths: [400, 800, 1200, 1600, 2000, 2400],
                  };
                  break;
                case 'VIDEO':
                  mediaProps = {
                    width: '100%',
                    autoPlay: true,
                    controls: false,
                    muted: true,
                    loop: true,
                    preload: 'auto',
                  };
                  break;
                case 'EXTERNAL_VIDEO':
                  mediaProps = {width: '100%'};
                  break;
                case 'MODEL_3D':
                  mediaProps = {
                    width: '100%',
                    interactionPromptThreshold: '0',
                    ar: true,
                    loading: ATTR_LOADING_EAGER,
                    disableZoom: true,
                  };
                  break;
              }

              if (i === 0 && med.mediaContentType === 'IMAGE') {
                mediaProps.loading = ATTR_LOADING_EAGER;
              }

              return (
                <div
                  key={med.id || med.image.id}
                  id={med.id}
                  className="product-slideshow__thumbnails-item product-slideshow__thumbnails-item--image "
                  onClick={() => handleImgage(med.image.url, med.id)}
                  // onMouseEnter={() => setExpandImage(med.image.url)}
                >
                  <MediaFile
                    tabIndex="0"
                    data={data}
                    sizes={
                      isFullWidth
                        ? '(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw'
                        : '(min-width: 64em) 30vw, (min-width: 48em) 25vw, 90vw'
                    }
                    options={{
                      crop: 'center',
                      scale: 2,
                    }}
                    {...mediaProps}
                  />
                </div>
              );
            })}
          </div>
          <div className="shadow shadow-top"></div>
          <div className="shadow shadow-bottom"></div>
        </div>

        <div className="product-slideshow__mainSlide product-mainSlide-mobiles md:!hidden">
          {media.map((med, i) => {
            let mediaProps = {};
            const isFullWidth = i % 3 === 0;

            const data = {
              ...med,
              image: {
                ...med.image,
                altText: med.alt || 'Product image',
              },
            };

            switch (med.mediaContentType) {
              case 'IMAGE':
                mediaProps = {
                  width: 800,
                  widths: [400, 800, 1200, 1600, 2000, 2400],
                };
                break;
              case 'VIDEO':
                mediaProps = {
                  width: '100%',
                  autoPlay: true,
                  controls: false,
                  muted: true,
                  loop: true,
                  preload: 'auto',
                };
                break;
              case 'EXTERNAL_VIDEO':
                mediaProps = {width: '100%'};
                break;
              case 'MODEL_3D':
                mediaProps = {
                  width: '100%',
                  interactionPromptThreshold: '0',
                  ar: true,
                  loading: ATTR_LOADING_EAGER,
                  disableZoom: true,
                };
                break;
            }

            if (i === 0 && med.mediaContentType === 'IMAGE') {
              mediaProps.loading = ATTR_LOADING_EAGER;
            }
            return (
              <div className="product-slideshow__mainSlide-image" key={med.id}>
                <MediaFile
                  tabIndex="0"
                  data={data}
                  sizes={
                    isFullWidth
                      ? '(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw'
                      : '(min-width: 64em) 30vw, (min-width: 48em) 25vw, 90vw'
                  }
                  {...mediaProps}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
