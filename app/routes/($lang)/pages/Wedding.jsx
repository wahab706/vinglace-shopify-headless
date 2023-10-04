import React from 'react';
import {Link} from '~/components';
import wed from '../../../images/wed.png';
import wed1 from '../../../images/wed1.png';
import wed2 from '../../../images/wed2.png';
import wed3 from '../../../images/wed3.png';
import wed4 from '../../../images/wed4.png';
import wed5 from '../../../images/wed5.png';
import wed6 from '../../../images/wed6.png';

export function Wedding() {
  const ImageSection = ({title, description, src, right, path}) => {
    return (
      <div className="block w-full home_img_with_txt ">
        <div className="page-width ">
          <div className="grid items-center grid-cols-1 md:grid-cols-2 img_txt_inner ">
            <div className={`image_dv ${right ? 'md:order-2' : ''}`}>
              <img className="block w-full " src={src} alt="image " />
            </div>
            <div className="p-6 text-center contant_dv md:px-16">
              {title && (
                <p
                  className="m-0 pb-3 text-sm text-color "
                  style={{letterSpacing: '1px'}}
                >
                  {title}
                </p>
              )}
              {description && (
                <h4 className="text-2xl pb-3 font-medium sm:text-xl text-color ">
                  {description}
                </h4>
              )}
              <Link
                to={path}
                className="btn !text-xxs inline-block bg-black text-primary text-center py-1 px-6 rounded-full"
              >
                customize
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pt-5 about_banner">
        <div className="page-width">
          <section
            className="w-full bg-repeat bg-cover image_banner page-banner"
            style={{backgroundImage: `url(${wed})`}}
          >
            <div className="page-width ">
              <div className="text-center banner_content ">
                <h4 className="text-2xl font-normal text-black uppercase "></h4>
                <h2 className="mt-0 mb-1 font-medium leading-none text-black uppercase "></h2>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* <!-- about richtext --> */}
      <div className="block w-full mt-6 mb-10 ">
        <div className="page-width ">
          <div className="inline-block w-full m-0 ">
            <div className="w-full max-w-3xl mx-auto text-center ">
              <h2
                className="pb-1 m-0 text-2xl font-medium leading-8 text-color sm:text-3xl "
                style={{letterSpacing: '2px'}}
              >
                Register To Win Your Vinglacé Wedding - Up to $1,000 of
                Personalized Gifts
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="block w-full my-10 contact_section ">
        <div className="page-width ">
          <div className="w-full shipping-form mx-auto">
            <div className=" bg-white border border-solid rounded-sm contact_border ">
              <form
                action="https://submit.jotform.com/submit/231162910039448"
                method="post"
                name="form_231162910039448"
                id="231162910039448"
                accept-charset="utf-8"
                autocomplete="on"
                className="!h-auto -mb-11"
              >
                <input type="hidden" name="formID" value="231162910039448" />
                <input type="hidden" id="JWTContainer" value="" />
                <input type="hidden" id="cardinalOrderNumber" value="" />
                <div className="px-4 pt-4 pb-2">
                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="input_2"
                        className="block mb-1 text-md md:text-lg font-medium text-color"
                      >
                        Your name
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
                        htmlFor="dob"
                        className="block mb-1 text-md md:text-lg font-medium text-color"
                      >
                        Select birth date
                      </label>
                      <input
                        type="date"
                        name="dob"
                        id="dob"
                        placeholder=""
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="wedding-date"
                        className="block mb-1 text-md md:text-lg font-medium text-color"
                      >
                        Select wedding date
                      </label>
                      <input
                        type="date"
                        name="wedding-date"
                        id="wedding-date"
                        placeholder=""
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="input_5"
                        className="block mb-1 text-md md:text-lg font-medium text-color"
                      >
                        Estimated wedding party size
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                        id="input_5"
                        name="q5_productNeeded"
                        data-component="dropdown"
                      >
                        <option value="">Please Select</option>
                        <option value="1-100">1 - 100</option>
                        <option value="101-200">101 - 200</option>
                        <option value="201-300">201 - 300</option>
                        <option value="301-400">301 - 400</option>
                        <option value="401-500">401 - 500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 contact-form-field grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                    <div>
                      <label
                        htmlFor="input_17"
                        className="block mb-1 text-md md:text-lg font-medium text-color"
                      >
                        Estimated wedding size
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-solid rounded-sm contact_border focus:outline-none"
                        name="q17_estimatedWedding"
                        id="input_17"
                        data-component="dropdown"
                      >
                        <option value="">Please Select</option>
                        <option value="1-100">1 - 100</option>
                        <option value="101-200">101 - 200</option>
                        <option value="201-300">201 - 300</option>
                        <option value="301-400">301 - 400</option>
                        <option value="401-500">401 - 500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="input_14"
                        className="block mb-1 text-md md:text-lg font-medium text-color"
                      >
                        Email address
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

                  <h2 className="mt-8 mb-3 text-lg font-semibold text-color sm:text-xl">
                    Physical Mailing Address
                  </h2>
                </div>

                <div className="w-full border border-t-0 border-solid"></div>

                <div className="px-4 pt-3 pb-6">
                  <div className="mb-3 contact-form-field ">
                    <label
                      htmlFor="input_8"
                      className="block mb-1 text-md md:text-lg font-medium text-color"
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
                        className="block mb-1 text-md md:text-lg font-medium text-color"
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
                        htmlFor="input_10"
                        className="block mb-1 text-md md:text-lg font-medium text-color"
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
                        className="block mb-1 text-md md:text-lg font-medium text-color"
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
                        className="block mb-1 text-md md:text-lg font-medium text-color"
                      >
                        Phone <span className="sterik_color">* </span>
                      </label>
                      <input
                        type="number"
                        id="input_15_full"
                        name="q15_phoneNumber[full]"
                        data-type="mask-number"
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
      <div className="mt-20"></div>

      <ImageSection
        path="/products/white-with-bride"
        title="The Perfect Wedding Gift"
        src={wed1}
        description="Wine Chillers"
      />

      <ImageSection
        path="/products/black-with-groom"
        title="Add Your Monogram"
        src={wed2}
        right
        description="Gift Sets"
      />

      <ImageSection
        path="/products/white-champagne-flutes-with-mrs-mr"
        title="Mr. & Mrs. Flutes"
        src={wed3}
      />
      <ImageSection
        path="/products/white-champagne-flute-with-mrs"
        title="Flute with Mr."
        src={wed4}
        right
      />

      <ImageSection path="/white-with-bride" title="Wine Chillers" src={wed5} />

      <ImageSection
        path="/products/gift-set-chiller-and-2-glasses"
        title="Wedding Gifts"
        src={wed6}
        right
      />

      <div className="block w-full mt-8 mb-8 md:mb-16 ">
        <div className="page-width ">
          <div className="inline-block w-full m-0 ">
            <div className="block w-full max-w-xl mx-auto text-center ">
              <h2 className="pb-1 m-0 text-xl md:text-2xl font-semibold uppercase leading-8 text-color">
                the elegent way to keep wine and champagine chilled
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
