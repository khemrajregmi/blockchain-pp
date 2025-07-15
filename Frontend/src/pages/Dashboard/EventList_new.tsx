import cx from "classnames";

import { Link } from "react-router-dom";

import EventOneIcon from "./icons/event-one.svg";
import EventTwoIcon from "./icons/event-two.svg";
import EventThreeIcon from "./icons/event-three.svg";
import { useEffect, useState } from "react";

interface EventProps {
  iconUrl: string;
  time: { clock: string; period: "am" | "pm" };
  accentColorClass: string;
}

function Event(props: EventProps & { name: string; location: string }) {
  return (
    <div className='mb-3 flex items-center rounded-card bg-grey-low px-5 py-3.5 desktop:min-w-[24rem]'>
      <img className='mr-4 h-8 w-8' src={props.iconUrl} />

      <div className='mr-1 flex-grow'>
        <h3 className='font-semibold'>{props.name}</h3>
        <p className='max-w-[235px] overflow-hidden text-ellipsis text-fine text-[#D9D9D9]'>
          {props.location}
        </p>
      </div>

      <p
        className={cx(
          "row-span-2 rounded-card p-2 text-center text-xl font-semibold leading-tight text-black",
          props.accentColorClass
        )}
      >
        {props.time.clock}
        <br />
        <span className='uppercase'>{props.time.period}</span>
      </p>
    </div>
  );
}

export function EventList({ events, date }: any) {
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  function convert24to12(timeString: string): { hour: string; minute: string; period: "am" | "pm" } {
    if (!timeString) return { hour: "00", minute: "00", period: "am" };
    
    const [hourStr, minuteStr] = timeString.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr) || 0;
    
    let period: "am" | "pm" = "am";
    
    if (hour >= 12) {
      period = "pm";
      if (hour > 12) {
        hour = hour - 12;
      }
    }
    
    if (hour === 0) {
      hour = 12;
    }
    
    return {
      hour: hour.toString().padStart(2, '0'),
      minute: minute.toString().padStart(2, '0'),
      period
    };
  }

  useEffect(() => {
    if (!events || !date) return;
    
    let strDate = "";
    if (date.getDate() < 10) {
      strDate += `0${date.getDate()}/`
    } else {
      strDate += `${date.getDate()}/`
    }
    if (date.getMonth() < 9) {
      strDate += `0${date.getMonth() + 1}/`
    } else {
      strDate += `${date.getMonth() + 1}/`
    }
    strDate += `${date.getFullYear()}`
    
    const newSelectedEvents = events.filter((event: any) => event.date === strDate);
    setSelectedEvents(newSelectedEvents);
  }, [date, events]);

  return (
    <section className='mt-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Events of the day</h3>
        <Link to='/events' className='text-blue-high'>
          View all events
        </Link>
      </div>

      {selectedEvents.length === 0 ? (
        <div className='rounded-card bg-grey-low px-5 py-8 text-center'>
          <p className='text-grey-type'>No events scheduled for this day</p>
        </div>
      ) : (
        selectedEvents.map((event: any, index: number) => {
          const timeData = convert24to12(event.startTime);
          const icons = [EventOneIcon, EventTwoIcon, EventThreeIcon];
          const iconUrl = icons[index % icons.length];
          
          return (
            <Event
              key={index}
              accentColorClass='bg-yellow'
              iconUrl={iconUrl}
              time={{ 
                clock: `${timeData.hour}:${timeData.minute}`, 
                period: timeData.period 
              }}
              name={event.name || 'Untitled Event'}
              location={event.location || 'Location TBA'}
            />
          );
        })
      )}
    </section>
  );
}
