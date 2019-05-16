import React from 'react';
import { render } from 'react-dom';
import api from './api';
import Table from './components/table'
import PendingSince from './components/pending-since'
let app = document.getElementById('app');

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            trips: []
        }
    }

    componentWillMount() {
        api
            .get('/trips/ALL')
            .then(function (trips) {
                this.setState({
                    trips: trips
                });
            }.bind(this));
    }

    render() {
        const descriptor = [
            {
                header: 'Trip Id',
                key: 'id'
            },
            {
                header: 'Customer Requested',
                key: 'customer_id'
            },
            {
                header: 'Status',
                key: 'status'
            },
            {
                header: 'Pending Since',
                component: PendingSince
            },
            {
                header: 'Driver Handling',
                key: 'driver_id'
            }
        ]
        return (
            <Table
                descriptor={descriptor}
                data={this.state.trips}
            />
        );
    }
}
render(<App />, app);