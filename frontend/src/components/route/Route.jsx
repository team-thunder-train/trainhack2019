import React from "react";
import "./Route.css";
import { client } from "../../routes_backend/client.js";
import { Alternatives } from "../Alternatives/Alternatives";

const noSeconds = {
  hour: '2-digit',
  minute: '2-digit',
};

function Stop({ stop, destination, active, onClick, children }) {
  return (
    <div
      onClick={onClick}
      className={`Stop ${active ? "active" : ""}`}
      key="id"
    >
      <div className="StopName">
        <div>{stop.name}</div>
        <div className="Time">{new Date(stop.departureTime).toLocaleTimeString([], noSeconds)}</div>
      </div>
      <div className="VerticalAlignMiddle">
        <div className="Blob" />
      </div>
      {destination && (
        <AlternativeRouteInfo
          stop={stop}
          destination={destination}
          active={active}
        />
      )}
      {children}
    </div>
  );
}

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stops: [...props.stops], active: null };

    this.onClick = this.onClick.bind(this);
  }

  onClick(number) {
    if (number === this.state.active) {
      this.setState({ active: null });
    } else {
      this.setState({ active: number });
    }
  }

  render() {
    const stops = [...this.state.stops];
    const destination = stops.pop();
    return (
      <div className="Route">
        {stops.map((stop, i) => (
          <Stop
            key={stop.name}
            stop={stop}
            destination={destination}
            onClick={e => this.onClick(i)}
            active={this.state.active === i}
          >
            {i ? <div className="VerticalBarTop" /> : null}
            <div className="VerticalBarBottom" />
          </Stop>
        ))}
        <Stop stop={destination}>
          <div className="VerticalBarTop" />
        </Stop>
      </div>
    );
  }
}

class AlternativeRouteInfo extends React.Component {
  state = {
    alternatives: null,
    error: null
  };

  componentDidMount() {
    const { stop, destination } = this.props;
    client
      .getAlternativeRoutes(
        stop.coords,
        destination.coords,
        stop.arrivalTime || stop.departureTime
      )
      .then(
        alternatives => this.setState({ alternatives }),
        error => this.setState({ error })
      );
  }

  render() {
    if (this.state.error) {
      return <p className="Minutes">{this.state.error}</p>;
    }

    if (!this.state.alternatives) {
      return <p className="Minutes">Loading...</p>;
    }

    const actualAlternatives = this.state.alternatives.slice(1, 4);

    const { arrivalTime, departureTime } = this.props.destination;
    const orginialArrivalTime = new Date(
      arrivalTime || departureTime
    ).getTime();
    const endTimes = actualAlternatives
      .map(({ arrivalTime }) => arrivalTime - orginialArrivalTime)
      .map(t => Math.round(t / 60000));

    const best = Math.min(Infinity, ...endTimes);
    const worst = Math.max(0, ...endTimes);

    if (!actualAlternatives.length) {
      return null;
    }

    return (
      <div className="Minutes">
        {this.props.active && (
          <Alternatives
            alternatives={actualAlternatives}
            orginialArrivalTime={orginialArrivalTime}
            type={this.props.stop.type}
          />
        )}
        <p>
          {best} ~ {worst} mins delay.
        </p>
      </div>
    );
  }
}

export const msToMin = t => {
  return Math.round(t / 60000);
};
