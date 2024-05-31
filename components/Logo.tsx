import Image from 'next/image';
import Link from 'next/link';
import Next from '@/public/next.svg';

export default function Logo() {
  return (
    <div>
      <Link href="/dashboard">
        <p className="text-2xl font-serif">Sumrize</p>
      </Link>
    </div>
  );
}
