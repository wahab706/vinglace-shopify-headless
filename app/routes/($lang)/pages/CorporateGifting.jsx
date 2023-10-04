import React from 'react';
import {Link} from '~/components';
import corporate1 from '../../../images/corporate1.png';
import corporate2 from '../../../images/corporate2.png';
import corporate3 from '../../../images/corporate3.png';
import corporate4 from '../../../images/corporate4.png';

export function CorporateGifting() {
  const ImageSection = ({
    title,
    description1,
    description2,
    description3,
    description4,
    src,
    right,
  }) => {
    return (
      <div className="block w-full home_img_with_txt ">
        <div className="page-width ">
          <div className="grid items-center grid-cols-1 md:grid-cols-2 img_txt_inner ">
            <div className={`image_dv ${right ? 'md:order-2' : ''}`}>
              <img className="block w-full " src={src} alt="image " />
            </div>
            <div className="p-6 contant_dv md:px-16">
              <h4 className="pb-4 text-xl font-medium sm:text-2xl text-color ">
                {title}
              </h4>
              {description1 && (
                <p
                  className="m-0 text-sm text-color text-left"
                  style={{letterSpacing: '1px'}}
                >
                  {description1}
                </p>
              )}
              {description2 && (
                <p
                  className="m-0 text-sm text-color text-left mt-3"
                  style={{letterSpacing: '1px'}}
                >
                  {description2}
                </p>
              )}
              {description3 && (
                <p
                  className="m-0 text-sm text-color text-left mt-3"
                  style={{letterSpacing: '1px'}}
                >
                  {description3}
                </p>
              )}
              {description4 && (
                <p
                  className="m-0 text-sm text-color text-left mt-3"
                  style={{letterSpacing: '1px'}}
                >
                  {description4}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="block w-full mt-6 mb-10 ">
        <div className="page-width">
          <div className="inline-block w-full m-0 ">
            <div className="w-full mx-auto text-center ">
              <h2
                className="pb-1 m-0 text-2xl font-medium leading-8 uppercase text-color sm:text-3xl "
                style={{letterSpacing: '3px'}}
              >
                Vinglacé Corporate Gifting
              </h2>
              <p
                className="text-sm tracking-wide max-w-md mx-auto text-color leading-5"
                style={{letterSpacing: '1px'}}
              >
                Vinglacé products keep beverages hot or cold without any
                metallic taste or smell.(VIN-GLAH-SAY). Taste matters.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ImageSection
        title="Make A Statement"
        src={corporate1}
        description1="Wow your clients with Vinglacé products, laser engraved with your corporate logo."
        description2="The perfect gift for that special client, employee, or event attendee."
      />

      <ImageSection
        title="Unique Drinkware"
        src={corporate2}
        right
        description1="Vinglacé drinkware is TRULY unique, offering GLASS on the inside, so you never experience that metallic taste or smell."
        description2="Dishwasher safe, and with a sip through lid, our glass inserts make every drink count."
        description3="Stainless steel exterior keeps your beverage hot or cold, just the way you like it."
      />

      <ImageSection
        title="Wine & Champagne Chiller"
        src={corporate3}
        description1="The perfect gift for that special client, employee, or event attendee."
        description2="Customize any wine chiller with your corporate logo. "
        description3="Our chillers keep your wine & champagne chilled for hours, no ice needed."
        description4="Every product comes in a beautiful gift box."
      />
      <ImageSection
        title="Corporate Gifting Made Easy"
        src={corporate4}
        right
        description1="Your customers and employees deserve the best. Every Vinglacé comes in a beautiful gift box and promises to impress. Give something new and unique this year."
      />

      <div className="block w-full my-20 contact_section">
        <div className="page-width ">
          <div className="w-full shipping-form mx-auto">
            <div className=" bg-white border border-solid rounded-sm contact_border ">
              <h1 className="px-4 py-2 m-0 text-xl font-medium tracking-wider capitalize border-b border-solid contact_border text-color">
                Corporate-Gifting
              </h1>

              <form
                action="https://submit.jotform.com/submit/231163271261446"
                method="post"
                name="form_231163271261446"
                id="231163271261446"
                accept-charset="utf-8"
                autocomplete="on"
                className="!h-auto -mb-11"
              >
                <input type="hidden" name="formID" value="231163271261446" />
                <input type="hidden" id="JWTContainer" value="" />
                <input type="hidden" id="cardinalOrderNumber" value="" />
                <div className="px-4 pt-4 pb-2">
                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="input_2"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        Your name <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="text"
                        id="input_2"
                        name="q2_yourName2"
                        data-type="input-textbox"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="input_14"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        Email address <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="email"
                        id="input_14"
                        name="q14_email"
                        data-component="email"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="input_4"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        Company name <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="text"
                        id="input_4"
                        name="q4_companyName"
                        data-type="input-textbox"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        id="label_5"
                        htmlFor="input_5"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        product needed
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                        id="input_5"
                        name="q5_productNeeded"
                        data-component="dropdown"
                      >
                        <option value="">Please Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="date"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        Date needed <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="input_7"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        Quantity needed
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                        id="input_7"
                        name="q7_quantityNeeded"
                      >
                        <option value="">Please Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>

                  <h2 className="mt-8 mb-3 text-xl font-semibold text-color sm:text-lg">
                    Physical Mailing Address
                  </h2>
                </div>

                <div className="w-full border border-t-0 border-solid"></div>

                <div className="px-4 pt-3 pb-6">
                  <div className="mb-3 contact-form-field ">
                    <label
                      htmlFor="input_8"
                      className="block mb-1 text-lg font-medium text-color"
                    >
                      Address <span className="sterik_color">* </span>
                    </label>
                    <input
                      type="text"
                      id="input_8"
                      name="q8_address"
                      data-type="input-textbox"
                      required
                      className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                    />
                  </div>

                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="input_9"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        City <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="text"
                        id="input_9"
                        name="q9_city"
                        data-type="input-textbox"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        State <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="text"
                        id="input_10"
                        name="q10_state"
                        data-type="input-textbox"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="input_11"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        Zip code <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="text"
                        id="input_11"
                        name="q11_zipCode"
                        data-type="input-textbox"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="input_15_full"
                        className="block mb-1 text-lg font-medium text-color"
                      >
                        Phone <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="number"
                        id="input_15_full"
                        name="q15_phoneNumber[full]"
                        data-type="mask-number"
                        placeholder="(000) 000-0000"
                        required
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <p
                  className="text-base text-center text-gray-400"
                  id="result"
                ></p>

                <div className="">
                  <button
                    type="submit"
                    className="!py-2 !px-7 btn focus:outline-none"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="block w-full mt-8 mb-8 md:mb-16 ">
        <div className="page-width ">
          <div className="inline-block w-full m-0 ">
            <div className="block w-full max-w-xl mx-auto text-center ">
              <h2 className="pb-1 m-0 text-2xl font-semibold uppercase leading-8 text-color">
                the elegent way to keep wine and champagine chilled
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
