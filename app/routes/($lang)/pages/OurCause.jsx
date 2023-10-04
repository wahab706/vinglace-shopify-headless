import React from 'react';
import {Link} from '~/components';
import ourCauseImg from '../../../images/our-cause.png';
import ourCauseLogo from '../../../images/our-cause-logo.png';
import cause1 from '../../../images/cause1.png';
import cause2 from '../../../images/cause2.png';

export function OurCause() {
  return (
    <div className="mb-16">
      <div className="pt-5 about_banner mb-20">
        <div className="page-width">
          <section
            className="w-full bg-repeat bg-cover image_banner page-banner"
            style={{backgroundImage: `url(${ourCauseImg})`}}
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

      <div className="block w-full home_img_with_txt ">
        <div className="page-width ">
          <div className="grid items-center grid-cols-1 md:grid-cols-2 img_txt_inner ">
            <div className={`image_dv`}>
              <img className="block w-full " src={cause1} alt="image " />
            </div>
            <div className="p-6 text-center contant_dv md:px-16">
              <div className="flex justify-center pb-4 ">
                <img src={ourCauseLogo} alt="" />
              </div>
              <h4 className="pb-4 text-xl font-medium sm:text-2xl text-color ">
                Our Cause
              </h4>

              <p
                className="m-0 text-sm text-color text-center"
                style={{letterSpacing: '1px'}}
              >
                I am Alyson Haas and in 2014 our lives were changed when I was
                diagnosed with breast cancer. At the age of 35, and with two
                young children, I never imagined this would happen to me. But
                with early detection and the best medical care, I am happy to
                say I am cancer free! After this life-changing experience, we
                were determined to give back in some way.
                <br />
                <br />
                That is why for EVERY product we sell on our website, we will
                donate a portion of the proceeds to breast cancer research. We
                want you to know that we are passionate about this cause, and
                with your help, we will all support research for breast cancer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="block w-full home_img_with_txt ">
        <div className="page-width ">
          <div className="grid items-center grid-cols-1 md:grid-cols-2 img_txt_inner ">
            <div className={`image_dv md:order-2`}>
              <img className="block w-full " src={cause2} alt="image " />
            </div>
            <div className="p-6 text-center contant_dv md:px-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
