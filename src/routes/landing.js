const {
    extractList
} = require("../extract");

module.exports = async ({
    context,
    enqueue
}) => {
    let {
        request,
        page
    } = context;

    const pages = 9

    for (let i = 0; i < pages; i++) {
        await enqueue({
            url: `${request.url}/page-${page}`,
            userData: {
                forefront: true,
            },
            label: "LIST",
        });
    }

    await extractList({
        context,
        enqueue
    });
};
