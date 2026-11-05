// apps/my_start/src/routes/about.tsx

import { UiButton } from '@domo/ui-buttons';
import { createFileRoute, Link } from '@tanstack/react-router';
import { BsCloudArrowUpFill } from 'react-icons/bs';
import { FaLock, FaServer } from 'react-icons/fa';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4 pb-19">
      <main className="island-shell rise-in flex flex-col items-center justify-center max-w-9/10 min-h-[60vh] px-4 text-left rounded-lg">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <section className=" p-6 sm:p-8">
          <div className="pt-8 flex justify-center w-full">
            <UiButton className="z-10 w-full max-w-sm">
              <Link
                to="/quote"
                className="text-center bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded block w-full"
              >
                Click Here For A Free Estimate
              </Link>
            </UiButton>
          </div>
          <div className="pt-5">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10 p-5">
              <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                <div className="lg:pr-4">
                  <div className="lg:max-w-lg">
                    <p className="text-base font-semibold leading-7 text-red-600">
                      Developing a better web experience
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                      A better workflow
                    </h1>
                    <p className="mt-6 text-md md:text-xl leading-8">
                      Optimize your web development process with full-stack web development experts
                      from Me and my associates. Our dedicated developers can help you build,
                      expand, and deliver your web assets at scale.
                    </p>
                  </div>
                </div>
              </div>
              <div className="-mt-12 -ml-12 p-12 lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden ">
                <img
                  className="w-full h-auto object-cover rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10"
                  src="domoservices_site.webp"
                  alt="webpage"
                />
                <div className="pt-10">
                  <p className="uppercase text-center text-green-700 font-bold text-3xl italic">
                    Your Onestop Print Needs!
                  </p>
                  <h6 className="my-6 text-md md:text-l text-dark-light">
                    While digital marketing is extremely important for large or small businesses,
                    there is still no substitute for good printed marketing materials. Typically,
                    businesses need business cards, letterhead, brochures, and postcards, but
                    numerous other printed materials can help you develop your brand. These include
                    signage and promotional materials such as branded merchandise and
                    giveawaysâ€”especially helpful if you regularly launch events as part of your
                    marketing.
                  </h6>
                  <img
                    className="size-112 md:size-160 rounded-xl justify-center"
                    src="brandMockup.webp"
                    alt="brand"
                  />
                </div>
              </div>
              <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                <div className="lg:pr-4">
                  <div className="max-w-xl text-base leading-7 lg:max-w-lg">
                    <p>
                      We will establish a direction for a new, custom logo mark that utilizes icons
                      to reflect both topics of identity and functionality, that implements a bold
                      and playful typographic treatment and color palette. Furthering these design
                      elements, print advertising materials, such as a direct mail piece and flyer,
                      were designed to help further communicate the message of the companies and
                      share details on the unique services they offer to those who are interested.
                    </p>
                    <ul className="mt-8 space-y-8">
                      <li className="flex gap-x-3">
                        <BsCloudArrowUpFill
                          className="mt-1 h-5 w-5 flex-none text-red-600"
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="font-semibold dark:">Push to deploy.</strong> Build
                          frontend, backend, and mobile in a clear and telling UI. Switch between
                          visual and code configuration. Define custom actions, or let our team
                          deliver the features your company needs.
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <FaLock
                          className="mt-1 h-5 w-5 flex-none text-red-600"
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="font-semibold">SSL certificates.</strong> Me and my
                          associates offer the best SSL certificates options to meet varying needs.
                          Whether you’re an e-Commerce site seeking the highest level of
                          authentication for your domain name, an enterprise looking to secure
                          multiple subdomains, or have different business needs, Sectigo is your
                          trusted certificate provider.
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <FaServer
                          className="mt-1 h-5 w-5 flex-none text-red-600"
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="font-semibold">Database backups.</strong> If you’re
                          looking to optimize your technology systems, improve productivity, and
                          save money, working with Me and my associates can help. With a team of
                          expert consultants and customizable solutions tailored to meet your
                          specific needs, Me and my associates can help you achieve your business
                          goals and build a long-term partnership focused on delivering value.
                          Whether you need help with database management, enterprise portals and
                          collaboration, business intelligence and analytics, or technology
                          consulting, Me and my associates has the expertise to help your business
                          succeed.
                        </span>
                      </li>
                    </ul>
                    <h2 className="mt-16 text-2xl font-bold tracking-tight">
                      No server? No problem.
                    </h2>
                    <p className="mt-6">
                      Me and my associates can still write code using your favorite language and
                      platforms! Only now you focus on creating the best APIs for your application.
                      Or, you can use your developer skills to automate the generation of static
                      assets and deploy your application.
                    </p>
                    <div className="px-10">
                      <ol className="list-disc">
                        <li>Simplify architecture</li>
                        <li>Leverage the best 3rd-party APIs</li>
                        <li>Take advantage of CDNs</li>
                        <li>Intensely focus on delivering business value</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
