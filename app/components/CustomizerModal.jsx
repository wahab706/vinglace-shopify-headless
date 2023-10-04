import React, {Fragment, useState, useEffect, useRef} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {Money} from '@shopify/hydrogen';
import {IconClose} from '~/components';
// import axios from 'axios';

export function CustomizerModal(props) {
  const {
    showModal,
    setShowModal,
    hideModalHandler,
    product,
    variants,
    selectedVariant,
    isOnSale,
    isOutOfStock,
    setLineItems,
    productAnalytics,
    setProductAnalytic,
  } = props;

  const metafields = selectedVariant?.metafields;
  const customizerImageUrl = metafields[2] && metafields[2].value;
  const customizerImage = metafields[3] && metafields[3].reference?.image?.src;
  const variantImage = selectedVariant?.image?.src;

  const variantSelectedImage =
    customizerImageUrl || customizerImage || variantImage;

  console.log('variantSelectedImage', variantSelectedImage);

  const variantExtraCharges =
    metafields[1] && metafields[1].value ? Number(metafields[1].value) : null;

  // const globalExtraCharges =
  //   product.metafields[0] && product.metafields[0].value
  //     ? Number(product.metafields[0].value)
  //     : 0;

  let amount =
    selectedVariant.price?.amount && Number(selectedVariant.price?.amount);
  amount = amount + (variantExtraCharges ? variantExtraCharges : 0);

  let compareAtPriceAmount =
    selectedVariant.compareAtPrice?.amount &&
    Number(selectedVariant.compareAtPrice?.amount);
  compareAtPriceAmount =
    compareAtPriceAmount + (variantExtraCharges ? variantExtraCharges : 0);

  // const price = {
  //   amount: amount.toString(),
  //   currencyCode: selectedVariant.price?.currencyCode,
  // };

  // const compareAtPrice = {
  //   amount: compareAtPriceAmount.toString(),
  //   currencyCode: selectedVariant.compareAtPrice?.currencyCode,
  // };

  const price = {
    amount: selectedVariant.price?.amount,
    currencyCode: selectedVariant.price?.currencyCode,
  };

  const compareAtPrice = {
    amount: selectedVariant.compareAtPrice?.amount,
    currencyCode: selectedVariant.compareAtPrice?.currencyCode,
  };

  const [tabSelected, setTabSelected] = useState(1);
  const [initialValue, setInitialValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [initialFontSelected, setInitialFontSelected] = useState(
    'font-roman-monogram',
  );
  const [textFontSelected, setTextFontSelected] = useState('font-arial');
  const [logoUpload1, setLogoUpload1] = useState();
  const [logoUpload2, setLogoUpload2] = useState();
  const logoInputRef1 = useRef(null);
  const logoInputRef2 = useRef(null);
  const [logoUploadText, setLogoUploadText] = useState('');

  const [sportsOpenTab, setSportsOpenTab] = useState();
  const [sportsIconSelected, setSportsIconSelected] = useState();

  const [previewModal, setPreviewModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewSports, setPreviewSports] = useState(null);
  const [logoFileLink, setLogoFileLink] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log('preview image', preview);
  console.log('previewSports', previewSports);

  function getMaxLengthInitials() {
    if (
      initialFontSelected == 'font-nexa' ||
      initialFontSelected == 'font-modern'
    ) {
      return 1;
    } else {
      return 3;
    }
  }

  useEffect(() => {
    if (sportsIconSelected) {
      setPreviewSports(
        `${variantSelectedImage}?blend=/logos/${sportsIconSelected}&bm=normal&bw=180&bh=180&bf=clip&ba=center,center&by=420`,
      );
    }
  }, [sportsIconSelected]);

  useEffect(() => {
    if (tabSelected == 1) {
      if (
        initialFontSelected == 'font-nexa' ||
        initialFontSelected == 'font-modern'
      ) {
        setInitialValue(initialValue.substring(0, 1));
      }
    }
  }, [tabSelected, initialFontSelected]);

  function getFontSize() {
    if (tabSelected == 1) {
      let font = initialFontSelected;
      let length = initialValue?.length;

      switch (font) {
        case 'font-roman-monogram':
          switch (length) {
            case 1:
              return 80;
            case 2:
              return 65;
            default:
              return 50;
          }

        case 'font-nexa':
          switch (length) {
            default:
              return 80;
          }

        case 'font-modern':
          switch (length) {
            default:
              return 80;
          }

        case 'font-edwardian':
          switch (length) {
            case 1:
              return 55;
            case 2:
              return 50;
            default:
              return 35;
          }

        case 'font-goudy-handtooled':
          switch (length) {
            case 1:
              return 80;
            case 2:
              return 60;
            default:
              return 50;
          }

        case 'font-bix-antique':
          switch (length) {
            case 1:
              return 70;
            case 2:
              return 50;
            default:
              return 40;
          }

        case 'font-times-new-roman':
          switch (length) {
            case 1:
              return 80;
            case 2:
              return 65;
            default:
              return 50;
          }

        case 'font-clarendon':
          switch (length) {
            case 1:
              return 75;
            case 2:
              return 55;
            default:
              return 40;
          }

        case 'font-letter':
          switch (length) {
            case 1:
              return 90;
            case 2:
              return 75;
            default:
              return 60;
          }

        default:
          return 50;
      }
    }

    if (tabSelected == 2) {
      let font = textFontSelected;
      const length = textValue?.length;
      switch (font) {
        case 'font-arial':
          switch (true) {
            case length >= 1 && length <= 4:
              return 40;
            case length >= 5 && length <= 9:
              return 18;
            case length >= 10 && length <= 14:
              return 12;
            default:
              return 9;
          }
        case 'font-script-mt':
          switch (true) {
            case length >= 1 && length <= 4:
              return 40;
            case length >= 5 && length <= 9:
              return 18;
            case length >= 10 && length <= 14:
              return 11;
            default:
              return 9;
          }
        case 'font-rockwell':
          switch (true) {
            case length >= 1 && length <= 4:
              return 38;
            case length >= 5 && length <= 9:
              return 17;
            case length >= 10 && length <= 14:
              return 11;
            default:
              return 9;
          }
        case 'font-modern':
          switch (true) {
            case length >= 1 && length <= 4:
              return 34;
            case length >= 5 && length <= 9:
              return 15;
            case length >= 10 && length <= 14:
              return 10;
            default:
              return 8;
          }
        case 'font-nexa':
          switch (true) {
            case length >= 1 && length <= 4:
              return 37;
            case length >= 5 && length <= 9:
              return 17;
            case length >= 10 && length <= 14:
              return 11;
            default:
              return 9;
          }
        case 'font-sackers':
          switch (true) {
            case length >= 1 && length <= 4:
              return 38;
            case length >= 5 && length <= 9:
              return 17;
            case length >= 10 && length <= 14:
              return 11;
            default:
              return 8;
          }
        case 'font-quire':
          switch (true) {
            case length >= 1 && length <= 4:
              return 42;
            case length >= 5 && length <= 9:
              return 19;
            case length >= 10 && length <= 14:
              return 12;
            default:
              return 10;
          }
        case 'font-letter':
          switch (true) {
            case length >= 1 && length <= 4:
              return 60;
            case length >= 5 && length <= 9:
              return 27;
            case length >= 10 && length <= 14:
              return 14;
            default:
              return 13;
          }
        case 'font-nexa-light':
          switch (true) {
            case length >= 1 && length <= 4:
              return 38;
            case length >= 5 && length <= 9:
              return 17;
            case length >= 10 && length <= 14:
              return 11;
            default:
              return 8;
          }
        case 'font-edwardian':
          switch (true) {
            case length >= 1 && length <= 4:
              return 40;
            case length >= 5 && length <= 9:
              return 19;
            case length >= 10 && length <= 14:
              return 12;
            default:
              return 9;
          }
        case 'font-times-new-roman':
          switch (true) {
            case length >= 1 && length <= 4:
              return 42;
            case length >= 5 && length <= 9:
              return 19;
            case length >= 10 && length <= 14:
              return 12;
            default:
              return 9;
          }
      }
    }
  }

  function getFontFamily() {
    if (tabSelected == 1) {
      if (initialFontSelected == 'font-roman-monogram') {
        return 'Roman MonogramsSolid';
      } else if (initialFontSelected == 'font-nexa') {
        return 'Nexa Rust Script L0';
      } else if (initialFontSelected == 'font-modern') {
        return 'Modern No. 216';
      } else if (initialFontSelected == 'font-edwardian') {
        return 'Edwardian Script ITC';
      } else if (initialFontSelected == 'font-goudy-handtooled') {
        return 'Goudy Handtooled';
      } else if (initialFontSelected == 'font-bix-antique') {
        return 'Bix Antique Script Hmk';
      } else if (initialFontSelected == 'font-times-new-roman') {
        return 'Times New Roman';
      } else if (initialFontSelected == 'font-clarendon') {
        return 'Clarendon';
      } else if (initialFontSelected == 'font-letter') {
        return 'Letter Gothic Std';
      }
    } else if (tabSelected == 2) {
      if (textFontSelected == 'font-arial') {
        return 'Arial';
      } else if (textFontSelected == 'font-script-mt') {
        return 'Script MT';
      } else if (textFontSelected == 'font-rockwell') {
        return 'Rockwell';
      } else if (textFontSelected == 'font-modern') {
        return 'Modern No. 216';
      } else if (textFontSelected == 'font-nexa') {
        return 'Nexa Rust Script L0';
      } else if (textFontSelected == 'font-sackers') {
        return 'Sackers Gothic Std';
      } else if (textFontSelected == 'font-quire') {
        return 'Quire Sans Pro';
      } else if (textFontSelected == 'font-letter') {
        return 'Letter Gothic Std';
      } else if (textFontSelected == 'font-nexa-light') {
        return 'Nexa';
      } else if (textFontSelected == 'font-edwardian') {
        return 'Edwardian Script ITC';
      } else if (textFontSelected == 'font-times-new-roman') {
        return 'Times New Roman';
      }
    }
  }

  function resetBtnShow() {
    let show = false;
    if (tabSelected == 1) {
      if (initialValue) {
        show = true;
      }
    } else if (tabSelected == 2) {
      if (textValue) {
        show = true;
      }
    } else if (tabSelected == 3) {
      if (logoUpload1) {
        show = true;
      }
    } else if (tabSelected == 4) {
      if (sportsIconSelected) {
        show = true;
      }
    }

    return show;
  }

  const handleResetDesign = () => {
    if (tabSelected == 1) {
      setInitialValue('');
    } else if (tabSelected == 2) {
      setTextValue('');
    } else if (tabSelected == 3) {
      setLogoUploadText('');
      setLogoUpload1();
      setLogoUpload2();
      logoInputRef1.current.value = '';
      logoInputRef2.current.value = '';
    } else if (tabSelected == 4) {
      setSportsOpenTab();
      setSportsIconSelected();
    }
    setPreview(null);
    setPreviewSports(null);
    setPreviewLogo(null);
    setLogoFileLink(null);
  };

  const handleTextValue = (e) => {
    const {value} = e.target;
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (regex.test(value)) {
      setTextValue(value);
    }
  };

  const handleInitialValue = (e) => {
    const {value} = e.target;
    const regex = /^[a-zA-Z0-9]*$/;
    if (regex.test(value)) {
      setInitialValue(value);
    }
  };

  const handleLogoChange1 = (e) => {
    const file = e.target.files[0];

    if (file && file.type.substr(0, 5) === 'image') {
      const reader = new FileReader();

      reader.onloadend = () => {
        setLogoUpload1({
          name: file.name,
          src: reader.result,
        });
      };

      reader.readAsDataURL(file);

      uploadToServer(file, 'logo');
    }
  };

  const handleLogoChange2 = (e) => {
    const file = e.target.files[0];

    if (file && file.type.substr(0, 5) === 'image') {
      const reader = new FileReader();

      reader.onloadend = () => {
        setLogoUpload2({
          name: file.name,
          src: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClearLogo = (value) => {
    if (value == 'logo1') {
      setLogoUpload1();
      logoInputRef1.current.value = '';
    } else if (value == 'logo2') {
      setLogoUpload2();
      logoInputRef2.current.value = '';
    }
    setPreviewLogo(null);
    setLogoFileLink(null);
  };

  const handlePreviewModalClose = () => {
    setPreviewModal(false);
    setPreview(null);
  };

  function convertImageToBase64(text) {
    const uppercaseText = tabSelected === 1 ? text.toUpperCase() : text;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const canvasWidth = 200;
    const canvasHeight = 100;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const font = `${getFontSize()}Px  ${getFontFamily()}`;
    context.font = font;

    context.fillStyle = '#000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(uppercaseText, canvasWidth / 2, canvasHeight / 2);

    let base64Image = canvas.toDataURL();
    return base64Image;
  }

  const handleApproval = () => {
    if (tabSelected == 1 || tabSelected == 2) {
      if (tabSelected == 1 && initialValue) {
        let base64Image = convertImageToBase64(initialValue);
        uploadToServer(base64Image, 'text');
      } else if (tabSelected == 2 && textValue) {
        let base64Image = convertImageToBase64(textValue);
        uploadToServer(base64Image, 'text');
      }
    } else if (tabSelected == 3 && logoUpload1) {
      setPreview(variantSelectedImage);
      setPreviewModal(true);
    } else if (tabSelected == 4 && sportsIconSelected && previewSports) {
      setPreview(previewSports);
      setPreviewModal(true);
    }
  };

  const uploadToServer = async (image, type) => {
    if (type == 'logo') {
      setLoading((prev) => {
        let toggleId;
        if (prev['logo']) {
          toggleId = {['logo']: false};
        } else {
          toggleId = {['logo']: true};
        }
        return {...toggleId};
      });
    } else {
      setLoading((prev) => {
        let toggleId;
        if (prev['text']) {
          toggleId = {['text']: false};
        } else {
          toggleId = {['text']: true};
        }
        return {...toggleId};
      });
    }

    let url =
      type == 'logo'
        ? 'https://webdesigninhoustontexas.com/vinglace/upload.php?type=logo'
        : 'https://webdesigninhoustontexas.com/vinglace/upload-text-image.php';

    let urlencoded = new URLSearchParams();
    urlencoded.append('photo', image);
    const requestOptions1 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlencoded,
    };

    const formData = new FormData();
    formData.append('file', image);

    const requestOptions2 = {
      method: 'POST',
      body: formData,
    };

    const requestOptions =
      tabSelected == 1 || tabSelected == 2 ? requestOptions1 : requestOptions2;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.isUpload == 1) {
          console.log('result', result);
          handleShowPreview(result);

          if (type == 'logo') {
            setLogoFileLink(result.previewLink);
          }
        } else {
          alert('Something Went Wrong, Try Again!');
        }
      })
      .catch((error) => alert('Something Went Wrong, Try Again!'));
  };

  const handleShowPreview = (result) => {
    if (tabSelected == 1 || tabSelected == 2) {
      setPreview(
        `${variantSelectedImage}?blend=/img-text/${result.fileName}&h=700&w=400&bm=normal&bw=220&bh=200&bf=clip&ba=center,center&by=300`,
      );
      setPreviewModal(true);
    }
    setLoading(false);
  };

  const handleCheckout = () => {
    setLoading((prev) => {
      let toggleId;
      if (prev['text']) {
        toggleId = {['text']: false};
      } else {
        toggleId = {['text']: true};
      }
      return {...toggleId};
    });
    let forInitials = {
      'Customize Type': 'Monogram',
      'Customize Text': initialValue,
      'Font Family': initialFontSelected,
      'Customize Preview': preview,
    };
    let forText = {
      'Customize Type': 'Text',
      'Customize Text': textValue,
      'Font Family': textFontSelected,
      'Customize Preview': preview,
    };
    let forLogo = {
      'Customize Type': 'Custom Logo',
      'Logo File': logoFileLink,
    };
    if (logoUploadText) {
      forLogo['Additional Custom Text'] = logoUploadText;
    }
    let forSports = {
      'Customize Type': 'Sports',
      'Logo Name': sportsIconSelected?.replace('.png', ''),
      'Customize Preview': preview,
    };

    let customProperties = {};

    if (tabSelected == 1) {
      customProperties = forInitials;
    } else if (tabSelected == 2) {
      customProperties = forText;
    } else if (tabSelected == 3) {
      customProperties = forLogo;
    } else if (tabSelected == 4) {
      customProperties = forSports;
    }

    // setProductAnalytic({
    //   products: [productAnalytics],
    //   totalValue: parseFloat(amount),
    // });
    setProductAnalytic({
      products: [productAnalytics],
      totalValue: parseFloat(productAnalytics.price),
    });
    setLineItems([
      {
        merchandiseId: selectedVariant.id,
        quantity: 1,
        attributes: Object.entries(customProperties).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ]);
    setTimeout(() => {
      document.getElementById('checkout_btn').click();

      setTimeout(() => {
        setLoading(false);
        setPreviewModal(false);
        setShowModal(false);
      }, 1000);
    }, 1000);
  };

  return (
    <>
      {showModal && (
        <Fragment>
          <div className="modal-overlay" onClick={hideModalHandler}></div>
          <div className="pdp-customizer ">
            <div className="modal-content">
              <div className="customizer-modal">
                <div className="product-template__container container">
                  <div className="customizer-view">
                    <div className="product-single product-single--medium-image">
                      <div className="product">
                        <div className="grid-section product-single-customize">
                          <div className="grid__item medium-up--one-whole">
                            <h1
                              itemProp="name"
                              className="product-single__title"
                            >
                              {variants?.length > 1
                                ? selectedVariant?.title
                                : product.title}
                            </h1>
                            <div className="grid-section btn-group">
                              <div className="grid__item small--one-half medium-up--one-half">
                                <button
                                  className="btn change-variant"
                                  onClick={hideModalHandler}
                                >
                                  {/* <span className="ion-android-refresh"></span> */}
                                  Change Variant
                                </button>
                              </div>
                              <div className="grid__item small--one-half medium-up--one-half text-right">
                                {isOutOfStock ? (
                                  <button
                                    type="button"
                                    disabled
                                    className="btn product-form__cart-submit proceed-to-approval"
                                  >
                                    Sold out
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    name="add"
                                    onClick={handleApproval}
                                    className="btn product-form__cart-submit proceed-to-approval"
                                  >
                                    PROCEED TO APPROVAL
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid__item customization_grid medium-up--four-tenths left-box">
                            <div className="widget-block">
                              <ul className="data-tab-list main-tab">
                                <li className="tab tab1 active">
                                  <span>FRONT</span>
                                </li>
                                <li className="tab tab2 !hidden">
                                  <span>BACK</span>
                                </li>
                              </ul>
                              <div
                                className="data-tab-content active"
                                id="data-tab1"
                              >
                                <ul
                                  className="data-tab-list sub-tab"
                                  id="sub-tab"
                                >
                                  <li
                                    className={`tab ${
                                      tabSelected == 1 ? 'active' : ''
                                    }`}
                                    onClick={() => setTabSelected(1)}
                                  >
                                    <span>INITIALS</span>
                                  </li>
                                  <li
                                    className={`tab ${
                                      tabSelected == 2 ? 'active' : ''
                                    }`}
                                    onClick={() => setTabSelected(2)}
                                  >
                                    <span>TEXT</span>
                                  </li>
                                  <li
                                    className={`tab ${
                                      tabSelected == 3 ? 'active' : ''
                                    }`}
                                    onClick={() => setTabSelected(3)}
                                  >
                                    <span>LOGO</span>
                                  </li>
                                  <li
                                    className={`tab ${
                                      tabSelected == 4 ? 'active' : ''
                                    }`}
                                    onClick={() => setTabSelected(4)}
                                  >
                                    <span>SPORTS</span>
                                  </li>
                                </ul>

                                <div
                                  className={`data-tab-content tab2 monogramBlock ${
                                    tabSelected == 1 ? 'active' : ''
                                  }`}
                                  data-block-type="monogramBlock"
                                  data-view-type="#preview-front"
                                  id="front-data-tab2"
                                >
                                  <div className="monogram text-block data-block">
                                    <div className="grid-section scroll grid--half-gutters text-center">
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="3"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected ==
                                            'font-roman-monogram'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-roman-monogram',
                                            )
                                          }
                                        >
                                          <span className="font font-roman-monogram">
                                            <span className="i1">r</span>
                                            <span className="i2">j</span>
                                            <span className="i3">m</span>
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="1"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected == 'font-nexa'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected('font-nexa')
                                          }
                                        >
                                          <span className="font font-nexa">
                                            J
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="1"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected == 'font-modern'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-modern',
                                            )
                                          }
                                        >
                                          <span className="font font-modern">
                                            K
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <sapn
                                          data-max-length="3"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected ==
                                            'font-edwardian'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-edwardian',
                                            )
                                          }
                                        >
                                          <span className="font font-edwardian">
                                            CBH
                                          </span>
                                        </sapn>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="3"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected ==
                                            'font-goudy-handtooled'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-goudy-handtooled',
                                            )
                                          }
                                        >
                                          <span className="font font-goudy-handtooled">
                                            abc
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="3"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected ==
                                            'font-bix-antique'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-bix-antique',
                                            )
                                          }
                                        >
                                          <span className="font font-bix-antique">
                                            BWH
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="3"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected ==
                                            'font-times-new-roman'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-times-new-roman',
                                            )
                                          }
                                        >
                                          <span className="font font-times-new-roman">
                                            TNR
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="3"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected ==
                                            'font-clarendon'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-clarendon',
                                            )
                                          }
                                        >
                                          <span className="font font-clarendon">
                                            CEH
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-third medium--one-half large--one-half wide-up--one-third">
                                        <span
                                          data-max-length="3"
                                          className={`block cursor-pointer  ${
                                            initialFontSelected == 'font-letter'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setInitialFontSelected(
                                              'font-letter',
                                            )
                                          }
                                        >
                                          <span className="font font-letter">
                                            GTC
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid-section grid--half-gutters grid--uniform text-center">
                                      <div className="grid__item small--one-whole medium-up--one-whole">
                                        <div className="form-group">
                                          <label>
                                            Enter Text - NOTE: Last Name Initial
                                            Appears In Center For Monograms
                                          </label>
                                          <input
                                            type="text"
                                            data-selector=".monogram-preview"
                                            name="monogram-text"
                                            id="monogram-text"
                                            data-ui="design-text"
                                            className="text form-item"
                                            size={getMaxLengthInitials()}
                                            maxLength={getMaxLengthInitials()}
                                            pattern="[A-Za-z]{3}"
                                            value={initialValue}
                                            onChange={(e) =>
                                              handleInitialValue(e)
                                            }
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellcheck="false"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`data-tab-content tab3 textBlock ${
                                    tabSelected == 2 ? 'active' : ''
                                  }`}
                                  data-block-type="textBlock"
                                  data-view-type="#preview-front"
                                  id="front-data-tab3"
                                >
                                  <div className="text-block text data-block">
                                    <div className="grid xl:grid-cols-2 grid--half-gutters text-center">
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-arial'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected('font-arial')
                                          }
                                        >
                                          <span className="font-arial">
                                            Arial Bold
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-script-mt'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected(
                                              'font-script-mt',
                                            )
                                          }
                                        >
                                          <span className="font-script-mt">
                                            Script MT Bold
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-rockwell'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected('font-rockwell')
                                          }
                                        >
                                          <span className="font-rockwell">
                                            Rockwell Bold
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-modern'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected('font-modern')
                                          }
                                        >
                                          <span className="font-modern">
                                            ITC Modern No 216
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-nexa'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected('font-nexa')
                                          }
                                        >
                                          <span className="font-nexa">
                                            Nexa Script
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-sackers'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected('font-sackers')
                                          }
                                        >
                                          <span className="font-sackers">
                                            Sackers Gothic
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-quire'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected('font-quire')
                                          }
                                        >
                                          <span className="font-quire">
                                            Quire Sans Pro
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-letter'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected('font-letter')
                                          }
                                        >
                                          <span className="font-letter">
                                            Letter Gothic Std
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected ==
                                            'font-nexa-light'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected(
                                              'font-nexa-light',
                                            )
                                          }
                                        >
                                          <span className="font-nexa-light">
                                            Nexa Light
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected == 'font-edwardian'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected(
                                              'font-edwardian',
                                            )
                                          }
                                        >
                                          <span className="font-edwardian">
                                            Edwardian Script
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item small--one-whole">
                                        <span
                                          className={`block cursor-pointer  ${
                                            textFontSelected ==
                                            'font-times-new-roman'
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setTextFontSelected(
                                              'font-times-new-roman',
                                            )
                                          }
                                        >
                                          <span className="font-times-new-roman">
                                            Times New Roman
                                          </span>
                                        </span>
                                      </div>
                                      <div className="grid__item medium-up--one-whole col-span-2">
                                        <div className="form-group">
                                          <label>Text</label>
                                          <textarea
                                            className="text form-item text-center"
                                            data-selector=".text-preview"
                                            size="18"
                                            maxLength="18"
                                            pattern="[A-Za-z]{18}"
                                            name="text-text"
                                            row="5"
                                            value={textValue}
                                            onChange={(e) => handleTextValue(e)}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellcheck="false"
                                          ></textarea>
                                          <small>
                                            Maximum of 18 characters.
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`data-tab-content tab4 logoBlock ${
                                    tabSelected == 3 ? 'active' : ''
                                  }`}
                                  data-block-type="logoBlock"
                                  data-view-type="#preview-front"
                                  id="front-data-tab4"
                                >
                                  <div className="logo_upload data-block">
                                    <div className="file-area file-logo">
                                      <h4>Upload Your Logo</h4>
                                      <div
                                        className={`file-upload-area ${
                                          logoUpload1 ? 'hidden' : 'block'
                                        }`}
                                      >
                                        <input
                                          className="logo"
                                          type="file"
                                          name="file"
                                          id="logo-file"
                                          ref={logoInputRef1}
                                          accept="image/png,image/jpeg,image/jpg"
                                          onChange={handleLogoChange1}
                                        />
                                      </div>
                                      <div
                                        className={`success-msg ${
                                          logoUpload1 ? 'flex' : 'hidden'
                                        }`}
                                      >
                                        <span className="file-name">
                                          {logoUpload1?.name}
                                        </span>
                                        <span className="text-right">
                                          <button
                                            className="btn clear-logo-file"
                                            type="button"
                                            onClick={() =>
                                              handleClearLogo('logo1')
                                            }
                                          >
                                            Clear
                                          </button>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="file-area additional-logo-text">
                                      <h4>ADDITIONAL OPTIONS</h4>
                                      <div className="text-input">
                                        <label>Add text below your logo</label>
                                        <input
                                          name="logo-text"
                                          className="text"
                                          type="text"
                                          placeholder="optional"
                                          id="logo-text"
                                          value={logoUploadText}
                                          onChange={(e) =>
                                            setLogoUploadText(e.target.value)
                                          }
                                          disabled={!logoUpload1}
                                        />
                                      </div>
                                      <div className="file-area file-input">
                                        <label>
                                          Or, upload a CSV or text file with a
                                          list of names or phrases to customize
                                          a batch of products
                                        </label>
                                        <div
                                          className={`file-upload-area ${
                                            logoUpload2 ? 'hidden' : 'block'
                                          }`}
                                        >
                                          <input
                                            name="name-list"
                                            className="name-list"
                                            type="file"
                                            id="logo-file"
                                            ref={logoInputRef2}
                                            disabled={!logoUpload1}
                                            onChange={handleLogoChange2}
                                          />
                                        </div>
                                        <div
                                          className={`success-msg ${
                                            logoUpload2 ? 'flex' : 'hidden'
                                          }`}
                                        >
                                          <span className="file-name">
                                            {logoUpload2?.name}
                                          </span>
                                          <span className="text-right">
                                            <button
                                              className="btn clear-list-file"
                                              type="button"
                                              onClick={() =>
                                                handleClearLogo('logo2')
                                              }
                                            >
                                              Clear
                                            </button>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="clear-block">
                                  {resetBtnShow() && (
                                    <button
                                      onClick={handleResetDesign}
                                      className="btn clear-design"
                                      type="button"
                                    >
                                      Clear Design X
                                    </button>
                                  )}
                                </div>
                                <div
                                  className={`data-tab-content tab4 designLogoBlock ${
                                    tabSelected == 4 ? 'active' : 'hidden'
                                  }`}
                                  data-block-type="designLogoBlock"
                                  data-view-type="#preview-front"
                                  id="front-data-tab1"
                                >
                                  <div className="design-logos data-block">
                                    <div className="grid-section scroll grid--half-gutters text-center">
                                      <div
                                        className={`grid__item small--one-third medium--one-third large--one-third wide-up--one-third ${
                                          sportsOpenTab ? 'block' : 'back'
                                        }`}
                                      >
                                        <div
                                          className="block back cursor-pointer"
                                          style={{
                                            display: sportsOpenTab
                                              ? 'block'
                                              : '',
                                          }}
                                          onClick={() => setSportsOpenTab()}
                                        >
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/t/53/assets/back.png?v=155988717913892143471664834327"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={`grid__item small--one-third medium--one-third large--one-third wide-up--one-third main ${
                                          sportsOpenTab ? 'hidden' : 'block'
                                        }`}
                                        onClick={() => setSportsOpenTab(1)}
                                      >
                                        <div className={`block cursor-pointer`}>
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/files/Bubbles_Vinglace_small.png?v=1614292955"
                                              alt=""
                                              className="img-bg"
                                            />
                                          </div>
                                          <span>Bubbles</span>
                                        </div>
                                      </div>

                                      <div
                                        className="block grid__item small--one-third medium--one-third large--one-third wide-up--one-third sub sports-category"
                                        data-category-id="sports"
                                        style={{
                                          display:
                                            sportsOpenTab == 1 ? 'block' : '',
                                        }}
                                        onClick={() =>
                                          setSportsIconSelected(
                                            'Bubbles_Vinglace.png',
                                          )
                                        }
                                      >
                                        <div
                                          className={`block cursor-pointer ${
                                            sportsIconSelected ==
                                            'Bubbles_Vinglace.png'
                                              ? 'active'
                                              : ''
                                          }`}
                                        >
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/files/Bubbles_Vinglace_small.png?v=1614292955"
                                              data-src="Bubbles_Vinglace.png"
                                              className="img-bg"
                                            />
                                          </div>
                                          <span>Bubbles</span>
                                        </div>
                                      </div>

                                      <div
                                        className="block grid__item small--one-third medium--one-third large--one-third wide-up--one-third sub sports-category"
                                        data-category-id="sports"
                                        style={{
                                          display:
                                            sportsOpenTab == 1 ? 'block' : '',
                                        }}
                                        onClick={() =>
                                          setSportsIconSelected(
                                            'Mom_Wine_Glass.png',
                                          )
                                        }
                                      >
                                        <div
                                          className={`block cursor-pointer ${
                                            sportsIconSelected ==
                                            'Mom_Wine_Glass.png'
                                              ? 'active'
                                              : ''
                                          }`}
                                        >
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/files/Mom_Wine_Glass_small.png?v=1614292955"
                                              data-src="Mom_Wine_Glass.png"
                                              className="img-bg"
                                            />
                                          </div>
                                          <span>Mom</span>
                                        </div>
                                      </div>

                                      <div
                                        className={`grid__item small--one-third medium--one-third large--one-third wide-up--one-third main ${
                                          sportsOpenTab ? 'hidden' : 'block'
                                        }`}
                                        onClick={() => setSportsOpenTab(2)}
                                      >
                                        <div className={`block cursor-pointer`}>
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/files/Golfer_vg_small.png?v=1614292955"
                                              alt=""
                                              className="img-bg"
                                            />
                                          </div>
                                          <span>Sports</span>
                                        </div>
                                      </div>

                                      <div
                                        className="block grid__item small--one-third medium--one-third large--one-third wide-up--one-third sub sports-category"
                                        data-category-id="sports"
                                        style={{
                                          display:
                                            sportsOpenTab == 2 ? 'block' : '',
                                        }}
                                        onClick={() =>
                                          setSportsIconSelected('Golfer_vg.png')
                                        }
                                      >
                                        <div
                                          className={`block cursor-pointer ${
                                            sportsIconSelected ==
                                            'Golfer_vg.png'
                                              ? 'active'
                                              : ''
                                          }`}
                                        >
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/files/Golfer_vg_small.png?v=1614292955"
                                              data-src="Golfer_vg.png"
                                              className="img-bg"
                                            />
                                          </div>
                                          <span>Golf Male</span>
                                        </div>
                                      </div>

                                      <div
                                        className="block grid__item small--one-third medium--one-third large--one-third wide-up--one-third sub sports-category"
                                        data-category-id="sports"
                                        style={{
                                          display:
                                            sportsOpenTab == 2 ? 'block' : '',
                                        }}
                                        onClick={() =>
                                          setSportsIconSelected(
                                            'WomanGolfer.png',
                                          )
                                        }
                                      >
                                        <div
                                          className={`block cursor-pointer ${
                                            sportsIconSelected ==
                                            'WomanGolfer.png'
                                              ? 'active'
                                              : ''
                                          }`}
                                        >
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/files/WomanGolfer_small.png?v=1614292955"
                                              data-src="WomanGolfer.png"
                                              className="img-bg"
                                            />
                                          </div>
                                          <span>Golf Female</span>
                                        </div>
                                      </div>

                                      <div
                                        className="block grid__item small--one-third medium--one-third large--one-third wide-up--one-third sub sports-category"
                                        data-category-id="sports"
                                        style={{
                                          display:
                                            sportsOpenTab == 2 ? 'block' : '',
                                        }}
                                        onClick={() =>
                                          setSportsIconSelected(
                                            'tennis_new.png',
                                          )
                                        }
                                      >
                                        <div
                                          className={`block cursor-pointer ${
                                            sportsIconSelected ==
                                            'tennis_new.png'
                                              ? 'active'
                                              : ''
                                          }`}
                                        >
                                          <div className="image_wrapper">
                                            <img
                                              src="https://cdn.shopify.com/s/files/1/1527/4909/files/tennis_new_small.png?v=1614295284"
                                              data-src="tennis_new.png"
                                              className="img-bg"
                                            />
                                          </div>
                                          <span>Tennis</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* =======text here 839========== */}
                            </div>
                          </div>

                          <div className="grid__item product-single__photos medium-up--three-tenths right-box">
                            <div
                              className="preview-section active"
                              id="preview-front"
                            >
                              <p className="info-block text-center">
                                All text will be centered vertically and
                                horizontally during engraving. Allow 10 business
                                days.
                              </p>
                              <div
                                className={`preview monogram-preview ${
                                  tabSelected == 1 ? 'active' : 'hidden'
                                }`}
                                id="monogram-preview"
                              >
                                <div className="preview-block">
                                  <img
                                    className="featured_image"
                                    src={variantSelectedImage}
                                  />

                                  <div
                                    className={`design-font handle_wine-chiller ${initialFontSelected}`}
                                    data-ui="design-preview"
                                  >
                                    <div id="monogram-preview-node1">
                                      <span
                                        className="preview-monogram-font uppercase"
                                        style={{fontSize: `${getFontSize()}px`}}
                                      >
                                        {initialValue}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`preview text-preview ${
                                  tabSelected == 2 ? 'active' : 'hidden'
                                }`}
                                id="text-preview"
                              >
                                <div className="preview-block">
                                  <img
                                    className="featured_image"
                                    src={variantSelectedImage}
                                  />

                                  <div
                                    className={`design-font handle_wine-chiller ${textFontSelected}`}
                                    data-ui="design-preview"
                                  >
                                    <div id="text-preview-node1">
                                      <span
                                        className="textFitted textFitAlignVert ml-0"
                                        style={{fontSize: `${getFontSize()}px`}}
                                      >
                                        {textValue}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`preview logo-preview ${
                                  tabSelected == 3 ? 'active' : 'hidden'
                                }`}
                                id="logo-preview"
                              >
                                <div class="preview-block">
                                  {loading['logo'] ? (
                                    <div className="lds-ring-section">
                                      <div className="lds-ring">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                      </div>
                                    </div>
                                  ) : (
                                    <img
                                      className="featured_image"
                                      src={variantSelectedImage}
                                    />
                                  )}
                                  <div
                                    class="upload-logo-preview"
                                    data-ui="design-preview"
                                  >
                                    {logoUpload1 && (
                                      <img
                                        src={logoFileLink}
                                        className="logo-preview"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`preview logo-preview featured_image_wrapper ${
                                  tabSelected == 4 ? 'active' : 'hidden'
                                }  `}
                                id="design-logo-preview"
                              >
                                {sportsIconSelected ? (
                                  <img
                                    className="featured_image"
                                    src={previewSports}
                                  />
                                ) : (
                                  <img
                                    className="featured_image"
                                    src={variantSelectedImage}
                                  />
                                )}
                                {/* <div className="preview-block">
                                  {sportsIconSelected && (
                                    <div
                                      class="upload-logo-preview"
                                      data-ui="design-preview"
                                    >
                                      <img
                                        src={sportsIconSelected}
                                        className="logo-preview"
                                      />
                                    </div>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="grid__item medium-up--three-tenths right-box">
                            <div className="shop-info product-single__meta text-center wide-up--text-right">
                              <div
                                itemProp="offers"
                                itemscope=""
                                itemtype="http://schema.org/Offer"
                              >
                                <meta itemProp="priceCurrency" content="USD" />

                                <link
                                  itemProp="availability"
                                  href="http://schema.org/InStock"
                                />

                                <div className="prod-price flex items-center justify-center font-2">
                                  <Money
                                    withoutTrailingZeros
                                    data={price}
                                    as="span"
                                  />
                                  {isOnSale && (
                                    <Money
                                      withoutTrailingZeros
                                      data={compareAtPrice}
                                      as="span"
                                      className="prod-compareAt-price ml-1 text-sm font-normal line-through compare-price"
                                    />
                                  )}
                                </div>
                                {/* <p>
                                <span
                                  className="spr-badge"
                                  id="spr_badge_4556179570784"
                                  data-rating="4.890410958904109"
                                >
                                  <span className="spr-starrating spr-badge-starrating">
                                    <i
                                      className="spr-icon spr-icon-star"
                                      aria-hidden="true"
                                    ></i>
                                    <i
                                      className="spr-icon spr-icon-star"
                                      aria-hidden="true"
                                    ></i>
                                    <i
                                      className="spr-icon spr-icon-star"
                                      aria-hidden="true"
                                    ></i>
                                    <i
                                      className="spr-icon spr-icon-star"
                                      aria-hidden="true"
                                    ></i>
                                    <i
                                      className="spr-icon spr-icon-star"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <span className="spr-badge-caption">
                                    73 reviews
                                  </span>
                                </span>
                              </p> */}
                              </div>

                              {/* <li className="product-unit__social-item">
                              <a
                                target="_blank"
                                href="//www.facebook.com/sharer.php?u=https://www.vinglace.com/products/wine-chiller"
                                className="ion-social-facebook share-facebook product-unit__social-link"
                                title="Share on Facebook"
                              ></a>
                            </li>

                            <li className="product-unit__social-item">
                              <a
                                target="_blank"
                                href="//twitter.com/share?text=Wine%20Chiller&amp;url=https://www.vinglace.com/products/wine-chiller"
                                className="ion-social-twitter share-twitter product-unit__social-link"
                                title="Tweet on Twitter"
                              ></a>
                            </li>

                            <li className="product-unit__social-item">
                              <a
                                target="_blank"
                                href="//pinterest.com/pin/create/button/?url=https://www.vinglace.com/products/wine-chiller&amp;media=//cdn.shopify.com/s/files/1/1527/4909/products/WhitePourSink_1024x1024.jpg?v=1664229193&amp;description=Wine%20Chiller"
                                className="ion-social-pinterest share-pinterest product-unit__social-link"
                                title="Pin on Pinterest"
                              ></a>
                            </li> */}
                            </div>
                          </div>

                          <div className="grid__item medium-up--one-whole">
                            <div className="grid">
                              <div className="grid__item medium-up--one-whole mt-2 sm:mt-0 text-center sm:text-right">
                                {isOutOfStock ? (
                                  <button
                                    type="button"
                                    disabled
                                    className="btn product-form__cart-submit proceed-to-approval"
                                  >
                                    Sold out
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    name="add"
                                    onClick={handleApproval}
                                    className="btn product-form__cart-submit proceed-to-approval"
                                  >
                                    PROCEED TO APPROVAL
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="absolute top-4 right-4 text-xs font-semibold"
                onClick={hideModalHandler}
              >
                <IconClose />
              </button>
            </div>
          </div>
        </Fragment>
      )}

      {loading['text'] && (
        <div className="customizer-loading">
          <div className="lds-ring-section">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )}

      <Transition.Root show={previewModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={handlePreviewModalClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6"
                  style={{maxWidth: '750px', maxHeight: '670px'}}
                >
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={handlePreviewModalClose}
                    >
                      <span className="sr-only">Close</span>
                      <IconClose className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      <Dialog.Title
                        as="p"
                        className="modal-title !mb-0 !text-2xl"
                      >
                        Product Preview
                      </Dialog.Title>
                      <p className="info-block text-left">
                        *All text will be centered vertically and horizontally
                        during engraving
                      </p>
                      <div className="preview logo-preview">
                        <div className="flex justify-center mt-6">
                          <img
                            src={preview}
                            style={{
                              maxWidth: '500px',
                              height: '450px',
                            }}
                          />
                        </div>
                        {tabSelected == 3 && (
                          <div
                            class="upload-logo-preview"
                            data-ui="design-preview"
                          >
                            <img src={logoFileLink} className="logo-preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 flex justify-between sm:flex-row-reverse">
                    <span className="customizer-modal product-single">
                      <button
                        type="button"
                        className="btn product-form__cart-submit proceed-to-approval"
                        onClick={handleCheckout}
                      >
                        Continue to checkout
                      </button>
                    </span>
                    <span className="customizer-modal clear-block">
                      <button
                        type="button"
                        className="btn clear-design !px-6 !py-3"
                        onClick={handlePreviewModalClose}
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
