import { useState, useEffect, useRef } from 'react';

interface NestedHeading {
  id: string;
  title: string;
  items: Array<{ id: string; title: string }>;
}

const Headings = ({ headings, activeId }) => (
  <ul>
    {headings.map((heading) => (
      <li
        key={heading.id}
        className={`py-1 ${
          heading.id === activeId ? 'text-black' : 'text-gray-400'
        }`}
      >
        <a
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(`#${heading.id}`).scrollIntoView({
              behavior: 'smooth',
            });
          }}
          className="hover:text-black transition-colors duration-300"
        >
          {heading.title}
        </a>
        {heading.items.length > 0 && (
          <ul>
            {heading.items.map((child) => (
              <li
                key={child.id}
                className={`pl-4 py-1 ${
                  child.id === activeId ? 'text-black' : 'text-gray-400'
                }`}
              >
                <a
                  href={`#${child.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(`#${child.id}`).scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className="hover:text-black transition-colors duration-300"
                >
                  • {child.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

const getNestedHeadings = (headingElements: HTMLElement[]) => {
  const nestedHeadings: NestedHeading[] = [];

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === 'H1') {
      nestedHeadings.push({ id, title, items: [] });
    } else if (
      heading.nodeName === 'H2' ||
      (heading.nodeName === 'H3' && nestedHeadings.length > 0)
    ) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
      });
    }
  });

  return nestedHeadings;
};

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<NestedHeading[]>([]);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll('h1, h2, h3')
    ) as HTMLElement[];

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

interface HeadingElementMap {
  [key: string]: IntersectionObserverEntry;
}

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef({});
  useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
    });

    const headingElements = Array.from(document.querySelectorAll('h1, h2, h3'));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

const TableOfContents = () => {
  const [activeId, setActiveId] = useState();
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <nav className="w-56 text-xs min-w-[220px] sticky top-12 max-h-[calc(100vh-70px)] overflow-auto p-4  bg-white border-l">
      <Headings headings={nestedHeadings} activeId={activeId} />
    </nav>
  );
};

export default TableOfContents;
