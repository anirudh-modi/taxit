import React from 'react'

function getTableHeader(descriptor) {
    return (
        <thead>
            <tr>
                {descriptor.map(column => <td>{column.header}</td>)}
            </tr>
        </thead>
    )
}

function getTableBody(descriptor, data) {
    return (
        <tbody>
            {
                data.map(row => {
                    return (
                        <tr>
                            {descriptor.map(column => <td>{column.component ? column.component(row) : row[column.key]}</td>)}
                        </tr>
                    );
                })
            }
        </tbody>
    )
}
export default class Table extends React.Component {
    render() {
        const { descriptor, data } = this.props;

        return (
            <table>
                {getTableHeader(descriptor)}
                {getTableBody(descriptor, data)}
            </table>
        )

    }
}