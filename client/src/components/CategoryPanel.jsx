import chesscom from "../assets/chesscom.svg";
import codeforces from "../assets/codeforces.svg";
import logo from "../../public/ClanNationLogo3.png";
import settings from "../assets/setting.png";
import generalclan from "../assets/GeneralClan.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetClanCategory } from "../redux/clanCategorySlice";
import defaultuser from "../assets/defaultuserimage.png";

export default function CategoryPanel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { clanCategory } = useSelector((state) => state.clanCategories);

  return (
    <div className="h-[100vh] border-box flex flex-col  w-[8vw] bg-custom-black-4">
      <div
        onClick={() => {
          navigate("/");
        }}
        className="border-box p-3 cursor-pointer"
      >
        <img src={logo} className="h-24 w-full" alt="ClanNation" />
      </div>
      <div className=" cursor-pointer p-2 h-full flex flex-col justify-end overflow-y-scroll no-scrollbar ">
        <div
          onClick={() => {
            navigate("/user/edit");
          }}
          className={`border-box  p-2 flex justify-center items-center aspect-square`}
        >
          <img
            src={user?.profilepicture || defaultuser}
            className="h-12 aspect-square rounded-full "
            alt="chess.com"
          />
        </div>
        <div
          onClick={() => {
            dispatch(SetClanCategory("general"));
            navigate("/");
          }}
          className={`${
            clanCategory === "general" ? "bg-custom-black-1 " : ""
          }border-box  rounded-full p-2 flex justify-center items-center aspect-square`}
        >
          <img src={generalclan} className="h-12 " alt="chess.com" />
        </div>
        <div
          onClick={() => {
            dispatch(SetClanCategory("chess"));
            navigate("/");
          }}
          className={`${
            clanCategory === "chess" ? "bg-custom-black-1  " : ""
          }border-box rounded-full p-2 flex justify-center items-center aspect-square`}
        >
          <img src={chesscom} className="h-12  " alt="chess.com" />
        </div>
        <div
          onClick={() => {
            dispatch(SetClanCategory("codeforces"));
            navigate("/");
          }}
          className={`${
            clanCategory === "codeforces" ? "bg-custom-black-1 " : ""
          } rounded-full cursor-pointer border-box  p-3 aspect-square flex justify-center items-center`}
        >
          <img src={codeforces} className="h-12 " alt="codeforces.com" />
        </div>
        <div
          onClick={() => {
            navigate("/settings");
          }}
          className="border-box cursor-pointer  p-3 aspect-square  flex justify-center items-center"
        >
          <img src={settings} className="h-12 " alt="settings" />
        </div>
      </div>
    </div>
  );
}
