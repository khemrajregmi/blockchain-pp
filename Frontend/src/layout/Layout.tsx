import React, { Component, useEffect, useState } from "react";
import "./styles.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import { Menu, Transition } from "@headlessui/react";
import { commonTransitionProps } from "components/PanelTransition";
import { NotificationsTarget } from "./Notifications";
import { Sidebar } from "./Sidebar";
import profileDownArrow from "assets/profile-down-arrow.svg";
import profileImg from "assets/profile.jpg";
import Hamburger from "assets/hamburger.svg";
import { useMenu, API_BASE_URL } from "utils";
import * as icons from "./icons";
import WalletModal from "components/WalletModal";

function UserMenuContent() {
  const navigate = useNavigate();
  return (
    <>
      <Menu.Item
        as='li'
        className='flex cursor-pointer items-center gap-x-3.5 rounded-half px-4 py-3 hover:bg-blue-high/10'
        onClick={() => navigate("/settings")}
      >
        <icons.Settings />
        Settings
      </Menu.Item>
      <Menu.Item
        as='li'
        className='flex cursor-pointer items-center gap-x-3.5 rounded-half px-4 py-3 hover:bg-blue-high/10'
      >
        <icons.Help />
        Help
      </Menu.Item>
      <Menu.Item
        as='li'
        className='flex cursor-pointer items-center gap-x-3.5 rounded-half px-4 py-3 hover:bg-blue-high/10'
        onClick={() => {
          window.localStorage.clear();
          window.location.href = "../../login";
        }}
      >
        <icons.Logout />
        Log Out
      </Menu.Item>
    </>
  );
}

function UserMenuTarget({ children }: React.PropsWithChildren) {
  const m = useMenu();

  return (
    <Menu>
      <Menu.Button ref={e => m.setReferenceElem(e as any)}>
        {children}
      </Menu.Button>

      <Transition {...commonTransitionProps} className='z-[999999]'>
        <Menu.Items
          ref={e => m.setFloatingElement(e as any)}
          style={m.styles.popper}
          {...m.attributes.popper}
          as='ul'
          className='z-[9999999] min-w-[15rem] overflow-hidden rounded-half bg-grey-low outline-none'
        >
          <UserMenuContent />
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function UserProfile({userData} : any) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  return (
      <>
            <UserMenuTarget>
              <p className='ml-8 box-content flex cursor-pointer select-none items-center rounded-md p-2 transition-colors hover:bg-blue-high/10'>
              {userData.fname} {userData.lname}
              <img className='ml-1' src={profileDownArrow} />
              </p>
            </UserMenuTarget>

            <UserMenuTarget>
              <img
              className='ml-4 box-content h-7 w-7 cursor-pointer rounded-full p-2 transition-colors hover:bg-blue-high/10'
              src={userData.profilePic}
              />
            </UserMenuTarget>

            <button
              className="ml-4 rounded-md bg-blue-high px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => setWalletModalOpen(true)}
            >
              Connect Wallet
            </button>
            <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      </>
  );
}

export function Layout() {
  let [open, setOpen] = React.useState(false);

  const [loaded, setLoaded] = useState(false);    

  const [userData, setUserData] = useState("");
  const [events, setEvents] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Skip authentication check if we're on the login page
        if (window.location.pathname === '/login') {
          setLoaded(true);
          return;
        }

        // Check for token and fetch user data
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          window.location.href = "/login";
          return;
        }

        const userResponse = await fetch(`${API_BASE_URL}/getUserData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const userData = await userResponse.json();
        if (userData.status === "ok") {
          setUserData(userData.data);
          
          // Fetch events and friend requests in parallel
          const [eventsResponse, friendRequestsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/getEvents`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, status: "Pending Invite" }),
            }),
            fetch(`${API_BASE_URL}/getFriendRequests`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            })
          ]);

          const eventsData = await eventsResponse.json();
          const friendRequestsData = await friendRequestsResponse.json();

          if (eventsData.status === "ok") {
            setEvents(eventsData.data);
          }

          if (friendRequestsData.status === "ok") {
            setFriendRequests(friendRequestsData.data);
          }

          // Check if user is admin
          if (userData.data.email === "admin@admin.com") {
            setAdmin(true);
          }
          
        } else {
          console.log("Invalid token, redirecting to login");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        // For development, allow the app to load even if API calls fail
        console.log("API calls failed, loading app anyway for development");
      } finally {
        setLoaded(true);
      }
    };

    initializeApp();
  }, []);

  // Remove redundant useEffect hooks since we're fetching all data in the main useEffect above

  return (
    <>
      {!loaded && (
          <BarLoader color="#5ce5e2" 
          cssOverride={{
            display: "block",
            margin: "10vh auto",
            borderColor: "red",
          }}
          width={200}
          height={10}
        />
      )}
      {loaded && (
        <>
        {/* Only render sidebar and navigation if not on login page */}
        {window.location.pathname !== '/login' && (
          <>
            <LayoutSidebar open={open} setOpen={setOpen} userData={userData} />
            <ContentPane setOpen={setOpen} userData={userData} events={events} friendRequests={friendRequests} />
          </>
        )}
        {/* Render login page directly without sidebar */}
        {window.location.pathname === '/login' && (
          <div className="w-full h-full">
            <Outlet context={{ setTitle: () => {}, setActions: () => {} }} />
          </div>
        )}
        </>
      )}

    </>
  );
}

function ContentPane({ setOpen, userData, events, friendRequests }: any) {
  const [title, setTitle] = React.useState<React.ReactNode>(null);
  const [actions, setActions] = React.useState<React.ReactNode>(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Set type in events array to "eventInvite"
    events.forEach((event: any) => {
      event.type = "eventInvite";
    });
  
    // Set type in friend requests array to "friendRequest"
    friendRequests.forEach((friendRequest: any) => {
      friendRequest.type = "friendRequest";
    });
  
    // Combine events and friend requests into notifications array
    let notificationsTemp = events.concat(friendRequests);
    setNotifications(notificationsTemp)
  }, [events, friendRequests])

  return (
    <section className='flex max-h-full min-h-full min-w-0 max-w-full flex-1 flex-col overflow-y-auto overflow-x-hidden bg-sheet desktop:overflow-y-hidden'>
      <header className='flex flex-wrap items-center px-5 py-3'>
        <div className='flex items-center desktop:hidden'>
          <button
            className='mr-2 box-content rounded-md p-2 transition-colors hover:bg-blue-high/10'
            onClick={() => setOpen(true)}
          >
            <img src={Hamburger} />
          </button>
          <h1 className='text-2xl font-extrabold text-blue-high'>LOGO</h1>
        </div>

        <div className='order-1 mt-0 flex w-full items-center justify-between desktop:order-none desktop:mt-0 desktop:w-auto'>
          <h1 className='py-6 text-2xl font-bold desktop:py-0'>{title}</h1>
          <div className='flex items-center gap-x-0.5 desktop:hidden'>
            {actions}
          </div>
        </div>

        <div className='flex flex-1 items-center justify-end'>
          <NotificationsTarget notifications={notifications} setNotifications={setNotifications} />
          <div className='hidden items-center desktop:flex'>
            <UserProfile userData={userData} />
          </div>
        </div>
      </header>

      <div className='min-h-0 min-w-0 flex-1 px-5 pt-0 desktop:overflow-y-auto desktop:pt-8 [&>:last-child]:mb-8'>
        <Outlet context={{ setTitle, setActions }} />
      </div>
    </section>
  );
}

function LayoutSidebar({ open, setOpen, userData }: any) {
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {open && (
        <div
          className='fixed z-[3002] h-screen w-screen bg-black/30 desktop:hidden'
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
      <aside id='sidebar' className='self-stretch' data-app-open={open}>
        <Sidebar userData={userData} />
      </aside>
    </>
  );
}
