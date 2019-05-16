function getDiff(time1, time2) {
    var diffInMs = time1 - time2;
    var secs = Math.floor(diffInMs / 1000);
    if (secs > 60) {
        var min = Math.floor(secs / 60);
        secs = secs % 60;
    }
    return min ? `${min} mintues ${secs} seconds ago` : `${secs} seconds ago`;

}

export default function PendingSince(trip) {
    console.log(trip)
    return trip.status !== 'COMPLETED'
        ? getDiff(Date.now(), new Date(trip.created_at).getTime())
        : null
}