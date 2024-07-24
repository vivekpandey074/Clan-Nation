const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  console.log(io);
  io.to(users).emit(event, data);
};

const deleteFilesFromCloudinary = async (public_ids) => {};

module.exports = { emitEvent, deleteFilesFromCloudinary };
