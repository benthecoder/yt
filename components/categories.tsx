'use client';

import Link from 'next/link';
import { IconMap } from '@/lib/constants';

interface PropType {
  categories: string[];
}

const CategoriesNav: React.FC<PropType> = ({ categories }) => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl">Categories</h1>
        <p className="text-gray-600 font-light">
          Discover all {categories.length} categories
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category: string) => {
          const Icon = IconMap[category];
          return (
            <Link
              key={category}
              href={`/explore/${category}`}
              className="flex text-md text-black border border-black gap-2 p-2 items-center justify-center rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              {Icon && <Icon size={18} />}
              <span>{category}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesNav;
