import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Layout } from "./layout/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { Dashboard } from "pages/Dashboard/Dashboard";
import { Events } from "pages/Events/Events";
import { MyTeam } from "pages/MyTeam/MyTeam";
import { TeamIndex } from "pages/MyTeam/TeamIndex";
import { MyNetwork } from "pages/MyNetwork/MyNetwork";
import { NetworkIndex } from "pages/MyNetwork/NetworkIndex";
import { MyPlaymate } from "pages/MyPlaymate/MyPlaymate";
import { Settings } from "pages/Settings/Settings";
import { LoginRegister } from "pages/LoginRegister/LoginRegister";

import "@fontsource/public-sans/300.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/public-sans/700.css";
import "@fontsource/public-sans/800.css";
import "./global.css";

// Error page component
function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center mb-4">
          <div className="bg-red-600 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">404 - Page Not Found</h1>
        </div>
        
        <p className="text-gray-300 mb-4">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "",
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: Dashboard
      },
      {
        path: "/dashboard",
        Component: Dashboard
      },
      {
        path: "/playmate/index",
        Component: MyPlaymate
      },
      {
        path: "/my-playmate",
        loader: () => {
          throw new Response("", { status: 302, headers: { Location: "/playmate/index" } });
        }
      },
      {
        path: "/team",
        Component: MyTeam
      },
      {
        path: "/teams",
        loader: () => {
          throw new Response("", { status: 302, headers: { Location: "/team" } });
        }
      },
      {
        path: "/team/index",
        Component: TeamIndex
      },
      {
        path: "/events",
        Component: Events
      },
      {
        path: "/create-event",
        loader: () => {
          throw new Response("", { status: 302, headers: { Location: "/events" } });
        }
      },
      {
        path: "/network",
        Component: MyNetwork
      },
      {
        path: "/network/index",
        Component: NetworkIndex
      },
      {
        path: "/login",
        Component: LoginRegister
      },
      {
        path: "/settings",
        Component: Settings
      }
    ]
  }
]);

export function App() {
  React.useLayoutEffect(() => {
    let root = document.documentElement;
    const vh = Math.max(root.clientHeight || 0, window.innerHeight || 0);
    root.style.setProperty("--app-root-winh", `${vh}px`);
  }, []);

  return (
    <React.Fragment>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </React.Fragment>
  );
}
