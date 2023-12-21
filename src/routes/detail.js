const {
    extractDetail,
    extractAgentDetails
} = require("../extract");

module.exports = async ({
    context,
    pushData,
    store,
    Actor
}) => {
    const {
        page,
        request
    } = context
    const agentStore = await Actor.openKeyValueStore();
    const details = await extractDetail({
        context
    });
    console.log(details);

    function mergeObjects(obj1, obj2) {
        Object.keys(obj2).forEach((key) => {
            if (obj1[key] === '' && obj2[key] !== '') {
                obj1[key] = obj2[key];
            }
        });
        Object.keys(obj2).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
                obj1[key] = obj2[key];
            }
        });
        return obj1;
    }

    let agentDetails
    for (const obj of details.extractedDetails.agentsArray) {
        if (obj.agentProfileUrl) {
            if (!(await agentStore.getValue(obj.agentSlug))) {
                console.log(`Getting Data for agent ${obj.agentSlug}`);
                agentDetails = await extractAgentDetails(context, obj.agentProfileUrl, obj.agentSlug)
                await agentStore.setValue(obj.agentSlug, agentDetails);
            } else {
                agentDetails = await agentStore.getValue(obj.agentSlug)
                console.log(`Data Already Present for agent ${obj.agentSlug}`);
            }
        }
        obj = mergeObjects(obj, agentDetails);
    }

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
