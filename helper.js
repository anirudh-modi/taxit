module.exports = {
    getPlain: (entity) => entity.get({ plain: true }),
    validationError: message => {
        var err = new Error(message);
        err.status = 422;
        return err;
    },
    notFoundError: message => {
        var err = new Error(message);
        err.status = 404;
        return err;
    }
}