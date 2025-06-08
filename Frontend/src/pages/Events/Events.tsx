import React, { useEffect, useState } from "react";
import cx from "classnames";

import { PageView } from "layout/PageView";

import { Tab } from "@headlessui/react";
import { EventCard } from "./EventCard";
import { EventCreator } from "./EventCreator";
import CalenderComponent from "components/CalendarComponent";

import "./styles.css";

import PlusIcon from "assets/plus.svg";
import SelectDownArrow from "assets/select-down-arrow.svg";
import SearchIcon from "assets/search.svg";
import FilterIcon from "assets/filter.svg";
import IconDate from "assets/input-date.svg";

import EventOneIcon from "../Dashboard/icons/event-one.svg";
import EventTwoIcon from "../Dashboard/icons/event-two.svg";
import EventThreeIcon from "../Dashboard/icons/event-three.svg";
import { ListBox } from "components/ListBox";
import { API_BASE_URL } from "utils";

// Event type for event objects
interface EventObj {
  id: string;
  name: string;
  sport?: string;
  description?: string;
  location?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  teamName?: string;
  opponentName?: string;
  repeat?: boolean;
  cost?: string | number;
  [key: string]: any;
}

function FilterSelect(props: React.HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type='button'
      className={cx(
        "relative flex rounded-card border border-grey-high px-3",
        props.className
      )}
    >
      <select className='flex-1 cursor-pointer appearance-none bg-transparent py-3 text-grey-subtle '>
        {props.children}
      </select>
      <img
        className='pointer-events-none absolute right-0 mx-3 w-6 self-center'
        src={SelectDownArrow}
      />
    </button>
  );
}

interface EventFiltersProps {
  filtersOpen: boolean;
  selectedSport: string | null;
  setSelectedSport: (v: string | null) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  setSearchKey: (v: string) => void;
  selectedPayment: string | null;
  setSelectedPayment: (v: string | null) => void;
  selectedLocation: string;
  setSelectedLocation: (v: string) => void;
}

function EventFilters(props: EventFiltersProps) {
  const { filtersOpen, selectedSport, setSelectedSport, selectedDate, setSelectedDate, setSearchKey, selectedPayment, setSelectedPayment, selectedLocation, setSelectedLocation } = props;
  const [sports, setSports] = useState<{ name: string }[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const clearFilter = () => {
    setSelectedSport(null);
    setSelectedDate("");
    setSearchKey("");
    setSelectedLocation("");
    setSelectedPayment(null);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/getSports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setSports(data.data);
      });
  }, []);

  return (
    <div
      className={cx(
        "md:order-0 order-1 mt-7 flex-wrap items-center gap-x-4 gap-y-5 desktop:!flex",
        filtersOpen ? "flex" : "hidden"
      )}
    >
      <ListBox
        placeholder='Sports'
        className='minimal min-w-[theme("spacing.64")]'
        selected={selectedSport}
        onChangeValue={setSelectedSport}
        data={sports.map((sport) => sport.name)}
      />
      <ListBox
        placeholder='Payment'
        className='minimal min-w-[theme("spacing.56")]'
        selected={selectedPayment}
        onChangeValue={setSelectedPayment}
        data={["Free", "Not Free"]}
      />
      <div className='relative flex min-w-[theme("spacing.48")] rounded-card border border-grey-high px-3 py-2.5'>
        <input
          onFocus={() => setShowCalendar(true)}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className='flex-1 appearance-none bg-transparent text-white placeholder:text-grey-subtle'
          placeholder='Select date'
          size={1}
        />
        <img
          className='pointer-events-none absolute right-0 mx-3 w-6 self-center'
          src={IconDate}
        />
        {showCalendar && (
          <div className="absolute calendar z-10">
            <CalenderComponent setSelectedDate={setSelectedDate} outSideClickFunc={() => setShowCalendar(false)} />
          </div>
        )}
      </div>
      <div className='relative flex min-w-[theme("spacing.96")] rounded-card border border-grey-high px-3 py-2.5'>
        <input
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className='flex-1 appearance-none bg-transparent text-white placeholder:text-grey-subtle'
          placeholder='Location'
          size={1}
        />
      </div>
      <s className='flex-1' />
      <p
        onClick={clearFilter}
        role='button'
        className='self-center text-dim-white underline transition-colors hover:text-blue-high'
      >
        Clear Filters
      </p>
    </div>
  );
}

function EventGrid({ events }: { events: EventObj[] }) {
  return (
    <section className='mb-12 mt-7 grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2 desktop:grid-cols-4'>
      {events.map((event, index) => (
        <EventCard
          key={event.id || index}
          iconUrl={EventOneIcon}
          accentColorClass='[--ev-card-accent-color:theme("colors.yellow")]'
          event={event}
        />
      ))}
    </section>
  );
}

export function Events() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setfiltersOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState<any>("");
  const [myEvents, setMyEvents] = useState<EventObj[]>([]);
  const [allEvents, setAllEvents] = useState<EventObj[]>([]);
  const [showEvents, setShowEvents] = useState<EventObj[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/getUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.userType === "Admin") {
          setAdmin(true);
        }
        setUserData(data.data);
        if (data.data === "token expired") {
          if (window.location.pathname !== "/login") {
            window.localStorage.clear();
            window.location.href = "../../login";
          }
        }
      });
  }, []);

  useEffect(() => {
    if (!userData) return;

    fetch(`${API_BASE_URL}/getEvents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        status: "Pending Invite"
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAllEvents(data.data);
        setLoaded(true);
      });

    fetch(`${API_BASE_URL}/getEvents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        status: "Accepted"
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMyEvents(data.data);
        setShowEvents(data.data);
        setLoaded(true);
      });
  }, [userData]);

  useEffect(() => {
    let newEvents = [...myEvents];
    if (selectedSport !== null) newEvents = newEvents.filter(event => event.sport === selectedSport);
    if (selectedDate !== "") newEvents = newEvents.filter(event => event.date === selectedDate);
    if (selectedPayment === "Free") newEvents = newEvents.filter(event => parseInt(event.cost) === 0);
    if (selectedPayment === "Not Free") newEvents = newEvents.filter(event => parseInt(event.cost) > 0);
    if (searchKey !== "") newEvents = newEvents.filter(event => {
      if (event.name && event.name.toString().toLowerCase().indexOf(searchKey.toString().toLowerCase()) > -1) return true;
      return false;
    });
    if (selectedLocation !== "") newEvents = newEvents.filter(event => {
      if (event.location && event.location.toString().toLowerCase().indexOf(selectedLocation.toString().toLowerCase()) > -1) return true;
      return false;
    });
    setShowEvents(newEvents);
  }, [myEvents, selectedSport, selectedDate, searchKey, selectedPayment, selectedLocation]);

  return (
    <PageView
      title='Events'
      actions={
        <>
          <button
            onClick={() => setSearchOpen(x => !x)}
            className='box-content rounded-md p-2 transition-colors hover:bg-blue-high/10'
          >
            <img src={SearchIcon} />
          </button>
          <button
            onClick={() => setfiltersOpen(x => !x)}
            className='box-content rounded-md p-2 transition-colors hover:bg-blue-high/10'>
            <img src={FilterIcon} />
          </button>
          <EventCreator>
            <button className='ml-4 rounded-half bg-blue-high p-2 transition-colors hover:bg-blue-high/80'>
              <img src={PlusIcon} />
            </button>
          </EventCreator>
        </>
      }
    >
      {searchOpen && (
        <div className='mb-6 flex overflow-hidden rounded-card border border-grey-high desktop:hidden'>
          <img className='mx-4 my-3 w-6' src={SearchIcon} />
          <input
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className='flex-1 bg-transparent text-white'
            placeholder='Search for event'
            size={1}
          />
        </div>
      )}
      <Tab.Group manual defaultIndex={0}>
        <Tab.List className='flex gap-x-2 desktop:items-center'>
          <Tab className='app-tab flex-1 desktop:flex-initial'>
            My Events
          </Tab>
          <Tab className='app-tab flex-1 desktop:flex-initial'>
            Explore Events
          </Tab>
          <div className='hidden flex-1 items-center justify-end gap-x-5 desktop:flex'>
            <div className='flex max-w-[24rem] flex-1 overflow-hidden rounded-card border border-grey-high'>
              <img className='mx-4 my-3 w-6' src={SearchIcon} />
              <input
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className='flex-1 bg-transparent text-white'
                placeholder='Search for event'
                size={1}
              />
            </div>
            <EventCreator>
              <button className='flex items-center gap-x-2 rounded-half bg-blue-high px-14 py-3 font-medium text-dim-black hover:bg-blue-high/80'>
                <img className='w-6' src={PlusIcon} />
                Create Event
              </button>
            </EventCreator>
          </div>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <EventFilters
              filtersOpen={filtersOpen}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSearchKey={setSearchKey}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
            <EventGrid events={showEvents} />
            <p>&nbsp;</p>
          </Tab.Panel>
          <Tab.Panel>
            <EventGrid events={allEvents} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </PageView>
  );
}
