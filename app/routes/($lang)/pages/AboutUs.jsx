import React from 'react';
import {Link} from '~/components';
import abt from '../../../images/abt.png';
import abt1 from '../../../images/abt1.png';
import abt2 from '../../../images/abt2.png';
import abt3 from '../../../images/abt3.png';
import abt4 from '../../../images/abt4.png';
import abt5 from '../../../images/abt5.png';
import abtBtmBnr from '../../../images/abt-btm-bnr.png';

export function AboutUs() {
  const ImageSection = ({title, description, src, right}) => {
    return (
      <div className="block w-full home_img_with_txt ">
        <div className="page-width ">
          <div className="grid items-center grid-cols-1 md:grid-cols-2 img_txt_inner ">
            <div className={`image_dv ${right ? 'md:order-2' : ''}`}>
              <img className="block w-full " src={src} alt="image " />
            </div>
            <div className="p-6 text-center contant_dv md:px-16">
              <h4 className="pb-4 text-xl font-medium sm:text-2xl text-color ">
                {title}
              </h4>
              <p
                className="m-0 text-sm text-color leading-5"
                style={{letterSpacing: '1px'}}
              >
                {description}
              </p>
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
            style={{backgroundImage: `url(${abt})`}}
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
            <div className="w-full max-w-md mx-auto text-center ">
              <h2
                className="pb-1 m-0 text-2xl md:text-3xl font-medium leading-8 uppercase text-color sm:text-3xl "
                style={{letterSpacing: '3px'}}
              >
                drink better
              </h2>
              <p
                className="text-sm tracking-wide text-color "
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
        title="Multi-Purpose Products"
        src={abt1}
        description="While relaxing in the pool with some friends on a hot summer day
                in Austin, Texas, we noticed our wine was getting hot. We didn't
                want the mess of an ice bucket, or to have to continue to go
                inside for another glass, so we were determined to find a better
                way."
      />

      <ImageSection
        title="Multi-Purpose Products"
        src={abt2}
        right
        description="While relaxing in the pool with some friends on a hot summer day
                in Austin, Texas, we noticed our wine was getting hot. We didn't
                want the mess of an ice bucket, or to have to continue to go
                inside for another glass, so we were determined to find a better
                way."
      />

      <ImageSection
        title="Multi-Purpose Products"
        src={abt3}
        description="While relaxing in the pool with some friends on a hot summer day
                in Austin, Texas, we noticed our wine was getting hot. We didn't
                want the mess of an ice bucket, or to have to continue to go
                inside for another glass, so we were determined to find a better
                way."
      />
      <ImageSection
        title="Multi-Purpose Products"
        src={abt4}
        right
        description="While relaxing in the pool with some friends on a hot summer day
                in Austin, Texas, we noticed our wine was getting hot. We didn't
                want the mess of an ice bucket, or to have to continue to go
                inside for another glass, so we were determined to find a better
                way."
      />

      <ImageSection
        title="Multi-Purpose Products"
        src={abt5}
        description="While relaxing in the pool with some friends on a hot summer day
                in Austin, Texas, we noticed our wine was getting hot. We didn't
                want the mess of an ice bucket, or to have to continue to go
                inside for another glass, so we were determined to find a better
                way."
      />

      {/* <!-- ======about banner====== --> */}
      <div className="pt-2 md:pt-12 about_banner">
        <div className="page-width">
          <section
            className="w-full bg-repeat bg-cover image_banner page-banner"
            style={{backgroundImage: `url(${abtBtmBnr})`}}
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
      <div className="block w-full mt-8 mb-8 md:mb-16 ">
        <div className="page-width ">
          <div className="inline-block w-full m-0 ">
            <div className="block w-full max-w-xl mx-auto text-center ">
              <h2
                className="pb-1 m-0 text-2xl font-medium leading-8 text-color sm:text-3xl "
                style={{letterSpacing: '2px'}}
              >
                Why I started Vinglacé
              </h2>
              <p
                className="text-sm tracking-wide text-color "
                style={{letterSpacing: '1px'}}
              >
                While relaxing in the pool with some friends on a hot summer day
                in Austin, Texas, we noticed our wine was getting hot. We didn't
                want the mess of an ice bucket, or to have to continue to go
                inside for another glass, so we were determined to find a better
                way. Since then, we've spent countless hours imagining,
                designing, and creating the ideal, mess free, way to solve that
                problem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
