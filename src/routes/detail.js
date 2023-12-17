const {
    extractDetail
} = require("../extract");

module.exports = async ({
    context,
    pushData,
    store
}) => {
    const {
        request
    } = context
    const details = await extractDetail({
        context
    });
    console.log(details);
    await pushData(details);

    // if (!(await store.getValue(request.userData.id))) {
    //     await store.setValue((request.userData.id), true);
    //     const details = await extractDetail({context});
    //     await pushData(details);
    // console.log(`Pushing new data to DB for ${request.url}`);
    // } else {
    //     console.log(`Data Already Present for ${request.url}`);
    // }
};
