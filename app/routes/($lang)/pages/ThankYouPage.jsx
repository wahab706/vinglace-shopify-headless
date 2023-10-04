import {Button, IconLongArrowRight} from '~/components';

export function ThankYouPage() {
  return (
    <div className="relative h-screen-no-nav">
      <div className="page-width mt-20">
        <div className="flex justify-center flex-col items-center absolute top-24 right-0 left-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="60"
            height="60"
            viewBox="0 0 48 48"
          >
            <path
              fill="#43A047"
              d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"
            ></path>
          </svg>
          <h1 className="mt-4 text-3xl font-bold text-center">Thank You!</h1>
          <p
            className="mt-3 text-sm text-center font-semibold"
            style={{letterSpacing: '1px'}}
          >
            Your Form has been successfully submitted.
          </p>
          <p className="mt-2 text-sm tracking-wide text-center">
            Our team will contact you shortly.
          </p>
          <Button
            width="auto"
            variant="secondary"
            to={'/'}
            className="mt-7 tracking-wide flex items-center gap-2"
          >
            Continue Shopping
            <IconLongArrowRight className={'fill-slate-200'} />
          </Button>
        </div>
      </div>
    </div>
  );
}
