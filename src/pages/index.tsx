import Head from "next/head";
import Image from 'next/image';
import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingPage } from "~/components/loading";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) return null

  return <div className="flex gap-3 w-full">
    <Image src={user.profileImageUrl} alt="Profile image" className="h-14 w-14 rounded-full" height={56} width={56} />
    <input placeholder="Type some emojis!" className="bg-transparent grow outline-none" />
  </div>

}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex p-4 gap-3 border-b border-slate-400">
      <Image src={author.profileImageUrl} className="h-14 w-14 rounded-full" alt={`@{author.username}'s profile picture`} height={56} width={56} />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-1">
          <span>{`@${author.username}`}</span><span className="font-thin">{`• ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>

    </div >
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />
  if (!data) return <div>Something went wrong...</div>

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}


export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  // Return emptu div if user isn't loaded yet
  if (!userLoaded) return <div />


  return (
    <>
      <Head>
        <title>T3 Twitter Emoji</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="h-full w-full md:max-w-2xl border-x border-slate-400">
          <div className="border-b border-slate-400 p-4 flex">
            {!isSignedIn && <div className="flex justify-center"><SignInButton /></div>}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}
