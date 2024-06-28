import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

import FadeLeftToRight from '../Animations/FadeLeftToRight.component';
import FadeLeftToRightItem from '../Animations/FadeLeftToRightItem.component';

import LINKS from '../../../constants/LINKS';

const hamburgerLine =
  'h-1 w-10 my-1 rounded-full bg-white transition ease transform duration-300 not-sr-only';

const opacityFull = 'opacity-100 group-hover:opacity-100';

/**
 * Hamburger component used in mobile menu. Animates to a X when clicked
 * @function Hamburger
 * @param {MouseEventHandler<HTMLButtonElement>} onClick - onClick handler to respond to clicks
 * @param {boolean} isExpanded - Should the hamburger animate to a X?
 * @returns {JSX.Element} - Rendered component
 */

const Hamburger = () => {
  const [isExpanded, setisExpanded] = useState(false);
  const [hidden, setHidden] = useState('invisible');

  useEffect(() => {
    if (isExpanded) {
      setHidden('');
    } else {
      setTimeout(() => {
        setHidden('invisible');
      }, 1000);
    }
  }, [isExpanded]);

  const handleMobileMenuClick = useCallback(() => {
    /**
     * Anti-pattern: setisExpanded(!isExpanded)
     * Even if your state updates are batched and multiple updates to the enabled/disabled state are made together
     * each update will rely on the correct previous state so that you always end up with the result you expect.
     */
    setisExpanded((prevExpanded) => !prevExpanded);
  }, [setisExpanded]);

  return (
    <div className="z-50 md:hidden lg:hidden xl:hidden">
      <button
        className="flex flex-col w-16 rounded justify-center items-center group"
        data-cy="hamburger"
        data-testid="hamburger"
        onClick={handleMobileMenuClick}
        aria-expanded={isExpanded}
        type="button"
      >
        <span className="sr-only text-white text-2xl">Hamburger</span>
        <span
          data-testid="hamburgerline"
          className={`${hamburgerLine} ${
            isExpanded
              ? 'rotate-45 translate-y-3 opacity-100 group-hover:opacity-100'
              : opacityFull
          }`}
        />
        <span
          className={`${hamburgerLine} ${
            isExpanded ? 'opacity-0' : opacityFull
          }`}
        />
        <span
          className={`${hamburgerLine} ${
            isExpanded
              ? '-rotate-45 -translate-y-3 opacity-100 group-hover:opacity-100'
              : opacityFull
          }`}
        />
      </button>
      <FadeLeftToRight
        delay={0.2}
        staggerDelay={0.2}
        animateNotReverse={isExpanded}
      >
        <div
          id="mobile-menu"
          aria-hidden={!isExpanded}
          className={`absolute left-0 bottom-24 z-10 w-full text-center text-black bg-white ${hidden}`}
        >
          <ul>
            {LINKS.map(({ id, title, href }) => (
              <FadeLeftToRightItem key={id} cssClass="block">
                <li
                  id="mobile-li"
                  className="w-full p-4 border-t border-gray-400 border-solid rounded"
                >
                  <Link href={href} passHref>
                    <span
                      className="inline-block px-4 py-2 no-underline hover:text-black hover:underline"
                      onClick={() => {
                        setisExpanded((prevExpanded) => !prevExpanded);
                      }}
                      onKeyDown={(event) => {
                        // 'Enter' key or 'Space' key
                        if (event.key === 'Enter' || event.key === ' ') {
                          setisExpanded((prevExpanded) => !prevExpanded);
                        }
                      }}
                      tabIndex={0} // Make the span focusable
                      role="button" // Indicate the span acts as a button
                    >
                      {title}
                    </span>
                  </Link>
                </li>
              </FadeLeftToRightItem>
            ))}
          </ul>
        </div>
      </FadeLeftToRight>
    </div>
  );
};

export default Hamburger;
