import { UiButton } from '@domo/ui-buttons';
import type React from 'react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = memo(() => (
  <div className="">
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-dark-hard">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
      <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">Page Not Found</div>
      <UiButton type="button" className="mt-5">
        <div className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring">
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>

          <span className="relative block px-8 py-3 bg-gray-800 border border-current">
            <Link to="/">Go Home</Link>&nbsp;&nbsp;&nbsp;
            <span className="text-sm text-[#FF6A3D]">
              <Link to="/Contact">
                Contact support <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </span>
        </div>
      </UiButton>
    </div>
  </div>
));

export { NotFound };
