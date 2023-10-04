import {Button} from './Button';
import {FeaturedSection} from './FeaturedSection';
import {PageHeader, Text} from './Text';
import {IconLongArrowRight} from '~/components';

export function NotFound({type = 'page'}) {
  const heading = `404 ${type} Not Found`;
  const description = `The ${type} you requested does not exist.`;

  return (
    <div className="relative h-screen-no-nav">
      <div className="page-width mt-20">
        <div className="flex justify-center flex-col items-center absolute top-0 bottom-0 right-0 left-0">
          <h1 className="text-3xl font-bold text-center">{heading}</h1>
          <p className="mt-2 text-md tracking-wide text-center">
            {description}
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
