'use client';

import * as React from 'react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserButton, useUser } from '@clerk/nextjs';
import useNavigation from '@/hooks/use-navigation';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { Menu, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation';
import useMediaQuery from '@/hooks/use-media-query';
import { Links } from '@/lib/constants';

interface SidebarNavProps {
  isCollapsed: boolean;
}

interface ActivePath {
  [key: string]: boolean;
}

export function Sidebar({ isCollapsed }: SidebarNavProps) {
  const activePath: ActivePath = useNavigation();
  const { isSignedIn } = useUser();

  return (
    <nav className="flex flex-col gap-2 p-2 mt-10">
      {Links.map((link, index) =>
        isCollapsed ? (
          <Tooltip key={index} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href={link.path}>
                <div className=" flex items-center justify-center hover:bg-gray-200 hover:rounded-md">
                  <link.icon
                    className={cn(`h-10 w-20  p-2 rounded-md`, {
                      'bg-black text-white': activePath[link.title],
                    })}
                  />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-bold">
              {link.title}
            </TooltipContent>
          </Tooltip>
        ) : (
          // not collapsed
          <Link key={index} href={link.path}>
            <div
              className={cn(
                `flex items-center p-2 hover:bg-black hover:text-white hover:rounded-md`,
                {
                  'font-bold': activePath[link.title],
                }
              )}
            >
              {activePath[link.title] ? (
                <link.icon className="h-6 w-6" strokeWidth={2.5} />
              ) : (
                <link.icon className="h-6 w-6" strokeWidth={2} />
              )}
              <span className="ml-2">{link.title}</span>
            </div>
          </Link>
        )
      )}
    </nav>
  );
}

interface UserProps {
  isCollapsed: boolean;
}

export function User({ isCollapsed }: UserProps) {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center justify-between m-4">
      {isSignedIn ? (
        <div className="flex items-center space-x-2">
          <UserButton afterSignOutUrl="/" />
          {!isCollapsed && <span>{user.fullName}</span>}
        </div>
      ) : (
        <Link href="/sign-in">
          <Button>Log in</Button>
        </Link>
      )}
    </div>
  );
}

function getPageTitleByPath(pathname: string): string {
  const link = Links.find((link) => link.path === pathname);
  return link ? link.title : '';
}

const urlSchema = z.object({
  url: z.string().url('Please enter a valid YouTube URL.'),
});

export function SubmitYouTubeURL({ onClose }: { onClose: () => void }) {
  const { user } = useUser();

  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  console.log(user?.id);

  const onSubmit = async (data: z.infer<typeof urlSchema>) => {
    const response = await fetch(
      'https://weichunnn-production--yt-university-app.modal.run/api/process',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: data.url, user_id: user?.id }),
      }
    );

    console.log(data.url);
    console.log(response);

    const call_id = await response.json();

    if (response.ok) {
      const parsedUrl = new URL(data.url);
      const videoId = parsedUrl.searchParams.get('v');

      if (videoId) {
        reset();
        window.location.href = `/read/${videoId}?call_id=${call_id.call_id}`;
      } else {
        console.error('No video ID found in the URL');
      }
    } else {
      console.error('Failed to submit URL');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxxx"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The summarization will take a few minutes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function Nav({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const pathname = usePathname();
  const pageTitle = getPageTitleByPath(pathname);
  const { isMobile, isDesktop } = useMediaQuery();
  const { isSignedIn } = useUser();

  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    } else if (isDesktop) {
      setIsCollapsed(false);
    }
  }, [isMobile, isDesktop]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-screen ">
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-100 w-full">
          <div className="flex items-center">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="m-4"
            >
              <Menu size={32} />
            </Button>
            {isDesktop && <Logo />}

            <div className="flex-grow text-center content-center text-2xl font-sans font-bold">
              {pageTitle}
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              className="mr-4 items-center gap-2 py-6"
            >
              Add video
              <Plus />
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          {!isSignedIn ? (
            <DialogContent className="items-center justify-center">
              <DialogTitle className="my-10">
                Please sign up to submit a video
              </DialogTitle>
              <Link href="/sign-up" className="text-center">
                <Button className="p-4">Log in</Button>
              </Link>
            </DialogContent>
          ) : (
            <DialogContent>
              <DialogTitle>Add YouTube URL</DialogTitle>
              <SubmitYouTubeURL onClose={() => setDialogOpen(false)} />
            </DialogContent>
          )}
        </Dialog>

        <div className={`flex h-[calc(100vh-5rem)]`}>
          {/* sidebar */}
          <TooltipProvider delayDuration={0}>
            <div
              className={`flex flex-col justify-between border-r border-gray-100 ${
                isCollapsed ? 'w-16' : 'min-w-48'
              } flex-shrink-0`}
            >
              <div>
                <Sidebar isCollapsed={isCollapsed} />
              </div>
              <User isCollapsed={isCollapsed} />
            </div>
          </TooltipProvider>

          <ScrollArea className="flex-grow px-10">
            <div className="h-5"></div>
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
