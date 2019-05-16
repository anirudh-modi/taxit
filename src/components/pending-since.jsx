function getDiff(time1, time2) {
    var diffInMs = time1 - time2;
    var secs = Math.floor(diffInMs / 1000);
    if (secs > 60) {
        var min = Math.floor(secs / 60);
        secs = secs % 60;
    }
    return min ? `${min} mintues ${secs} seconds ago` : `${secs} seconds ago`;

}

export function PendingSince(trip) {
    return trip.status !== 'COMPLETED'
        ? getDiff(Date.now(), new Date(trip.created_at).getTime())
        : null
}


export function RequestedOn(trip) {
    return getDiff(Date.now(), new Date(trip.created_at).getTime())
}

export function PickedOn(trip) {
    return getDiff(Date.now(), new Date(trip.picked_at).getTime())
}

export function CompletedOn(trip) {
    return getDiff(Date.now(), new Date(trip.completed_at).getTime())
}