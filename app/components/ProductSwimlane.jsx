import {ProductCard, Section, SliderCard} from '~/components';
import Slider from 'react-slick';

const mockProducts = new Array(12).fill('');

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
}) {
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

  return (
    <div className="page-width !mt-10 !mb-10 w-full">
      <h1 className=" text-lg font-bold mb-6">{title}</h1>
      <div className="collection_slider">
        <Slider
          {...homeProductSliderSettings}
          className="w-full best_seller slider"
        >
          {products?.map((product) => {
            return <SliderCard product={product} />;
          })}
        </Slider>
      </div>
    </div>
  );
}
