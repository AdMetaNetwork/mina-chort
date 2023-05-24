import { FC, ReactNode, Context } from "react";
import Head from 'next/head';

import * as U from '@/utils'

type Props = {
  children: ReactNode
};

const Base: FC<Props> = ({ children }) => {

  return (
    <div>
      <Head>
        <title>{U.C.SEO_DEFAULT_TITLE}</title>
        <meta name="keywords" content={U.C.SEO_DEFAULT_KEYWORDS} />
        <meta name="description" content={U.C.SEO_DEFAULT_DESCRIPTION} />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <main className="h-screen bg-black-1000 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default Base;
