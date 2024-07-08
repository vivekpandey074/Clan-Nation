const {
  handleCreateClan,
  handleSearchClan,
  handleJoinedClans,
  handleOwnClans,
  handleAddNewMember,
  handleRemoveMember,
  handleLeaveClan,
  handleUpdateClan,
  handleClanDetails,
  handleDeleteClan,
} = require("../controllers/clans");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/createclan", authMiddleware, handleCreateClan);

router.get("/search", authMiddleware, handleSearchClan);

router.get("/joinedclans", authMiddleware, handleJoinedClans);

router.get("/ownclans", authMiddleware, handleOwnClans);

router.put("/add-member", authMiddleware, handleAddNewMember);

router.put("/remove-member", authMiddleware, handleRemoveMember);

router.put("/leave/:id", authMiddleware, handleLeaveClan);

router
  .route("/clan/:id")
  .all(authMiddleware)
  .get(handleClanDetails)
  .put(handleUpdateClan)
  .delete(handleDeleteClan);

module.exports = router;
