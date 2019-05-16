import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

let app = document.getElementById('app');

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            trips: []
        }
    }
    getDiff(time1, time2) {
        var diffInMs = time1 - time2;
        var secs = Math.floor(diffInMs / 1000);
        if (secs > 60) {
            var min = Math.floor(secs / 60);
            secs = secs % 60;
        }
        return min ? `${min} mintues ${secs} seconds ago` : `${secs} seconds ago`;

    }
    componentWillMount() {
        axios
            .get('/trips/ALL')
            .then(function (response) {
                if (response.status === 200) {
                    this.setState({
                        trips: response.data
                    });
                }
            }.bind(this));
    }
    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <td>Trip Id</td>
                        <td>Customer Requested</td>
                        <td>Status</td>
                        <td>Pending Since</td>
                        <td>Driver Handling</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.trips.map(trip => <tr className={trip.status.toLowerCase()} key={trip.id}>
                            <td>{trip.id}</td>
                            <td>{trip.customer_id}</td>
                            <td>{trip.status}</td>
                            <td>
                                {
                                    trip.status === 'WAITING'
                                        ? this.getDiff(Date.now(), new Date(trip.created_at).getTime())
                                        : trip.status === 'ONGOING'
                                            ? this.getDiff(Date.now(), new Date(trip.picked_at).getTime())
                                            : null
                                }
                            </td>
                            <td>{trip.driver_id}</td>
                        </tr>)
                    }
                </tbody>
            </table>
        );
    }
}
render(<App />, app);