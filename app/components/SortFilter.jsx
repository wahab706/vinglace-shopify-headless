import {useMemo, useState, useEffect} from 'react';
import {Menu} from '@headlessui/react';
import RangeSlider from 'react-range-slider-input';

import {
  Heading,
  IconFilters,
  IconCaret,
  IconXMark,
  IconClose,
} from '~/components';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import {useDebounce} from 'react-use';
import {Disclosure} from '@headlessui/react';

export function SortFilter({
  type,
  filters,
  appliedFilters = [],
  children,
  collections = [],
  collectionPriceDetails,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {type == 'sort' && (
        <>
          <div className="mobile_filter_drawer md:hidden">
            <div
              className={`${
                isOpen ? 'active' : ''
              } fixed top-0 left-0 hidden w-full h-full overlay`}
              id="slideoverlay"
            ></div>

            <div
              className={`${
                isOpen ? 'active' : ''
              } fixed top-0 left-0 hidden w-full h-screen bg-white ul_navbar_2`}
            >
              <div className="relative block w-full p-3 text-base font-semibold text-center text-black uppercase border-b font-heavy">
                Filter By
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4"
                >
                  <IconClose />
                </button>
              </div>
              <div className="block w-full h-screen px-6 pt-3 overflow-y-scroll plp_filters plp-mobile-filter">
                <FiltersMenu
                  collections={collections}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  collectionPriceDetails={collectionPriceDetails}
                />

                <SortMenu />
              </div>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={
                'relative flex gap-2 items-center justify-center md:w-8 h-8 focus:ring-primary/5'
              }
            >
              <IconFilters />
              <p className="text-black text-sm"> Filter and sort</p>
            </button>
          </div>

          <div className="hidden md:block">
            <SortMenu />
          </div>
        </>
      )}
      {type == 'filter' && (
        <FiltersMenu
          collections={collections}
          filters={filters}
          appliedFilters={appliedFilters}
          collectionPriceDetails={collectionPriceDetails}
        />
      )}
    </>
  );
}

export function FiltersMenu({
  filters = [],
  appliedFilters = [],
  collections = [],
  collectionPriceDetails,
}) {
  const [params] = useSearchParams();
  const location = useLocation();

  const filterMarkup = (filter, option) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const min =
          params.has('minPrice') && !isNaN(Number(params.get('minPrice')))
            ? Number(params.get('minPrice'))
            : undefined;

        const max =
          params.has('maxPrice') && !isNaN(Number(params.get('maxPrice')))
            ? Number(params.get('maxPrice'))
            : undefined;

        return (
          <PriceRangeFilter
            min={min}
            max={max}
            collectionPriceDetails={collectionPriceDetails}
          />
        );

      default:
        const to = getFilterLink(filter, option.input, params, location);

        // console.log(getAppliedFilterValue(appliedFilters, option, params));
        return (
          <Link
            className="font-regular sidebar-li flex items-center"
            prefetch="intent"
            to={to}
          >
            {/* <input
              type="checkbox"
              className="filter_checkbox"
              id={option.id}
              checked={true}
            /> */}
            <label
              htmlFor={option.id}
              className="ml-2 text-xs font-normal capitalize hover:cursor-pointer"
            >
              {option.label}
            </label>
          </Link>
        );
    }
  };

  const collectionsMarkup = collections.map((collection) => {
    return (
      <li key={collection.handle} className="pb-4">
        <Link
          to={`/collections/${collection.handle}`}
          className="focus:underline hover:underline"
          key={collection.handle}
          prefetch="intent"
        >
          {collection.title}
        </Link>
      </li>
    );
  });

  return (
    <>
      <nav className="">
        {appliedFilters.length > 0 ? (
          <div className="pb-8">
            <AppliedFilters filters={appliedFilters} />
          </div>
        ) : null}

        <div className="filters-section">
          {filters.map((filter, index) =>
            filter.type == 'PRICE_RANGE' || filter.values.length > 1 ? (
              <Disclosure
                as="div"
                key={filter.id}
                // defaultOpen={index == 0}
                className="block w-full sidebar-header"
              >
                {({open}) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between py-3 m-0 text-sm font-semibold capitalize cursor-pointer insort1-js">
                      <h2 className="max-w-prose text-xs whitespace-pre-wrap inherit text-left  font-heavy">
                        {filter.label}
                      </h2>
                      <IconCaret direction={open ? 'up' : 'down'} />
                    </Disclosure.Button>

                    <Disclosure.Panel
                      key={filter.id}
                      className="block w-full pb-5 pt-3 sidebar-list"
                    >
                      <ul
                        key={filter.id}
                        className="w-full pr-3 m-0 overflow-x-hidden overflow-y-auto sidebar-ul max-h-48"
                      >
                        {filter.values?.map((option) => {
                          return (
                            <li key={option.id} className="pb-4 font-regular">
                              {filterMarkup(filter, option)}
                            </li>
                          );
                        })}
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ) : (
              ''
            ),
          )}
        </div>
      </nav>
    </>
  );
}

function AppliedFilters({filters = []}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      <h4 className="whitespace-pre-wrap max-w-prose text-lead pb-4 font-black font-heavy">
        Applied filters
      </h4>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          return (
            <Link
              to={getAppliedFilterLink(filter, params, location)}
              className="flex py-1.5 px-3 items-center border rounded-full gap-1"
              key={`${filter.label}-${filter.urlParam}`}
            >
              <span className="flex-grow text-xs font-normal">
                {filter.label}
              </span>
              <span>
                <IconXMark className="w-4 h-4 -mt-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function getAppliedFilterLink(filter, params, location) {
  const paramsClone = new URLSearchParams(params);
  if (filter.urlParam.key === 'variantOption') {
    const variantOptions = paramsClone.getAll('variantOption');
    const filteredVariantOptions = variantOptions.filter(
      (options) => !options.includes(filter.urlParam.value),
    );
    paramsClone.delete(filter.urlParam.key);
    for (const filteredVariantOption of filteredVariantOptions) {
      paramsClone.append(filter.urlParam.key, filteredVariantOption);
    }
  } else {
    paramsClone.delete(filter.urlParam.key);
  }
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getAppliedFilterValue(appliedFilters, option, params) {
  const paramsClone = new URLSearchParams(params);

  const variantOptions = paramsClone.getAll('variantOption' || 'available');
  // const filteredVariantOptions = variantOptions.filter(
  //   (options) => !options.includes(filter.urlParam.value),
  // );
  // console.log('filtered: ', filter, filteredVariantOptions);
  console.log('variantOptions: ', variantOptions);
  console.log('appliedFilters', appliedFilters);
  console.log('option', option);
}

function getSortLink(sort, params, location) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

function getFilterLink(filter, rawInput, params, location) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(filter.type, rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({max, min, collectionPriceDetails}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min ? String(min) : '');
  const [maxPrice, setMaxPrice] = useState(max ? String(max) : '');
  const [value, setValue] = useState([
    min ? min : 0,
    max
      ? max
      : collectionPriceDetails?.amount
      ? collectionPriceDetails?.amount + 1
      : 999999,
  ]);

  useDebounce(
    () => {
      if (
        (minPrice === '' || minPrice === String(min)) &&
        (maxPrice === '' || maxPrice === String(max))
      )
        return;

      const price = {};
      if (minPrice !== '') price.min = minPrice;
      if (maxPrice !== '') price.max = maxPrice;

      const newParams = filterInputToParams('PRICE_RANGE', {price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  useEffect(() => {
    if (value[1] != collectionPriceDetails?.amount + 1) {
      setMinPrice(value[0]);
      setMaxPrice(value[1]);
    }
  }, [value]);

  const onChangeMax = (event) => {
    const newMaxPrice = event.target.value;
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event) => {
    const newMinPrice = event.target.value;
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col">
      <RangeSlider
        value={value}
        onInput={setValue}
        min={0}
        max={
          collectionPriceDetails?.amount
            ? Math.ceil(collectionPriceDetails?.amount)
            : 999999
        }
      />
      <div className="range-slider-labels">
        <span>$0</span>
        {collectionPriceDetails?.amount && (
          <span>${Math.ceil(collectionPriceDetails?.amount)}</span>
        )}
      </div>

      {/* <label className="mb-4 mt-4">
        <span>Min</span>
        <input
          name="maxPrice"
          className="text-black"
          type="text"
          defaultValue={min}
          // placeholder={'$'}
          onChange={onChangeMin}
        />
      </label>
      <label>
        <span>Max</span>
        <input
          name="minPrice"
          className="text-black"
          type="number"
          defaultValue={max}
          // placeholder={'$'}
          onChange={onChangeMax}
        />
      </label> */}
    </div>
  );
}

function filterInputToParams(type, rawInput, params) {
  const input = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;
  switch (type) {
    case 'PRICE_RANGE':
      if (input.price.min) params.set('minPrice', input.price.min);
      if (input.price.max) params.set('maxPrice', input.price.max);
      break;
    case 'LIST':
      Object.entries(input).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        } else if (typeof value === 'boolean') {
          params.set(key, value.toString());
        } else {
          const {name, value: val} = value;
          const allVariants = params.getAll(`variantOption`);
          const newVariant = `${name}:${val}`;
          if (!allVariants.includes(newVariant)) {
            params.append('variantOption', newVariant);
          }
        }
      });
      break;
  }

  return params;
}

export default function SortMenu() {
  const items = [
    {label: 'Featured', key: 'featured'},
    {
      label: 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: 'Price: High - Low',
      key: 'price-high-low',
    },
    {
      label: 'Best Selling',
      key: 'best-selling',
    },
    {
      label: 'Newest',
      key: 'newest',
    },
  ];
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem = items.find((item) => item.key === params.get('sort'));

  return (
    <Menu as="div" className="relative z-40 sidebar-sort">
      <Menu.Button className="sort-btn flex justify-between items-center rounded-full border px-2 w-40 md:w-52 h-11 font-heavy font-black sort-button">
        <span className="px-2 sort-text-div">
          <span className="hidden px-2 font-medium">Sort by:</span>
          <span className="text-xs uppercase sort-text">
            {activeItem ? activeItem.label : 'Sort by'}
          </span>
        </span>
        <IconCaret />
      </Menu.Button>

      <Menu.Items
        as="nav"
        className="sort-drawer-nav absolute right-0 flex flex-col text-left rounded-sm w-40 md:w-52 sort-nav"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link
                className={`block pb-2 px-3 text-sm ${
                  activeItem?.key === item.key ? 'font-bold' : 'font-normal'
                }`}
                // style={{fontFamily: 'MrEavesXLModNarOT-Reg'}}
                to={getSortLink(item.key, params, location)}
              >
                {item.label}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
