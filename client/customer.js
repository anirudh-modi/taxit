import React from 'react';
import { render } from 'react-dom';
import socketIOClient from "socket.io-client";

import api from './api';
import Table from './components/table';
import { PendingSince } from './components/pending-since';

let app = document.getElementById('app');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
        this.state = {
            customer_id: null,
            trips: []
        };
        this.getUsersTrips = this.getUsersTrips.bind(this);
    }

    getUsersTrips() {
        if (this.state.customer_id) {
            return api
                .get(`/trips/ALL?customerId=${this.state.customer_id}`)
                .then(function (trips) {
                    this.setState({
                        trips: trips
                    });
                }.bind(this))
        }
    }

    componentWillMount() {
        var urlParams = new URLSearchParams(window.location.search);

        this.setState({
            customer_id: urlParams.get('customerId')
        }, function () {
            this.getUsersTrips();
        })
    }

    componentDidMount() {
        this.socket = socketIOClient('localhost:4000');
        this.socket.on('Trip status change', this.getUsersTrips);
        this.socket.on('Trip Added', this.getUsersTrips);
    }

    componentWillUnmount() {
        this.socket.close();
    }

    handleSubmit(e) {
        e.preventDefault();

        api
            .post(`/trips?customerId=${this.input.current.value}&socketId=${this.socket.id}`)
            .then(function (response) {
                this.setState({
                    customer_id: this.input.current.value
                }, this.getUsersTrips);
            }.bind(this))
    }

    render() {
        const descriptor = [
            {
                header: 'Trip Id',
                key: 'id'
            },
            {
                header: 'Status',
                key: 'status'
            },
            {
                header: 'Pending since',
                component: PendingSince
            },
            {
                header: 'Driver Handling',
                key: 'driver_id'
            }
        ];

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    Customer Id <input type='text' name='customer_id' ref={this.input} />
                    <button type='submit'>Ride Now</button>
                </form>
                {
                    this.state.customer_id
                        ? (
                            <div>
                                <h3>
                                    Rides of customer {this.state.customer_id}
                                </h3>
                                <Table
                                    descriptor={descriptor}
                                    data={this.state.trips}
                                />
                            </div>
                        )
                        : null
                }
            </div>
        )
    }
}
render(<App />, app);