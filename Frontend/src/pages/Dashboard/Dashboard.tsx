import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageView } from "layout/PageView";
import { API_BASE_URL } from "utils";

import { Calender } from "./Calender";
import { EventList } from "./EventList";
import { BalanceTrigger } from "./BalanceDialog";

import FriendsIcon from "./icons/friends.svg";
import TeamIcon from "./icons/team.svg";
import TrainingIcon from "./icons/training.svg";
import Events from "./icons/events.svg";

import LinkPlaymateIcon from "./icons/link-playmate.svg";
import LinkEventIcon from "./icons/link-event.svg";

import "./styles.css";

interface DashboardStats {
  friendsCount: number;
  teamsCount: number;
  eventsCount: number;
  upcomingEvents: number;
  friendRequestsCount: number;
}

interface RecentActivity {
  id: string;
  type: 'friend_request' | 'event_created' | 'team_joined' | 'event_joined';
  message: string;
  timestamp: Date;
  icon: string;
}

function RecentActivities({ activities }: { activities: RecentActivity[] }) {
  if (activities.length === 0) {
    return (
      <div className='rounded-card bg-grey-low p-6 text-center'>
        <p className='text-grey-type'>No recent activities</p>
        <p className='mt-1 text-sm text-grey-subtle'>Your activities will appear here</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {activities.slice(0, 3).map((activity) => (
        <div key={activity.id} className='flex items-center gap-3 rounded-card bg-grey-low p-4'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-high/20'>
            <span className='text-sm'>{activity.icon}</span>
          </div>
          <div className='flex-1'>
            <p className='text-sm font-medium text-white'>{activity.message}</p>
            <p className='text-xs text-grey-subtle'>
              {activity.timestamp.toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MainContent({ userData, stats, friendRequests }: { userData: any; stats: DashboardStats; friendRequests: any[] }) {
  const navigate = useNavigate();

  return (
    <section className='grid grid-cols-4 grid-rows-[repeat(2,auto)] gap-5'>
      <div 
        role='button' 
        className='dashboard-majar-card bg-blue-high cursor-pointer'
        onClick={() => navigate('/my-playmate')}
      >
        <h1>My Playmate</h1>
        <p>
          You have {stats.friendsCount} friends and are part of {stats.teamsCount} teams.
          {stats.friendRequestsCount > 0 && (
            <span className='text-blue-high'> ({stats.friendRequestsCount} pending requests)</span>
          )}
        </p>
        <p className='text-sm text-grey-subtle'>
          Connect with sports enthusiasts and build your network!
        </p>
        <s className='flex-grow' />
        <img className='self-end' src={LinkPlaymateIcon} />
      </div>
      <div 
        role='button' 
        className='dashboard-majar-card bg-yellow cursor-pointer'
        onClick={() => navigate('/create-event')}
      >
        <h1>Create Event</h1>
        <p>
          You have {stats.eventsCount} total events with {stats.upcomingEvents} upcoming. 
          Create new events and invite your friends to play!
        </p>
        <s className='flex-grow' />
        <img className='self-end' src={LinkEventIcon} />
      </div>

      <button 
        className='dashboard-actions group'
        onClick={() => navigate('/network')}
      >
        <div className='group-hover:bg-blue-high/20'>
          <img src={FriendsIcon} />
        </div>
        <span>Add friends ({stats.friendsCount})</span>
        {stats.friendRequestsCount > 0 && (
          <span className='ml-2 rounded-full bg-blue-high px-2 py-1 text-xs font-medium text-black'>
            {stats.friendRequestsCount}
          </span>
        )}
      </button>
      <button 
        className='dashboard-actions group'
        onClick={() => navigate('/teams')}
      >
        <div className='group-hover:bg-blue-high/20'>
          <img src={TeamIcon} />
        </div>
        <span>Join a team ({stats.teamsCount})</span>
      </button>
      <BalanceTrigger />
      <button 
        className='dashboard-actions group'
        onClick={() => navigate('/events')}
      >
        <div className='group-hover:bg-blue-high/20'>
          <img src={TrainingIcon} />
        </div>
        <span>View events ({stats.eventsCount})</span>
      </button>

      <div className='col-span-4'>
        <h2 className='text-lg font-semibold'>Recent Activities</h2>
        <RecentActivities activities={friendRequests} />
      </div>
    </section>
  );
}

function SideView({ events, userData, friendRequests }: { events: any[]; userData: any; friendRequests: any[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate recent activities based on friend requests and events
  const recentActivities: RecentActivity[] = [
    ...friendRequests.map((request: any) => ({
      id: `friend-${request._id}`,
      type: 'friend_request' as const,
      message: `${request.fname} ${request.lname} sent you a friend request`,
      timestamp: new Date(request.createdAt || Date.now()),
      icon: '👤'
    })),
    ...events.slice(0, 2).map((event: any) => ({
      id: `event-${event.id}`,
      type: 'event_created' as const,
      message: `Event "${event.name}" is coming up`,
      timestamp: new Date(event.date),
      icon: '📅'
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return (
    <section className='space-y-8'>
      <div className=''>
        <div className='mb-5 flex gap-x-4'>
          <div className='flex items-start'>
            <div className='box-content rounded-full bg-grey-low p-4'>
              <img className='w-5' src={Events} />
            </div>
          </div>

          <div>
            <h3 className='text-xl font-medium'>Events</h3>
            <p className='text-fine text-grey-type'>
              {events.length > 0 ? `${events.length} events scheduled` : 'No events scheduled'}
            </p>
          </div>
        </div>

        <Calender setSelectedDate={setSelectedDate} />
        <EventList events={events} date={selectedDate} />
      </div>
      
      <div className=''>
        <div className='mb-5 flex gap-x-4'>
          <div className='flex items-start'>
            <div className='box-content rounded-full bg-grey-low p-4'>
              <span className='text-xl'>🔔</span>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-medium'>Recent Activity</h3>
            <p className='text-fine text-grey-type'>
              {recentActivities.length > 0 ? `${recentActivities.length} recent activities` : 'No recent activities'}
            </p>
          </div>
        </div>

        <RecentActivities activities={recentActivities} />
      </div>
    </section>
  );
}

export function Dashboard() {
  const [loaded, setLoaded] = useState(false);    
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    friendsCount: 0,
    teamsCount: 0,
    eventsCount: 0,
    upcomingEvents: 0,
    friendRequestsCount: 0
  });
  const [admin, setAdmin] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getUserData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token: window.localStorage.getItem("token"),
          }),
        });

        const data = await response.json();
        
        if (data.data === "token expired") {
          if (window.location.pathname !== "/login") {
            window.localStorage.clear();
            window.location.href = "/login";
          }
          return;
        }

        if (data.status === "ok") {
          setUserData(data.data);
          if (data.data.userType === "Admin") {
            setAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch dashboard data when user data is available
  useEffect(() => {
    if (!userData) return;

    const fetchDashboardData = async () => {
      try {
        const token = window.localStorage.getItem("token");
        console.log("Fetching dashboard data with token:", token);
        
        // Fetch all data in parallel
        const [eventsResponse, friendsResponse, teamsResponse, friendRequestsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/getEvents`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              token,
              status: "Accepted"
            }),
          }),
          fetch(`${API_BASE_URL}/getFriends`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ token }),
          }),
          fetch(`${API_BASE_URL}/getTeams`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ token }),
          }),
          fetch(`${API_BASE_URL}/getFriendRequests`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ token }),
          })
        ]);

        const [eventsData, friendsData, teamsData, friendRequestsData] = await Promise.all([
          eventsResponse.json(),
          friendsResponse.json(),
          teamsResponse.json(),
          friendRequestsResponse.json()
        ]);

        console.log("Dashboard data loaded:");
        console.log("Events:", eventsData);
        console.log("Friends:", friendsData);
        console.log("Teams:", teamsData);
        console.log("Friend Requests:", friendRequestsData);

        // Update state with fetched data
        if (eventsData.status === "ok") {
          setEvents(eventsData.data || []);
        }
        if (friendsData.status === "ok") {
          setFriends(friendsData.data || []);
        }
        if (teamsData.status === "ok") {
          setTeams(teamsData.data || []);
        }
        if (friendRequestsData.status === "ok") {
          setFriendRequests(friendRequestsData.data || []);
        }

        // Calculate stats
        const today = new Date();
        const upcomingEvents = (eventsData.data || []).filter((event: any) => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        });

        const newStats = {
          friendsCount: friendsData.data?.length || 0,
          teamsCount: teamsData.data?.length || 0,
          eventsCount: eventsData.data?.length || 0,
          upcomingEvents: upcomingEvents.length || 0,
          friendRequestsCount: friendRequestsData.data?.length || 0
        };

        console.log("Calculated stats:", newStats);
        setStats(newStats);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoaded(true);
      }
    };

    fetchDashboardData();
  }, [userData]);

  const displayName = userData ? `${userData.fname} ${userData.lname}` : "Loading...";

  return (
    <PageView title={`Welcome ${userData?.fname || 'User'}`}>
      {loaded ? (
        <div className='flex flex-col gap-x-5 gap-y-16 desktop:flex-row desktop:items-start'>
          <MainContent userData={userData} stats={stats} friendRequests={friendRequests} />
          <SideView events={events} userData={userData} friendRequests={friendRequests} />
        </div>
      ) : (
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-high border-t-transparent'></div>
            <p className='text-grey-type'>Loading dashboard...</p>
          </div>
        </div>
      )}
    </PageView>
  );
}
