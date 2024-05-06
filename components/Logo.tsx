import Image from 'next/image';
import Link from 'next/link';
import Next from '@/public/next.svg';

export default function Logo() {
  return (
    <div>
      <Link href="/dashboard">
        <Image
          priority
          src={Next}
          alt=""
          width={100}
          height={10}
          className="mr-2"
        />
      </Link>
    </div>
  );
}
