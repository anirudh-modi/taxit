import React from 'react';
import { render } from 'react-dom';
import socketIOClient from "socket.io-client";

import { PendingSince, RequestedOn, PickedOn, CompletedOn } from './components/pending-since';
import Table from './components/table';
import api from './api'
let app = document.getElementById('app');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            driver_id: null,
            trips: [],
            tab: 0
        };
        this.selectTrip = this.selectTrip.bind(this);
        this.getDriverTrips = this.getDriverTrips.bind(this);
    }

    getDriverTrips() {
        if (this.state.driver_id) {
            return api
                .get(`/trips/ALL?driverId=${this.state.driver_id}`)
                .then(function (trips) {
                    this.setState({
                        trips: trips
                    });
                }.bind(this))
        }
    }

    selectTrip(trip) {
        api.post(`/trips/${trip}/start?driverId=${this.state.driver_id}&socketId=${this.socket.id}`)
            .then(this.getDriverTrips)
            .catch(function (err) {
                alert(err.message);
            });
    }

    componentWillMount() {
        var urlParams = new URLSearchParams(window.location.search);

        this.setState({
            driver_id: urlParams.get('id')
        }, function () {
            this.getDriverTrips();
        })
    }

    componentWillUnmount() {
        this.socket.close();
    }

    componentDidMount() {
        this.socket = socketIOClient();
        this.socket.on('Trip status change', this.getDriverTrips);
        this.socket.on('Trip Added', this.getDriverTrips);
    }

    render() {
        var self = this;
        const waitinDescriptor = [
            {
                header: 'Waiting',
                component: function (trip) {
                    return trip.status === 'WAITING'
                        ? (
                            <div>
                                Req Id: {trip.id} Cust Id: {trip.customer_id}
                                <br></br>
                                {PendingSince(trip)}
                                <br></br>
                                <button onClick={(e) => { self.selectTrip(trip.id) }}>Select</button>
                            </div >
                        )
                        : null
                }
            }
        ];

        var ongoingDesc = [{
            header: 'Ongoing',
            component: function (trip) {
                return trip.status === 'ONGOING'
                    ? (
                        <div>
                            Req Id: {trip.id} Cust Id: {trip.customer_id}
                            <br></br>
                            Requested: {RequestedOn(trip)}
                            <br></br>
                            Picked: {PickedOn(trip)}
                        </div>
                    )
                    : null
            }
        }]

        var completedDesc = [{
            header: 'Completed',
            component: function (trip) {
                return trip.status === 'COMPLETED'
                    ? (
                        <div>
                            Req Id: {trip.id} Cust Id: {trip.customer_id}
                            <br></br>
                            Requested: {RequestedOn(trip)}
                            <br></br>
                            Picked: {PickedOn(trip)}
                            <br></br>
                            Completed: {CompletedOn(trip)}
                        </div>
                    )
                    : null
            }
        }]

        return (
            this.state.driver_id
                ? (
                    <div>
                        <h3>
                            Rides of driver {this.state.driver_id}
                        </h3>
                        <div className='board'>
                            <Table
                                descriptor={waitinDescriptor}
                                data={this.state.trips.filter(trip => trip.status == 'WAITING')}
                            />
                        </div>
                        <div className='board'>
                            <Table
                                descriptor={ongoingDesc}
                                data={this.state.trips.filter(trip => trip.status == 'ONGOING')}
                            />
                        </div>
                        <div className='board'>
                            <Table
                                descriptor={completedDesc}
                                data={this.state.trips.filter(trip => trip.status == 'COMPLETED')}
                            />
                        </div>
                    </div>
                )
                : 'Kindly choose a diver'
        )
    }
}
render(<App />, app);