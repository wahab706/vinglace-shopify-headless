import {Button} from './Button';
import {FeaturedSection} from './FeaturedSection';
import {PageHeader, Text} from './Text';
import errorIcon from '../images/error_icon_50.png';

export function GenericError({error}) {
  const heading = `Something’s wrong here.`;
  let description = `We found an error while loading this page.`;

  // TODO hide error in prod?
  if (error) {
    description += `\n${error.message}`;
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return (
    <div className="relative h-screen-no-nav">
      {/* <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        {error?.stack && (
          <pre
            style={{
              padding: '2rem',
              background: 'hsla(10, 50%, 50%, 0.1)',
              color: 'red',
              overflow: 'auto',
              maxWidth: '100%',
            }}
            dangerouslySetInnerHTML={{
              __html: addLinksToStackTrace(error.stack),
            }}
          />
        )}
        <Button width="auto" variant="secondary" to={'/'}>
          Take me to the home page
        </Button>
      </PageHeader>
      <FeaturedSection />  */}

      <div className="page-width">
        <div className="flex justify-center flex-col items-center absolute top-0 bottom-0 right-0 left-0">
          <img src={errorIcon} alt="Error" className="mb-5" />
          <h1 className="text-md sm:lg md:text-xl font-semibold text-center">
            Oops! Something went wrong.
          </h1>
          <p className="mt-2 text-sm sm:text-md tracking-wide text-center">
            We found an error while loading this page.
          </p>
          {error && (
            <p className="mt-3 text-sm md:text-md text-red-600 tracking-wide capitalize font-semibold">
              {`Error:  ${error.message}`}
            </p>
          )}

          <Button
            width="auto"
            variant="secondary"
            to={'/'}
            className="mt-7 tracking-wide rounded-full"
          >
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}

function addLinksToStackTrace(stackTrace) {
  return stackTrace?.replace(
    /^\s*at\s?.*?[(\s]((\/|\w\:).+)\)\n/gim,
    (all, m1) =>
      all.replace(
        m1,
        `<a href="vscode://file${m1}" className="hover:underline">${m1}</a>`,
      ),
  );
}
