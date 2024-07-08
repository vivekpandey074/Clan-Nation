const emitEvent = (req, event, users, data) => {
  console.log("Event", event);
};

const deleteFilesFromCloudinary = async (public_ids) => {};

module.exports = { emitEvent, deleteFilesFromCloudinary };
